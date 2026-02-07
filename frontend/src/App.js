import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import IncomeTracker from './components/IncomeTracker';
import BudgetManager from './components/BudgetManager';
import Analytics from './components/Analytics';
import './App.css';

const API_URL = 'https://expense-tracker-enhanced-2-production.up.railway.app/';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalCount: 0,
    categoryStats: [],
    paymentMethodStats: [],
    dailyTrend: []
  });
  const [incomeStats, setIncomeStats] = useState({
    totalAmount: 0,
    totalCount: 0
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    paymentMethod: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCategories(),
        fetchExpenses(),
        fetchIncome(),
        fetchStats(),
        fetchIncomeStats()
      ]);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchExpenses = async (filterParams = {}) => {
    try {
      setLoading(true);
      const params = { ...filters, ...filterParams };
      const response = await axios.get(`${API_URL}/expenses`, { params });
      setExpenses(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncome = async () => {
    try {
      const response = await axios.get(`${API_URL}/income`);
      setIncome(response.data);
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const response = await axios.get(`${API_URL}/expenses/stats?month=${month}&year=${year}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchIncomeStats = async () => {
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      const response = await axios.get(`${API_URL}/income/stats?month=${month}&year=${year}`);
      setIncomeStats(response.data);
    } catch (error) {
      console.error('Error fetching income stats:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      const response = await axios.post(`${API_URL}/expenses`, expenseData);
      setExpenses([response.data, ...expenses]);
      await fetchStats();
      setError('');
      return { success: true, message: 'Expense added successfully!' };
    } catch (error) {
      console.error('Error adding expense:', error);
      return { success: false, message: 'Failed to add expense' };
    }
  };

  const handleUpdateExpense = async (expenseData) => {
    try {
      const response = await axios.put(
        `${API_URL}/expenses/${editingExpense._id}`,
        expenseData
      );
      setExpenses(
        expenses.map((exp) =>
          exp._id === editingExpense._id ? response.data : exp
        )
      );
      setEditingExpense(null);
      await fetchStats();
      return { success: true, message: 'Expense updated successfully!' };
    } catch (error) {
      console.error('Error updating expense:', error);
      return { success: false, message: 'Failed to update expense' };
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      setExpenses(expenses.filter((exp) => exp._id !== id));
      await fetchStats();
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchExpenses(newFilters);
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/expenses/export`, {
        params: filters,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expenses-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export expenses');
    }
  };

  const handleAddIncome = async (incomeData) => {
    try {
      const response = await axios.post(`${API_URL}/income`, incomeData);
      setIncome([response.data, ...income]);
      await fetchIncomeStats();
      return { success: true, message: 'Income added successfully!' };
    } catch (error) {
      console.error('Error adding income:', error);
      return { success: false, message: 'Failed to add income' };
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      await axios.delete(`${API_URL}/income/${id}`);
      setIncome(income.filter((inc) => inc._id !== id));
      await fetchIncomeStats();
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete income');
    }
  };

  const handleUpdateBudget = async (categoryId, budget) => {
    try {
      await axios.put(`${API_URL}/categories/${categoryId}`, { budget });
      await fetchCategories();
      return { success: true };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false };
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>💰 Expense Tracker Pro</h1>
          <p>Advanced expense management with budgets and analytics</p>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}

      <nav className="app-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          {editingExpense ? '✏️ Edit' : '➕ Add'} Expense
        </button>
        <button
          className={activeTab === 'list' ? 'active' : ''}
          onClick={() => setActiveTab('list')}
        >
          📝 All Expenses
        </button>
        <button
          className={activeTab === 'income' ? 'active' : ''}
          onClick={() => setActiveTab('income')}
        >
          💵 Income
        </button>
        <button
          className={activeTab === 'budget' ? 'active' : ''}
          onClick={() => setActiveTab('budget')}
        >
          🎯 Budgets
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </nav>

      <main className="app-main">
        {loading && activeTab === 'list' ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                expenses={expenses}
                income={income}
                stats={stats}
                incomeStats={incomeStats}
                categories={categories}
              />
            )}

            {activeTab === 'add' && (
              <ExpenseForm
                categories={categories}
                onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
                editingExpense={editingExpense}
                onCancel={handleCancelEdit}
              />
            )}

            {activeTab === 'list' && (
              <ExpenseList
                expenses={expenses}
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDeleteExpense}
                onFilterChange={handleFilterChange}
                filters={filters}
                onExport={handleExport}
              />
            )}

            {activeTab === 'income' && (
              <IncomeTracker
                income={income}
                incomeStats={incomeStats}
                onAddIncome={handleAddIncome}
                onDeleteIncome={handleDeleteIncome}
              />
            )}

            {activeTab === 'budget' && (
              <BudgetManager
                categories={categories}
                onUpdateBudget={handleUpdateBudget}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics
                expenses={expenses}
                stats={stats}
                categories={categories}
              />
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Expense Tracker Pro - Enhanced v2.0 | Built with React & Node.js</p>
      </footer>
    </div>
  );
}

export default App;
