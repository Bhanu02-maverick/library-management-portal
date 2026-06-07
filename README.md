# 📚 Library Management Portal — Full-Stack

A complete Library Management System built with **React.js** (frontend) + **Node.js / Express** (backend) + **MySQL** (database).

---

## 🗂 Project Structure

```
library-portal/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js            # JWT auth + role guard
│   ├── routes/
│   │   ├── auth.js            # POST /login, /register, GET /me
│   │   ├── books.js           # Full CRUD /api/books
│   │   ├── borrows.js         # Issue / return books
│   │   ├── users.js           # Member management
│   │   └── stats.js           # Dashboard analytics
│   ├── server.js              # Express app entry point
│   ├── .env                   # Environment variables
│   └── package.json
├── database/
│   └── schema.sql             # Full MySQL schema + seed data
└── frontend/                  # React app (create-react-app or Vite)
    └── src/
        └── App.jsx            # Complete UI (LibraryPortal.jsx)
```

---

## ⚙️ Setup Instructions

### 1. MySQL Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend (Node.js + Express)

```bash
cd backend
npm install
```

Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_portal
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
FINE_PER_DAY=1.00
BORROW_DAYS=14
```

```bash
npm run dev      # development (nodemon)
npm start        # production
```

### 3. Frontend (React)

```bash
npx create-react-app frontend
cd frontend
```
Replace `src/App.js` contents with `LibraryPortal.jsx`.

```bash
npm start        # runs on http://localhost:3000
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Auth Required | Description               |
|--------|---------------------------|---------------|---------------------------|
| POST   | /api/auth/register        | No            | Register new user         |
| POST   | /api/auth/login           | No            | Login, get JWT token      |
| GET    | /api/auth/me              | Yes           | Get current user profile  |
| GET    | /api/books                | No            | List/search books         |
| GET    | /api/books/:id            | No            | Get single book           |
| POST   | /api/books                | Admin/Lib     | Add new book              |
| PUT    | /api/books/:id            | Admin/Lib     | Update book               |
| DELETE | /api/books/:id            | Admin only    | Delete book               |
| GET    | /api/borrows              | Yes           | List borrow records       |
| POST   | /api/borrows              | Admin/Lib     | Issue a book              |
| PUT    | /api/borrows/:id/return   | Admin/Lib     | Return a book             |
| GET    | /api/users                | Admin/Lib     | List all users            |
| GET    | /api/users/:id            | Yes           | Get user by ID            |
| PUT    | /api/users/:id            | Yes           | Update user               |
| GET    | /api/stats/dashboard      | Admin/Lib     | Dashboard statistics      |

---

## 🗄 Database Schema

| Table         | Description                              |
|---------------|------------------------------------------|
| `users`       | Members, librarians, admins with roles   |
| `books`       | Book inventory with copies tracking      |
| `authors`     | Author profiles                          |
| `categories`  | Book genres/categories                   |
| `borrows`     | Issue/return records with due dates      |
| `reservations`| Book reservation queue                   |
| `fines`       | Auto-calculated overdue fines            |
| `audit_log`   | Full action audit trail (JSON details)   |

---

## 🔐 Roles & Permissions

| Feature              | Admin | Librarian | Member |
|----------------------|-------|-----------|--------|
| View books           | ✅    | ✅        | ✅     |
| Add/edit books       | ✅    | ✅        | ❌     |
| Delete books         | ✅    | ❌        | ❌     |
| Issue books          | ✅    | ✅        | ❌     |
| Return books         | ✅    | ✅        | ❌     |
| View all members     | ✅    | ✅        | ❌     |
| View dashboard stats | ✅    | ✅        | ❌     |
| Manage users         | ✅    | ❌        | ❌     |

---

## 💰 Fine Calculation

Fines are auto-calculated on book return:
```
fine = max(0, days_overdue) × FINE_PER_DAY
```
Configured via `.env`: `FINE_PER_DAY=1.00`

---

## 🛠 Tech Stack

- **Frontend**: React.js, Hooks (useState, useEffect, useContext), Context API
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs
- **Database**: MySQL 8, Connection Pooling, Transactions for concurrent access
- **Security**: JWT tokens, bcrypt password hashing, role-based access control
