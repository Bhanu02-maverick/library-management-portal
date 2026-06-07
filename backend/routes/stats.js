const router = require('express').Router();
const { pool } = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

router.get('/dashboard', authMiddleware, requireRole('admin', 'librarian'), async (req, res) => {
  try {
    const [[{ totalBooks }]]    = await pool.query('SELECT COUNT(*) AS totalBooks FROM books');
    const [[{ totalMembers }]]  = await pool.query("SELECT COUNT(*) AS totalMembers FROM users WHERE role = 'member'");
    const [[{ activeIssues }]]  = await pool.query("SELECT COUNT(*) AS activeIssues FROM borrows WHERE status = 'active'");
    const [[{ overdueCount }]]  = await pool.query("SELECT COUNT(*) AS overdueCount FROM borrows WHERE status = 'active' AND due_date < CURDATE()");
    const [[{ totalFines }]]    = await pool.query("SELECT COALESCE(SUM(amount),0) AS totalFines FROM fines WHERE paid = 0");
    const [[{ returnedToday }]] = await pool.query("SELECT COUNT(*) AS returnedToday FROM borrows WHERE returned_date = CURDATE()");

    const [byCategory] = await pool.query(
      'SELECT c.name, COUNT(b.id) AS count, c.color FROM categories c LEFT JOIN books b ON b.category_id = c.id GROUP BY c.id, c.name, c.color ORDER BY count DESC LIMIT 6'
    );

    const [recentActivity] = await pool.query(
      'SELECT br.id, br.issued_date, br.due_date, br.status, u.name AS member, bk.title AS book FROM borrows br JOIN users u ON br.user_id = u.id JOIN books bk ON br.book_id = bk.id ORDER BY br.issued_date DESC LIMIT 10'
    );

    const [trend] = await pool.query(
      "SELECT DATE_FORMAT(issued_date, '%b %Y') AS month, COUNT(*) AS borrows FROM borrows WHERE issued_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY DATE_FORMAT(issued_date, '%Y-%m'), DATE_FORMAT(issued_date, '%b %Y') ORDER BY MIN(issued_date)"
    );

    res.json({
      success: true,
      stats: { totalBooks, totalMembers, activeIssues, overdueCount, totalFines, returnedToday },
      byCategory,
      recentActivity,
      trend,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
