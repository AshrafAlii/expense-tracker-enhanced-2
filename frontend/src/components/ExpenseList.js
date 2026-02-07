import React, { useState } from 'react';

const ExpenseList = ({ expenses, categories, onEdit, onDelete, onFilterChange, filters, onExport }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDelete = (id, description) => {
    if (window.confirm(`Delete "${description}"?`)) {
      onDelete(id);
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="expense-list-container">
      <div className="list-header">
        <h3>All Expenses ({expenses.length})</h3>
        <button onClick={onExport} className="btn btn-export">📥 Export CSV</button>
      </div>

      <div className="filters">
        <input type="text" placeholder="Search..." value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)} />
        <select value={localFilters.category || ''} onChange={(e) => handleFilterChange('category', e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((cat) => <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>)}
        </select>
        <select value={localFilters.paymentMethod || ''} onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}>
          <option value="">All Payments</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
          <option value="Other">Other</option>
        </select>
        <input type="date" placeholder="Start Date" value={localFilters.startDate || ''}
          onChange={(e) => handleFilterChange('startDate', e.target.value)} />
        <input type="date" placeholder="End Date" value={localFilters.endDate || ''}
          onChange={(e) => handleFilterChange('endDate', e.target.value)} />
      </div>

      <div className="list-summary">
        <strong>Total: {formatCurrency(total)}</strong>
      </div>

      <div className="expense-list">
        {expenses.length === 0 ? (
          <p className="no-expenses">No expenses found.</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} className="expense-item">
              <div className="expense-details">
                <h4>{exp.description}</h4>
                <p className="expense-meta">
                  {exp.category} • {exp.paymentMethod} • {formatDate(exp.date)}
                </p>
                {exp.notes && <p className="expense-notes">{exp.notes}</p>}
              </div>
              <div className="expense-actions">
                <span className="expense-amount">{formatCurrency(exp.amount)}</span>
                <button onClick={() => onEdit(exp)} className="btn-icon btn-edit">✏️</button>
                <button onClick={() => handleDelete(exp._id, exp.description)} className="btn-icon btn-delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
