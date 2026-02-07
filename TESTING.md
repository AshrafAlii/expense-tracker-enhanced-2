# 🧪 Testing Guide - Expense Tracker Pro v2.0

## Pre-Testing Setup

1. ✅ MongoDB is running
2. ✅ Backend server is running on port 5000
3. ✅ Frontend app is running on port 3000
4. ✅ Browser console is open (F12)

## 🔴 Critical Tests (Must Pass)

### 1. Basic CRUD Operations

#### Add Expense
- [ ] Navigate to "Add Expense" tab
- [ ] Fill in all required fields (Amount, Category, Description)
- [ ] Click "Add Expense"
- [ ] Success message appears
- [ ] Form clears after submission
- [ ] New expense appears in "All Expenses" tab

#### View Expenses
- [ ] Navigate to "All Expenses" tab
- [ ] Expenses display in list format
- [ ] Total amount calculates correctly
- [ ] All expense details visible (category, date, payment method)

#### Edit Expense
- [ ] Click "Edit" button on an expense
- [ ] Redirects to "Add Expense" tab with pre-filled data
- [ ] Modify the amount
- [ ] Click "Update Expense"
- [ ] Changes reflect in the list
- [ ] Updated expense shows modified data

#### Delete Expense
- [ ] Click "Delete" button on an expense
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] Expense removes from list
- [ ] Total amount updates accordingly

### 2. Budget Management

#### Set Budget
- [ ] Navigate to "Budgets" tab
- [ ] Click "Set Budget" on a category
- [ ] Enter budget amount (e.g., 5000)
- [ ] Click "Save"
- [ ] Budget value displays correctly

#### Budget Tracking
- [ ] Add expense in budgeted category
- [ ] Go to Dashboard
- [ ] Budget overview shows current spending
- [ ] Progress bar displays correctly
- [ ] Percentage calculates accurately

#### Budget Alerts
- [ ] Add expenses to exceed 80% of budget
- [ ] Check Dashboard - should show "⚠️ Approaching limit"
- [ ] Add more to exceed 100%
- [ ] Should show "🚨 Over budget" in red

### 3. Income Tracking

#### Add Income
- [ ] Navigate to "Income" tab
- [ ] Click "Add Income"
- [ ] Fill in amount, source, category
- [ ] Submit form
- [ ] Income appears in list
- [ ] Total income updates

#### Income Statistics
- [ ] Check Dashboard
- [ ] Total Income card shows correct amount
- [ ] Net Balance calculates correctly (Income - Expenses)
- [ ] Savings Rate displays (if income > 0)

### 4. Analytics & Charts

#### View Charts
- [ ] Navigate to "Analytics" tab
- [ ] Pie chart displays category distribution
- [ ] Bar chart shows category comparison
- [ ] Line chart shows 30-day trend
- [ ] All charts render without errors

#### Chart Data
- [ ] Add expenses in different categories
- [ ] Return to Analytics
- [ ] Charts update with new data
- [ ] Percentages calculate correctly

### 5. Filtering & Search

#### Category Filter
- [ ] Go to "All Expenses"
- [ ] Select a category from filter
- [ ] Only expenses in that category display
- [ ] Total updates for filtered results

#### Date Range Filter
- [ ] Select start date
- [ ] Select end date
- [ ] Expenses within range display
- [ ] Expenses outside range are hidden

#### Search Function
- [ ] Type keyword in search box
- [ ] Matching expenses appear
- [ ] Non-matching expenses hidden
- [ ] Search is case-insensitive

### 6. Data Export

#### CSV Export
- [ ] Go to "All Expenses"
- [ ] Click "Export CSV" button
- [ ] File downloads automatically
- [ ] Open CSV file
- [ ] All columns present (date, description, category, amount, etc.)
- [ ] Data matches app display

## 🟡 Enhanced Features Tests

### Tags & Notes
- [ ] Add expense with notes
- [ ] Notes display in expense list
- [ ] Notes save and persist

### Payment Methods
- [ ] Add expenses with different payment methods
- [ ] View Analytics
- [ ] Payment method distribution shows correctly

### Sorting
- [ ] Expenses display newest first by default
- [ ] Filtering maintains sort order

## 🟢 UI/UX Tests

### Responsive Design
- [ ] Resize browser window
- [ ] Layout adapts to smaller screens
- [ ] All buttons remain accessible
- [ ] No horizontal scrolling on mobile size

### Visual Feedback
- [ ] Buttons show hover effects
- [ ] Forms validate before submission
- [ ] Error messages display for invalid input
- [ ] Success messages show for completed actions

### Navigation
- [ ] All tabs accessible
- [ ] Active tab highlighted
- [ ] Tab switching works smoothly
- [ ] No page refreshes on tab change

## 🔵 Performance Tests

### Load Time
- [ ] App loads within 2-3 seconds
- [ ] No console errors on load
- [ ] Charts render smoothly

### Data Handling
- [ ] Add 50+ expenses
- [ ] List scrolls smoothly
- [ ] Filters work quickly
- [ ] Export handles large dataset

## 🟣 Edge Cases & Error Handling

### Validation Tests
- [ ] Try to submit empty expense form - should show error
- [ ] Enter negative amount - should not allow
- [ ] Enter amount with more than 2 decimals
- [ ] Try very large amount (1000000+)

### Network Errors
- [ ] Stop backend server
- [ ] Try to add expense
- [ ] Error message displays
- [ ] App doesn't crash

### Data Integrity
- [ ] Delete category with expenses - should prevent or warn
- [ ] Edit expense to past date
- [ ] Set budget to 0
- [ ] Add income with future date

## 📊 Test Results Template

```
Date: __________
Tester: __________

Critical Tests: ___/35 passed
Enhanced Features: ___/6 passed
UI/UX Tests: ___/12 passed
Performance: ___/4 passed
Edge Cases: ___/8 passed

Total Score: ___/65

Issues Found:
1. _______________________________
2. _______________________________
3. _______________________________

Notes:
_____________________________________
_____________________________________
```

## 🐛 Common Issues & Fixes

### Issue: Expenses not appearing
**Fix:** Check if MongoDB is running, refresh page

### Issue: Budget not updating
**Fix:** Add expense, wait 1-2 seconds, refresh Dashboard

### Issue: Charts not displaying
**Fix:** Clear browser cache, ensure data exists

### Issue: Export not working
**Fix:** Check browser download settings, try different browser

## ✅ Sign-Off Checklist

Before deploying or sharing:
- [ ] All critical tests pass
- [ ] No console errors
- [ ] README is up to date
- [ ] Installation script works
- [ ] All features documented
- [ ] Sample data works correctly

---

**Testing completed by: ____________**  
**Date: ____________**  
**Version tested: 2.0**  
**Status: PASS / FAIL / NEEDS REVIEW**
