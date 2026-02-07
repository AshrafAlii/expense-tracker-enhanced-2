# 🚀 Expense Tracker Pro - Enhanced v2.0

A powerful full-stack expense tracking application with advanced features including budget management, income tracking, analytics, and data export.

## ✨ New Features in v2.0

### 🎯 Budget Management
- Set monthly budgets for each category
- Real-time budget tracking with visual indicators
- Budget status alerts (On track / Warning / Over budget)
- Category-wise spending limits

### 💵 Income Tracking
- Track multiple income sources
- Income categorization (Salary, Freelance, Investment, etc.)
- Calculate net balance and savings rate
- Income vs Expense comparison

### 📊 Advanced Analytics
- Interactive charts (Pie, Bar, Line)
- 30-day spending trends
- Payment method distribution
- Category-wise spending analysis
- Highest/Lowest/Average expense tracking

### 🔍 Enhanced Filtering & Search
- Search expenses by description
- Filter by category, payment method, date range
- Amount range filtering
- Sort by date or amount

### 💾 Data Export
- Export expenses to CSV
- Custom date range export
- Easy data backup and analysis

### ✏️ Edit Expenses
- Update existing expense records
- Full edit functionality with validation
- Preserves expense history

### 🏷️ Additional Fields
- Notes/memo field for expenses
- Tags support for better organization
- Recurring expense tracking (future enhancement)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Chart.js with react-chartjs-2
- Axios for API calls
- Responsive CSS Grid & Flexbox

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- RESTful API architecture
- JSON2CSV for data export
- Express Validator

## 📋 Prerequisites

- Node.js v14+ ([Download](https://nodejs.org/))
- MongoDB v4.4+ ([Download](https://www.mongodb.com/try/download/community))
- macOS 10.13+ or Linux

## 🚀 Quick Start

### 1. Extract the Project
```bash
tar -xzf expense-tracker-enhanced.tar.gz
cd expense-tracker-enhanced
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Start MongoDB
```bash
# Mac (with Homebrew)
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
App opens at `http://localhost:3000`

## 📊 Features Overview

### Dashboard
- Total Expenses & Income for current month
- Net Balance calculation
- Savings Rate percentage
- Transaction count and averages
- Category spending breakdown
- Budget status overview

### Expense Management
- ➕ Add expenses with detailed information
- ✏️ Edit existing expenses
- 🗑️ Delete expenses
- 🔍 Advanced search and filtering
- 📥 Export to CSV
- 📝 Add notes and tags

### Income Tracking
- Add income from various sources
- Categorize income (Salary, Freelance, etc.)
- Track income trends
- Calculate income statistics

### Budget Management
- Set monthly budgets per category
- Visual budget progress bars
- Color-coded status indicators
- Budget alerts and warnings
- Remaining budget calculations

### Analytics
- Spending by category (Pie chart)
- Category comparison (Bar chart)
- 30-day spending trend (Line chart)
- Payment method distribution
- Statistical insights

## 🎨 Default Categories with Budgets

| Category | Icon | Budget | Description |
|----------|------|--------|-------------|
| Food & Dining | 🍔 | ₹10,000 | Food, groceries, dining out |
| Transportation | 🚗 | ₹5,000 | Fuel, transport, ride-sharing |
| Entertainment | 🎬 | ₹3,000 | Movies, games, subscriptions |
| Utilities | 💡 | ₹4,000 | Electricity, water, internet |
| Healthcare | 🏥 | ₹5,000 | Medical expenses, medicines |
| Shopping | 🛍️ | ₹8,000 | Clothing, accessories |
| Education | 📚 | ₹3,000 | Courses, books, learning |
| Other | 💼 | ₹5,000 | Miscellaneous expenses |

## 📡 API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (with filters)
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/export` - Export to CSV
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - Get all categories with budget info
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category/budget
- `DELETE /api/categories/:id` - Delete category

### Income
- `GET /api/income` - Get all income records
- `GET /api/income/stats` - Get income statistics
- `POST /api/income` - Create income record
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

## 🔧 Configuration

**Backend** (`backend/server.js`):
- Port: 5000 (default)
- Database: `expense-tracker-enhanced`

**Frontend** (`frontend/src/App.js`):
- API URL: `http://localhost:5000/api`

## 📱 Usage Guide

### Adding an Expense
1. Click "➕ Add Expense" tab
2. Fill in amount, category, description
3. Select date and payment method
4. Optionally add notes
5. Click "Add Expense"

### Setting Budgets
1. Go to "🎯 Budgets" tab
2. Click "Set Budget" or "Edit Budget"
3. Enter monthly budget amount
4. Click "Save"
5. Monitor budget status on Dashboard

### Tracking Income
1. Go to "💵 Income" tab
2. Click "➕ Add Income"
3. Enter amount, source, category
4. Save the record

### Viewing Analytics
1. Go to "📈 Analytics" tab
2. View interactive charts
3. Analyze spending patterns
4. Check payment method distribution

### Exporting Data
1. Go to "📝 All Expenses" tab
2. Apply filters if needed
3. Click "📥 Export CSV"
4. File downloads automatically

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Restart MongoDB
brew services restart mongodb-community@7.0

# Check status
brew services list | grep mongodb
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### npm Install Errors
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🔄 What's Changed from v1.0

### Added
- ✅ Budget management system
- ✅ Income tracking
- ✅ Advanced analytics with multiple charts
- ✅ Data export to CSV
- ✅ Edit expense functionality
- ✅ Enhanced filtering and search
- ✅ Notes field for expenses
- ✅ Payment method statistics
- ✅ 30-day spending trend
- ✅ Net balance calculation
- ✅ Savings rate tracking

### Improved
- Better UI/UX with color-coded status
- More responsive design
- Enhanced validation
- Better error handling
- Optimized database queries
- Improved component structure

### All Previous Features Still Work
- ✅ Add expenses
- ✅ Delete expenses
- ✅ View expenses
- ✅ Category management
- ✅ Payment method tracking
- ✅ Monthly statistics

## 🚀 Future Enhancements

- User authentication
- Multi-currency support
- Receipt image upload
- Recurring expenses automation
- Email/SMS notifications
- Mobile app
- Data synchronization
- Budget recommendations
- Expense predictions

## 📝 Testing Checklist

- [ ] Add expense
- [ ] Edit expense
- [ ] Delete expense
- [ ] Set budget for category
- [ ] Add income
- [ ] View dashboard
- [ ] Check analytics charts
- [ ] Export to CSV
- [ ] Filter expenses
- [ ] Search expenses
- [ ] Check budget alerts

## 📄 License

MIT License - Open source and free to use

## 🤝 Support

For issues or questions:
1. Check troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Verify MongoDB is running

---

**Built with ❤️ using React, Node.js, and MongoDB**

**Version 2.0 - January 2024**
