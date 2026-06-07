-- ============================================================
-- Library Management Portal - MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS library_portal;
USE library_portal;

-- Users table (librarians + members)
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,       -- bcrypt hash
  role        ENUM('admin','librarian','member') DEFAULT 'member',
  avatar_url  VARCHAR(255),
  phone       VARCHAR(20),
  address     TEXT,
  joined_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_active   BOOLEAN DEFAULT TRUE,
  INDEX idx_email (email),
  INDEX idx_role  (role)
);

-- Categories / Genres
CREATE TABLE categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(7) DEFAULT '#6366f1'
);

-- Authors
CREATE TABLE authors (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  bio  TEXT
);

-- Books
CREATE TABLE books (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  author_id       INT NOT NULL,
  category_id     INT,
  isbn            VARCHAR(20) UNIQUE,
  publisher       VARCHAR(150),
  published_year  YEAR,
  description     TEXT,
  cover_url       VARCHAR(255),
  total_copies    INT DEFAULT 1,
  available_copies INT DEFAULT 1,
  shelf_location  VARCHAR(50),
  language        VARCHAR(50) DEFAULT 'English',
  pages           INT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id)   REFERENCES authors(id)    ON DELETE RESTRICT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_title    (title),
  INDEX idx_isbn     (isbn),
  INDEX idx_author   (author_id),
  INDEX idx_category (category_id)
);

-- Borrow / Issue Records
CREATE TABLE borrows (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  book_id       INT NOT NULL,
  issued_by     INT NOT NULL,              -- librarian who issued
  issued_date   DATE NOT NULL DEFAULT (CURDATE()),
  due_date      DATE NOT NULL,
  returned_date DATE,
  status        ENUM('active','returned','overdue','lost') DEFAULT 'active',
  fine_amount   DECIMAL(8,2) DEFAULT 0.00,
  fine_paid     BOOLEAN DEFAULT FALSE,
  notes         TEXT,
  FOREIGN KEY (user_id)   REFERENCES users(id) ON DELETE RESTRICT,
  FOREIGN KEY (book_id)   REFERENCES books(id) ON DELETE RESTRICT,
  FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_user   (user_id),
  INDEX idx_book   (book_id),
  INDEX idx_status (status),
  INDEX idx_due    (due_date)
);

-- Reservations
CREATE TABLE reservations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  book_id      INT NOT NULL,
  reserved_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at   DATETIME,
  status       ENUM('pending','fulfilled','cancelled','expired') DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_book (user_id, book_id)
);

-- Fines
CREATE TABLE fines (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  borrow_id   INT NOT NULL UNIQUE,
  user_id     INT NOT NULL,
  amount      DECIMAL(8,2) NOT NULL,
  reason      VARCHAR(255),
  paid        BOOLEAN DEFAULT FALSE,
  paid_at     DATETIME,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (borrow_id) REFERENCES borrows(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
);

-- Audit log
CREATE TABLE audit_log (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(50),
  entity_id  INT,
  details    JSON,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- Seed Data
-- ============================================================

INSERT INTO categories (name, color) VALUES
  ('Fiction',         '#6366f1'),
  ('Science',         '#0ea5e9'),
  ('History',         '#f59e0b'),
  ('Technology',      '#10b981'),
  ('Philosophy',      '#8b5cf6'),
  ('Biography',       '#f43f5e'),
  ('Mathematics',     '#14b8a6'),
  ('Arts & Literature','#ec4899');

INSERT INTO authors (name, bio) VALUES
  ('George Orwell',        'English novelist and essayist, journalist and critic.'),
  ('Frank Herbert',        'American science fiction author, best known for Dune.'),
  ('Yuval Noah Harari',    'Israeli public intellectual, historian and author.'),
  ('J.R.R. Tolkien',       'English author, poet, and academic.'),
  ('Stephen Hawking',      'English theoretical physicist and cosmologist.'),
  ('Fyodor Dostoevsky',    'Russian novelist and philosopher.'),
  ('Walter Isaacson',      'American author and journalist.'),
  ('Carl Sagan',           'American astronomer, planetary scientist and author.');

INSERT INTO users (name, email, password, role) VALUES
  ('Admin User',    'admin@library.com',     '$2b$10$examplehash1', 'admin'),
  ('Jane Librarian','librarian@library.com', '$2b$10$examplehash2', 'librarian'),
  ('John Member',   'john@example.com',      '$2b$10$examplehash3', 'member'),
  ('Alice Reader',  'alice@example.com',     '$2b$10$examplehash4', 'member');

INSERT INTO books (title, author_id, category_id, isbn, publisher, published_year, total_copies, available_copies, shelf_location, pages) VALUES
  ('1984',                          1, 1, '9780451524935', 'Signet Classic',    1949, 5, 4, 'A-01', 328),
  ('Animal Farm',                   1, 1, '9780451526342', 'Signet Classic',    1945, 3, 3, 'A-02', 144),
  ('Dune',                          2, 1, '9780441013593', 'Ace Books',         1965, 4, 2, 'B-01', 896),
  ('Sapiens',                       3, 2, '9780062316097', 'Harper Perennial',  2011, 6, 5, 'C-01', 443),
  ('The Lord of the Rings',         4, 1, '9780544003415', 'Houghton Mifflin',  1954, 3, 1, 'A-03', 1178),
  ('A Brief History of Time',       5, 2, '9780553380163', 'Bantam Books',      1988, 4, 4, 'D-01', 212),
  ('Crime and Punishment',          6, 1, '9780486415871', 'Dover Publications',1866, 2, 2, 'A-04', 551),
  ('Steve Jobs',                    7, 6, '9781451648539', 'Simon & Schuster',  2011, 3, 2, 'F-01', 656),
  ('Cosmos',                        8, 2, '9780345539434', 'Ballantine Books',  1980, 2, 2, 'D-02', 365),
  ('Homo Deus',                     3, 2, '9780062464316', 'Harper Perennial',  2015, 4, 3, 'C-02', 464);
