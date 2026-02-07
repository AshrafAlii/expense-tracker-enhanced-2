const express = require('express');
const router = express.Router();
const Income = require('../models/Income');

// @route   GET /api/income
// @desc    Get all income records
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    let sortOption = { date: -1 };
    if (sort === 'amount-asc') sortOption = { amount: 1 };
    if (sort === 'amount-desc') sortOption = { amount: -1 };
    if (sort === 'date-asc') sortOption = { date: 1 };

    const incomes = await Income.find(query).sort(sortOption);
    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/income/stats
// @desc    Get income statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { month, year } = req.query;
    let matchStage = {};

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      matchStage.date = { $gte: start, $lte: end };
    }

    const categoryStats = await Income.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalStats = await Income.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalCount: { $sum: 1 },
          avgIncome: { $avg: '$amount' }
        }
      }
    ]);

    res.json({
      categoryStats,
      totalAmount: totalStats.length > 0 ? totalStats[0].totalAmount : 0,
      totalCount: totalStats.length > 0 ? totalStats[0].totalCount : 0,
      avgIncome: totalStats.length > 0 ? totalStats[0].avgIncome : 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/income
// @desc    Create income record
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { amount, source, description, date, category, isRecurring, recurringFrequency } = req.body;

    if (!amount || !source) {
      return res.status(400).json({ message: 'Please provide amount and source' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const income = new Income({
      amount,
      source,
      description: description || '',
      date: date || Date.now(),
      category: category || 'Other',
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || null
    });

    const createdIncome = await income.save();
    res.status(201).json(createdIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/income/:id
// @desc    Update income record
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { amount, source, description, date, category, isRecurring, recurringFrequency } = req.body;

    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    if (amount && amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    if (amount) income.amount = amount;
    if (source) income.source = source;
    if (description !== undefined) income.description = description;
    if (date) income.date = date;
    if (category) income.category = category;
    if (isRecurring !== undefined) income.isRecurring = isRecurring;
    if (recurringFrequency !== undefined) income.recurringFrequency = recurringFrequency;

    const updatedIncome = await income.save();
    res.json(updatedIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/income/:id
// @desc    Delete income record
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: 'Income record not found' });
    }

    await income.deleteOne();
    res.json({ message: 'Income record removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
