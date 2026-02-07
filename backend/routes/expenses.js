const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { Parser } = require('json2csv');

// @route   GET /api/expenses
// @desc    Get all expenses with advanced filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, paymentMethod, search, minAmount, maxAmount, tags, sort } = req.query;
    let query = {};

    // Build filter query
    if (category) {
      query.category = category;
    }

    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Search in description
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // Tags filter
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    // Determine sort order
    let sortOption = { date: -1 }; // Default: newest first
    if (sort === 'amount-asc') sortOption = { amount: 1 };
    if (sort === 'amount-desc') sortOption = { amount: -1 };
    if (sort === 'date-asc') sortOption = { date: 1 };
    if (sort === 'date-desc') sortOption = { date: -1 };

    const expenses = await Expense.find(query).sort(sortOption);
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/expenses/export
// @desc    Export expenses to CSV
// @access  Public
router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    
    const fields = ['date', 'description', 'category', 'amount', 'paymentMethod', 'notes'];
    const opts = { fields };
    
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(expenses);
      
      res.header('Content-Type', 'text/csv');
      res.attachment('expenses.csv');
      res.send(csv);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error generating CSV' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/expenses/stats
// @desc    Get expense statistics with advanced analytics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    
    let matchStage = {};
    
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      matchStage.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      matchStage.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }

    // Get total by category
    const categoryStats = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avg: { $avg: '$amount' },
          max: { $max: '$amount' },
          min: { $min: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Get total by payment method
    const paymentMethodStats = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Get daily spending trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyTrend = await Expense.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get overall totals
    const totalStats = await Expense.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          avgExpense: { $avg: '$amount' },
          maxExpense: { $max: '$amount' },
          minExpense: { $min: '$amount' }
        }
      }
    ]);

    const stats = totalStats.length > 0 ? totalStats[0] : {
      totalAmount: 0,
      totalCount: 0,
      avgExpense: 0,
      maxExpense: 0,
      minExpense: 0
    };

    res.json({
      categoryStats,
      paymentMethodStats,
      dailyTrend,
      totalAmount: stats.totalAmount,
      totalCount: stats.totalCount,
      avgExpense: stats.avgExpense,
      maxExpense: stats.maxExpense,
      minExpense: stats.minExpense
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/expenses/:id
// @desc    Get expense by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/expenses
// @desc    Create a new expense
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date, paymentMethod, tags, notes, isRecurring, recurringFrequency } = req.body;

    // Validation
    if (!amount || !category || !description) {
      return res.status(400).json({ message: 'Please provide amount, category, and description' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = new Expense({
      amount,
      category,
      description,
      date: date || Date.now(),
      paymentMethod: paymentMethod || 'Cash',
      tags: tags || [],
      notes: notes || '',
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || null
    });

    const createdExpense = await expense.save();
    res.status(201).json(createdExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, description, date, paymentMethod, tags, notes, isRecurring, recurringFrequency } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Validation
    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Update fields
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (description) expense.description = description;
    if (date) expense.date = date;
    if (paymentMethod) expense.paymentMethod = paymentMethod;
    if (tags !== undefined) expense.tags = tags;
    if (notes !== undefined) expense.notes = notes;
    if (isRecurring !== undefined) expense.isRecurring = isRecurring;
    if (recurringFrequency !== undefined) expense.recurringFrequency = recurringFrequency;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed', id: req.params.id });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/expenses
// @desc    Delete multiple expenses
// @access  Public
router.delete('/', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Please provide expense IDs to delete' });
    }

    const result = await Expense.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} expense(s) removed` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
