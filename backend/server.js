const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Category = require('./models/Category');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize default categories with budgets
const initializeCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const defaultCategories = [
        { name: 'Food & Dining', icon: '🍔', color: '#FF6B6B', budget: 10000, description: 'Food, groceries, and dining out' },
        { name: 'Transportation', icon: '🚗', color: '#4ECDC4', budget: 5000, description: 'Fuel, public transport, ride-sharing' },
        { name: 'Entertainment', icon: '🎬', color: '#FFE66D', budget: 3000, description: 'Movies, games, subscriptions' },
        { name: 'Utilities', icon: '💡', color: '#95E1D3', budget: 4000, description: 'Electricity, water, internet' },
        { name: 'Healthcare', icon: '🏥', color: '#F38181', budget: 5000, description: 'Medical expenses, medicines' },
        { name: 'Shopping', icon: '🛍️', color: '#AA96DA', budget: 8000, description: 'Clothing, accessories, personal items' },
        { name: 'Education', icon: '📚', color: '#FCBAD3', budget: 3000, description: 'Courses, books, learning materials' },
        { name: 'Other', icon: '💼', color: '#A8E6CF', budget: 5000, description: 'Miscellaneous expenses' }
      ];

      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories with budgets initialized');
    }
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

initializeCategories();

// Routes
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/income', require('./routes/income'));

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Enhanced Expense Tracker API',
    version: '2.0.0',
    endpoints: {
      expenses: '/api/expenses',
      categories: '/api/categories',
      income: '/api/income',
      stats: '/api/expenses/stats',
      export: '/api/expenses/export'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📊 Stats: http://localhost:${PORT}/api/expenses/stats`);
  console.log(`💰 Income: http://localhost:${PORT}/api/income`);
  console.log('================================');
});
