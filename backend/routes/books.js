const router = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/books  — list with search, filter, pagination
router.get('/', async (req, res) => {
  try {
    const { search = '', category, author, page = 1, limit = 12, available } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    let params = [];

    if (search) {
      where.push('(b.title LIKE ? OR a.name LIKE ? OR b.isbn LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) { where.push('b.category_id = ?'); params.push(category); }
    if (author)   { where.push('b.author_id = ?');   params.push(author); }
    if (available === 'true') { where.push('b.available_copies > 0'); }

    const whereClause = where.join(' AND ');
    const [books] = await pool.query(`
      SELECT b.*, a.name AS author_name, c.name AS category_name, c.color AS category_color
      FROM books b
      JOIN authors    a ON b.author_id   = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const [[{ total }]] = await pool.query(`
      SELECT COUNT(*) AS total FROM books b
      JOIN authors a ON b.author_id = a.id
      WHERE ${whereClause}
    `, params);

    res.json({ success: true, books, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/books/:id
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT b.*, a.name AS author_name, a.bio AS author_bio,
             c.name AS category_name, c.color AS category_color
      FROM books b
      JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
      WHERE b.id = ?
    `, [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Book not found' });
    res.json({ success: true, book: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/books  (admin/librarian only)
router.post('/', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const { title, author_id, category_id, isbn, publisher, published_year,
            description, cover_url, total_copies = 1, shelf_location, language = 'English', pages } = req.body;
    if (!title || !author_id)
      return res.status(400).json({ success: false, message: 'Title and author are required' });

    const [result] = await pool.query(
      `INSERT INTO books (title, author_id, category_id, isbn, publisher, published_year,
        description, cover_url, total_copies, available_copies, shelf_location, language, pages)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [title, author_id, category_id || null, isbn || null, publisher || null,
       published_year || null, description || null, cover_url || null,
       total_copies, total_copies, shelf_location || null, language, pages || null]
    );
    res.status(201).json({ success: true, message: 'Book added', id: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/books/:id
router.put('/:id', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const fields = ['title','author_id','category_id','isbn','publisher','published_year',
                    'description','cover_url','total_copies','shelf_location','language','pages'];
    const updates = [];
    const values  = [];
    fields.forEach(f => {
      if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
    });
    if (updates.length === 0)
      return res.status(400).json({ success: false, message: 'No fields to update' });

    values.push(req.params.id);
    await pool.query(`UPDATE books SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'Book updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/books/:id
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const [active] = await pool.query(
      "SELECT id FROM borrows WHERE book_id = ? AND status = 'active'", [req.params.id]
    );
    if (active.length > 0)
      return res.status(400).json({ success: false, message: 'Cannot delete book with active borrows' });
    await pool.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
