const router = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/users  (admin/librarian only)
router.get('/', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const { search = '', role, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['1=1'];
    let params = [];
    if (search) { where.push('(name LIKE ? OR email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
    if (role)   { where.push('role = ?'); params.push(role); }

    const [users] = await pool.query(
      `SELECT id, name, email, role, phone, joined_at, is_active FROM users WHERE ${where.join(' AND ')} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE ${where.join(' AND ')}`, params);
    res.json({ success: true, users, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'member' && req.user.id !== parseInt(req.params.id))
      return res.status(403).json({ success: false, message: 'Forbidden' });

    const [rows] = await pool.query(
      'SELECT id, name, email, role, phone, address, joined_at, is_active FROM users WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'member' && req.user.id !== parseInt(req.params.id))
      return res.status(403).json({ success: false, message: 'Forbidden' });

    const allowed = ['name', 'phone', 'address'];
    if (req.user.role === 'admin') allowed.push('role', 'is_active');
    const updates = [];
    const values  = [];
    allowed.forEach(f => { if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); } });
    if (updates.length === 0) return res.status(400).json({ success: false, message: 'Nothing to update' });
    values.push(req.params.id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
