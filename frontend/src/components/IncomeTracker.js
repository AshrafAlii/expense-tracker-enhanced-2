import React, { useState } from 'react';

const IncomeTracker = ({ income, incomeStats, onAddIncome, onDeleteIncome }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Other'
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onAddIncome(formData);
    if (result.success) {
      setFormData({
        amount: '', source: '', description: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Other'
      });
      setShowForm(false);
      alert(result.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this income record?')) {
      onDeleteIncome(id);
    }
  };

  return (
    <div className="income-tracker">
      <div className="income-header">
        <div>
          <h2>Income Tracking</h2>
          <div className="income-stats">
            <span>Total: {formatCurrency(incomeStats.totalAmount)}</span>
            <span>•</span>
            <span>{incomeStats.totalCount} transaction(s)</span>
          </div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : '➕ Add Income'}
        </button>
      </div>

      {showForm && (
        <form className="income-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Amount *</label>
              <input type="number" value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required step="0.01" />
            </div>
            <div className="form-group">
              <label>Source *</label>
              <input type="text" value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value})}
                placeholder="e.g., Monthly Salary" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Business">Business</option>
                <option value="Gift">Gift</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary">Add Income</button>
        </form>
      )}

      <div className="income-list">
        {income.length === 0 ? (
          <p className="no-data">No income records yet.</p>
        ) : (
          income.map((inc) => (
            <div key={inc._id} className="income-item">
              <div className="income-details">
                <h4>{inc.source}</h4>
                <p>{inc.category} • {new Date(inc.date).toLocaleDateString()}</p>
                {inc.description && <p className="income-description">{inc.description}</p>}
              </div>
              <div className="income-actions">
                <span className="income-amount">{formatCurrency(inc.amount)}</span>
                <button onClick={() => handleDelete(inc._id)} className="btn-icon btn-delete">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncomeTracker;
