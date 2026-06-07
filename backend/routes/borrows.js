const router = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/borrows  (admin/librarian sees all; member sees own)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, user_id, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    let params = [];

    if (req.user.role === 'member') {
      where.push('br.user_id = ?'); params.push(req.user.id);
    } else if (user_id) {
      where.push('br.user_id = ?'); params.push(user_id);
    }
    if (status) { where.push('br.status = ?'); params.push(status); }

    const whereClause = where.join(' AND ');
    const [borrows] = await pool.query(`
      SELECT br.*, u.name AS member_name, u.email AS member_email,
             bk.title AS book_title, bk.cover_url,
             DATEDIFF(CURDATE(), br.due_date) AS days_overdue
      FROM borrows br
      JOIN users u  ON br.user_id = u.id
      JOIN books bk ON br.book_id = bk.id
      WHERE ${whereClause}
      ORDER BY br.issued_date DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM borrows br WHERE ${whereClause}`, params
    );

    res.json({ success: true, borrows, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/borrows  — issue a book
router.post('/', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { user_id, book_id, notes } = req.body;
    const borrowDays = parseInt(process.env.BORROW_DAYS) || 14;

    // Check availability
    const [[book]] = await conn.query('SELECT available_copies FROM books WHERE id = ? FOR UPDATE', [book_id]);
    if (!book || book.available_copies < 1) {
      await conn.rollback();
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    const due_date = new Date();
    due_date.setDate(due_date.getDate() + borrowDays);

    const [result] = await conn.query(
      `INSERT INTO borrows (user_id, book_id, issued_by, due_date, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, book_id, req.user.id, due_date.toISOString().split('T')[0], notes || null]
    );
    await conn.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [book_id]);
    await conn.commit();

    res.status(201).json({ success: true, message: 'Book issued successfully', id: result.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

// PUT /api/borrows/:id/return  — return a book
router.put('/:id/return', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [[borrow]] = await conn.query("SELECT * FROM borrows WHERE id = ? AND status = 'active' FOR UPDATE", [req.params.id]);
    if (!borrow) {
      await conn.rollback();
      return res.status(404).json({ success: false, message: 'Active borrow not found' });
    }

    const today      = new Date();
    const due        = new Date(borrow.due_date);
    const finePerDay = parseFloat(process.env.FINE_PER_DAY) || 1.00;
    const daysLate   = Math.max(0, Math.ceil((today - due) / 86400000));
    const fine       = +(daysLate * finePerDay).toFixed(2);

    await conn.query(
      `UPDATE borrows SET returned_date = CURDATE(), status = 'returned', fine_amount = ? WHERE id = ?`,
      [fine, borrow.id]
    );
    await conn.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', [borrow.book_id]);

    if (fine > 0) {
      await conn.query(
        'INSERT INTO fines (borrow_id, user_id, amount, reason) VALUES (?,?,?,?)',
        [borrow.id, borrow.user_id, fine, `${daysLate} day(s) overdue`]
      );
    }
    await conn.commit();
    res.json({ success: true, message: 'Book returned', fine_amount: fine, days_late: daysLate });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;
