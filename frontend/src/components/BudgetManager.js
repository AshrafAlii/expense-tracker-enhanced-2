import React, { useState } from 'react';

const BudgetManager = ({ categories, onUpdateBudget }) => {
  const [editingId, setEditingId] = useState(null);
  const [budgetValue, setBudgetValue] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setBudgetValue(category.budget);
  };

  const handleSave = async (categoryId) => {
    const result = await onUpdateBudget(categoryId, parseFloat(budgetValue));
    if (result.success) {
      setEditingId(null);
      setBudgetValue('');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setBudgetValue('');
  };

  return (
    <div className="budget-manager">
      <h2>Budget Management</h2>
      <p className="budget-description">
        Set monthly budgets for each category to track your spending limits
      </p>

      <div className="budget-grid">
        {categories.map((category) => {
          const isEditing = editingId === category._id;
          const spending = category.currentMonthSpending || 0;
          const percentage = category.budget > 0 ? (spending / category.budget) * 100 : 0;
          const status = percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good';

          return (
            <div key={category._id} className={`budget-card ${status}`}>
              <div className="budget-card-header">
                <span className="budget-icon" style={{backgroundColor: category.color}}>
                  {category.icon}
                </span>
                <h3>{category.name}</h3>
              </div>

              <div className="budget-card-body">
                {isEditing ? (
                  <div className="budget-edit">
                    <input
                      type="number"
                      value={budgetValue}
                      onChange={(e) => setBudgetValue(e.target.value)}
                      placeholder="Enter budget"
                      autoFocus
                    />
                    <div className="budget-edit-actions">
                      <button onClick={() => handleSave(category._id)} className="btn btn-sm btn-success">
                        Save
                      </button>
                      <button onClick={handleCancel} className="btn btn-sm btn-secondary">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="budget-amount">
                      <span className="budget-label">Monthly Budget:</span>
                      <span className="budget-value">{formatCurrency(category.budget)}</span>
                    </div>
                    <div className="budget-spending">
                      <span className="budget-label">Current Spending:</span>
                      <span className="budget-value">{formatCurrency(spending)}</span>
                    </div>
                    <div className="budget-progress">
                      <div className="budget-progress-bar-container">
                        <div 
                          className="budget-progress-bar"
                          style={{width: `${Math.min(percentage, 100)}%`}}
                        ></div>
                      </div>
                      <span className="budget-percentage">{percentage.toFixed(1)}%</span>
                    </div>
                    {category.budget > 0 && (
                      <div className={`budget-status ${status}`}>
                        {status === 'good' && '✅ On track'}
                        {status === 'warning' && '⚠️ Approaching limit'}
                        {status === 'over' && '🚨 Over budget'}
                      </div>
                    )}
                    <button onClick={() => handleEdit(category)} className="btn btn-sm btn-primary">
                      {category.budget > 0 ? 'Edit Budget' : 'Set Budget'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetManager;
