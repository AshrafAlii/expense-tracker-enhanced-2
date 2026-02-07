#!/bin/bash

echo "========================================"
echo "Expense Tracker Pro v2.0 - Installation"
echo "========================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found!"
    echo "Install from: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js: $(node -v)"
echo "✅ npm: $(npm -v)"
echo ""

# Check/Install MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  Installing MongoDB..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew required!"
        echo "Install: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew tap mongodb/brew
    brew install mongodb-community@7.0
fi

echo "✅ MongoDB installed"
echo ""

# Start MongoDB
echo "Starting MongoDB..."
brew services start mongodb-community@7.0
sleep 3
echo "✅ MongoDB started"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend ready"
cd ..
echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend ready"
cd ..
echo ""

echo "========================================"
echo "✅ Installation Complete!"
echo "========================================"
echo ""
echo "🚀 Quick Start:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 Features:"
echo "  • Budget Management"
echo "  • Income Tracking"
echo "  • Advanced Analytics"
echo "  • Data Export (CSV)"
echo "  • Edit Expenses"
echo "  • Enhanced Filtering"
echo ""
echo "========================================"
