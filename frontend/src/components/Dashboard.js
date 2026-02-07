import React from 'react';

const Dashboard = ({ expenses, income, stats, incomeStats, categories }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[new Date().getMonth()];
  };

  const netBalance = incomeStats.totalAmount - stats.totalAmount;
  const savingsRate = incomeStats.totalAmount > 0 
    ? ((netBalance / incomeStats.totalAmount) * 100).toFixed(1)
    : 0;

  // Calculate budget status
  const budgetOverview = categories.map(cat => {
    const spending = cat.currentMonthSpending || 0;
    const budget = cat.budget || 0;
    const percentage = budget > 0 ? (spending / budget) * 100 : 0;
    return {
      ...cat,
      spending,
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    };
  }).filter(cat => cat.budget > 0);

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p className="stat-value">{formatCurrency(stats.totalAmount)}</p>
            <span className="stat-label">{getMonthName()} {new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <p className="stat-value">{formatCurrency(incomeStats.totalAmount)}</p>
            <span className="stat-label">{incomeStats.totalCount} transaction(s)</span>
          </div>
        </div>

        <div className={`stat-card balance ${netBalance < 0 ? 'negative' : 'positive'}`}>
          <div className="stat-icon">{netBalance >= 0 ? '📈' : '📉'}</div>
          <div className="stat-info">
            <h3>Net Balance</h3>
            <p className="stat-value">{formatCurrency(netBalance)}</p>
            <span className="stat-label">Savings Rate: {savingsRate}%</span>
          </div>
        </div>

        <div className="stat-card count">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Transactions</h3>
            <p className="stat-value">{stats.totalCount}</p>
            <span className="stat-label">
              Avg: {stats.totalCount > 0 ? formatCurrency(stats.totalAmount / stats.totalCount) : '₹0'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="category-breakdown">
          <h3>Category Spending</h3>
          <div className="category-list">
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              stats.categoryStats.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-name">{cat._id}</div>
                  <div className="category-bar-container">
                    <div 
                      className="category-bar"
                      style={{
                        width: `${(cat.total / stats.totalAmount) * 100}%`,
                        backgroundColor: `hsl(${index * 40}, 70%, 60%)`
                      }}
                    ></div>
                  </div>
                  <div className="category-amount">
                    {formatCurrency(cat.total)}
                    <span className="category-percentage">
                      ({Math.round((cat.total / stats.totalAmount) * 100)}%)
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No expenses yet. Start tracking your spending!</p>
            )}
          </div>
        </div>

        {budgetOverview.length > 0 && (
          <div className="budget-overview">
            <h3>Budget Status</h3>
            <div className="budget-list">
              {budgetOverview.map((cat, index) => (
                <div key={index} className={`budget-item ${cat.status}`}>
                  <div className="budget-header">
                    <span className="budget-category">{cat.icon} {cat.name}</span>
                    <span className="budget-spent">
                      {formatCurrency(cat.spending)} / {formatCurrency(cat.budget)}
                    </span>
                  </div>
                  <div className="budget-progress">
                    <div 
                      className="budget-progress-bar"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="budget-footer">
                    <span>{cat.percentage.toFixed(1)}% used</span>
                    {cat.budgetRemaining > 0 ? (
                      <span className="remaining">
                        {formatCurrency(cat.budgetRemaining)} remaining
                      </span>
                    ) : (
                      <span className="over">
                        {formatCurrency(Math.abs(cat.budgetRemaining))} over budget
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
