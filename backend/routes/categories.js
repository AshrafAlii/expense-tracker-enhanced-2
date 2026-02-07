const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Expense = require('../models/Expense');

// @route   GET /api/categories
// @desc    Get all categories with spending info
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Get current month spending for each category
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    const categoriesWithSpending = await Promise.all(
      categories.map(async (category) => {
        const spending = await Expense.aggregate([
          {
            $match: {
              category: category.name,
              date: { $gte: startOfMonth, $lte: endOfMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);
        
        const totalSpent = spending.length > 0 ? spending[0].total : 0;
        const budgetRemaining = category.budget - totalSpent;
        const budgetPercentage = category.budget > 0 ? (totalSpent / category.budget) * 100 : 0;
        
        return {
          ...category.toObject(),
          currentMonthSpending: totalSpent,
          budgetRemaining: budgetRemaining,
          budgetPercentage: budgetPercentage,
          isOverBudget: budgetRemaining < 0
        };
      })
    );
    
    res.json(categoriesWithSpending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, icon, color, budget, description } = req.body;

    if (!name || !icon || !color) {
      return res.status(400).json({ message: 'Please provide name, icon, and color' });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      icon,
      color,
      budget: budget || 0,
      description: description || ''
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (including budget)
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { name, icon, color, budget, description } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name;
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (budget !== undefined) category.budget = budget;
    if (description !== undefined) category.description = description;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is in use
    const expensesCount = await Expense.countDocuments({ category: category.name });
    if (expensesCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete category. ${expensesCount} expense(s) are using this category.` 
      });
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
