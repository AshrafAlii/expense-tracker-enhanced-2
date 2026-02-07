import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ categories, onSubmit, editingExpense, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Cash',
    notes: '',
    tags: []
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        paymentMethod: editingExpense.paymentMethod,
        notes: editingExpense.notes || '',
        tags: editingExpense.tags || []
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(formData);
    if (result.success) {
      setMessage(result.message);
      if (!editingExpense) {
        setFormData({
          amount: '', category: '', description: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'Cash', notes: '', tags: []
        });
      }
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="expense-form-container">
      <form className="expense-form" onSubmit={handleSubmit}>
        <h3>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
        {message && <div className="form-message">{message}</div>}
        
        <div className="form-row">
          <div className="form-group">
            <label>Amount *</label>
            <input type="number" name="amount" value={formData.amount}
              onChange={handleChange} placeholder="0.00" step="0.01" required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <input type="text" name="description" value={formData.description}
            onChange={handleChange} placeholder="e.g., Lunch at restaurant" required />
        </div>

        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange}
            placeholder="Additional notes..." rows="3"></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
