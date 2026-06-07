require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { testConnection } = require('./config/db');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',   require('./routes/auth'));
app.use('/api/books',  require('./routes/books'));
app.use('/api/borrows',require('./routes/borrows'));
app.use('/api/users',  require('./routes/users'));
app.use('/api/stats',  require('./routes/stats'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Library Portal API running on http://localhost:${PORT}`);
    console.log(`📚  Endpoints:`);
    console.log(`    POST   /api/auth/login`);
    console.log(`    POST   /api/auth/register`);
    console.log(`    GET    /api/books`);
    console.log(`    POST   /api/books`);
    console.log(`    GET    /api/borrows`);
    console.log(`    POST   /api/borrows`);
    console.log(`    PUT    /api/borrows/:id/return`);
    console.log(`    GET    /api/users`);
    console.log(`    GET    /api/stats/dashboard`);
  });
});
