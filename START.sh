#!/bin/bash
echo "========================================="
echo "  LibraryOS – Full Stack Setup"
echo "========================================="

echo ""
echo "STEP 1: Import MySQL database..."
echo "  mysql -u root -p < database/schema.sql"

echo ""
echo "STEP 2: Start Backend..."
cd backend
npm install
cp .env .env.bak 2>/dev/null
echo "  Edit backend/.env with your MySQL password"
echo "  Then run: npm run dev"

echo ""
echo "STEP 3: Start Frontend (new terminal)..."
cd ..
npm install
npm start
echo "  Opens at: http://localhost:3000"
echo "========================================="
