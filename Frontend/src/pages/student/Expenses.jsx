import { useState, useEffect } from 'react';
import axios from '../../api/axios.js';

const Expenses = ({ listingId }) => {
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', totalAmount: '', category: 'other', memberIds: ''
  });

  const fetchData = async () => {
    try {
      const [expRes, balRes] = await Promise.all([
        axios.get(`/expenses/${listingId}`),
        axios.get(`/expenses/${listingId}/balances`)
      ]);
      setExpenses(expRes.data);
      setBalances(balRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { if (listingId) fetchData(); }, [listingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberIds = form.memberIds.split(',').map(id => id.trim()).filter(Boolean);
      await axios.post('/expenses', { ...form, listing: listingId, memberIds });
      setShowForm(false);
      setForm({ title: '', totalAmount: '', category: 'other', memberIds: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handlePay = async (expenseId) => {
    try {
      await axios.patch(`/expenses/${expenseId}/pay`);
      fetchData();
    } catch (err) {
      alert('Error marking as paid');
    }
  };

  const categoryEmoji = {
    rent: '🏠', electricity: '⚡', wifi: '📶',
    grocery: '🛒', water: '💧', other: '📦'
  };

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, color: '#333' }}>💰 Expense Splitter</h3>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Balance Summary */}
      {balances.length > 0 && (
        <div style={{ background: '#FFF8E7', border: '1px solid #FAC775', borderRadius: '10px', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 8px', color: '#633806' }}>⚠️ Outstanding Balances</p>
          {balances.map((b, i) => (
            <p key={i} style={{ margin: '4px 0', color: '#633806', fontSize: '0.9rem' }}>
              <strong>{b.user.name}</strong> owes ₹{b.owes.toFixed(2)} to {b.to}
            </p>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white', borderRadius: '10px', padding: '1.2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1rem',
          display: 'flex', flexDirection: 'column', gap: '0.8rem'
        }}>
          <input name="title" placeholder="What was this expense? e.g. Electricity Bill"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            required style={inputStyle} />
          <input name="totalAmount" type="number" placeholder="Total Amount ₹"
            value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})}
            required style={inputStyle} />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
            <option value="rent">🏠 Rent</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="wifi">📶 WiFi</option>
            <option value="grocery">🛒 Grocery</option>
            <option value="water">💧 Water</option>
            <option value="other">📦 Other</option>
          </select>
          <input placeholder="Flatmate User IDs (comma separated)"
            value={form.memberIds} onChange={e => setForm({...form, memberIds: e.target.value})}
            style={inputStyle} />
          <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>
            💡 Add your flatmates' user IDs to split equally
          </p>
          <button type="submit" style={btnStyle}>Split Expense</button>
        </form>
      )}

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>No expenses yet. Add one above!</p>
      ) : (
        expenses.map(exp => (
          <div key={exp._id} style={{
            background: 'white', borderRadius: '10px', padding: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>
                  {categoryEmoji[exp.category]} {exp.title}
                </p>
                <p style={{ margin: '4px 0', color: '#888', fontSize: '0.85rem' }}>
                  Paid by {exp.paidBy?.name} · Total ₹{exp.totalAmount}
                </p>
              </div>
              <p style={{ color: '#6C63FF', fontWeight: 'bold', margin: 0 }}>
                ₹{exp.splits[0]?.amount}/person
              </p>
            </div>

            {/* Splits */}
            <div style={{ marginTop: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {exp.splits.map((split, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: split.paid ? '#E8F5E9' : '#FFF3F0',
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem'
                }}>
                  <span>{split.user?.name}</span>
                  <span style={{ color: split.paid ? '#2E7D32' : '#D32F2F' }}>
                    {split.paid ? '✓ Paid' : '✗ Unpaid'}
                  </span>
                  {!split.paid && (
                    <button onClick={() => handlePay(exp._id)} style={{
                      background: 'none', border: 'none', color: '#6C63FF',
                      cursor: 'pointer', fontSize: '0.75rem', padding: 0
                    }}>
                      Mark paid
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const inputStyle = { padding: '0.65rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnStyle = { padding: '0.6rem 1.2rem', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' };

export default Expenses;