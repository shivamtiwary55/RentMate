import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const socket = io('http://localhost:5000');

const statusColor = {
  pending: { bg: '#FFF3F0', color: '#D32F2F' },
  under_review: { bg: '#FFF8E7', color: '#F57F17' },
  in_progress: { bg: '#E3F2FD', color: '#1565C0' },
  resolved: { bg: '#E8F5E9', color: '#2E7D32' }
};

const Complaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: 'other',
    landlordId: '', listingId: ''
  });

  useEffect(() => {
    fetchComplaints();

    // Join personal Socket.IO room
    socket.emit('join', user._id);

    // Listen for real-time updates
    socket.on('complaint_updated', (data) => {
      setNotification(data.message);
      fetchComplaints();
      setTimeout(() => setNotification(''), 5000);
    });

    socket.on('new_complaint', (data) => {
      setNotification(data.message);
      fetchComplaints();
      setTimeout(() => setNotification(''), 5000);
    });

    return () => {
      socket.off('complaint_updated');
      socket.off('new_complaint');
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/complaints', form);
      setShowForm(false);
      setForm({ title: '', description: '', category: 'other', landlordId: '', listingId: '' });
      fetchComplaints();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleStatusUpdate = async (id, status, response) => {
    try {
      await axios.patch(`/complaints/${id}/status`, {
        status, landlordResponse: response
      });
      fetchComplaints();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Real-time notification */}
      {notification && (
        <div style={{
          background: '#E8F5E9', border: '1px solid #A5D6A7',
          borderRadius: '8px', padding: '0.8rem 1rem',
          marginBottom: '1rem', color: '#2E7D32', fontWeight: '500'
        }}>
          🔔 {notification}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>🔧 Complaints</h3>
        {user.role === 'student' && (
          <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
            {showForm ? 'Cancel' : '+ Raise Complaint'}
          </button>
        )}
      </div>

      {/* Add Complaint Form */}
      {showForm && user.role === 'student' && (
        <form onSubmit={handleSubmit} style={{
          background: 'white', borderRadius: '10px', padding: '1.2rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '1rem',
          display: 'flex', flexDirection: 'column', gap: '0.8rem'
        }}>
          <input placeholder="Complaint Title e.g. Leaking pipe in bathroom"
            value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            required style={inputStyle} />
          <textarea placeholder="Describe the issue in detail..."
            value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            required style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle}>
            <option value="plumbing">🚿 Plumbing</option>
            <option value="electricity">⚡ Electricity</option>
            <option value="furniture">🛋️ Furniture</option>
            <option value="security">🔒 Security</option>
            <option value="cleanliness">🧹 Cleanliness</option>
            <option value="other">📦 Other</option>
          </select>
          <input placeholder="Landlord User ID"
            value={form.landlordId} onChange={e => setForm({...form, landlordId: e.target.value})}
            required style={inputStyle} />
          <input placeholder="Listing ID"
            value={form.listingId} onChange={e => setForm({...form, listingId: e.target.value})}
            required style={inputStyle} />
          <button type="submit" style={btnStyle}>Submit Complaint</button>
        </form>
      )}

      {/* Complaints List */}
      {complaints.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>No complaints yet.</p>
      ) : (
        complaints.map(c => (
          <div key={c._id} style={{
            background: 'white', borderRadius: '10px', padding: '1.2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '0.8rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{c.title}</p>
                <p style={{ margin: '4px 0', color: '#888', fontSize: '0.85rem' }}>{c.description}</p>
                {c.landlordResponse && (
                  <p style={{ margin: '6px 0 0', color: '#6C63FF', fontSize: '0.85rem' }}>
                    💬 Landlord: {c.landlordResponse}
                  </p>
                )}
              </div>
              <span style={{
                ...statusColor[c.status],
                padding: '4px 10px', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: '500', whiteSpace: 'nowrap'
              }}>
                {c.status.replace('_', ' ')}
              </span>
            </div>

            {/* Landlord controls */}
            {user.role === 'landlord' && c.status !== 'resolved' && (
              <div style={{ marginTop: '0.8rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['under_review', 'in_progress', 'resolved'].map(s => (
                  <button key={s} onClick={() => handleStatusUpdate(c._id, s, `Status updated to ${s}`)}
                    style={{
                      padding: '4px 12px', borderRadius: '6px', border: '1px solid #ddd',
                      cursor: 'pointer', fontSize: '0.8rem', background: 'white'
                    }}>
                    Mark {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

const inputStyle = { padding: '0.65rem', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' };
const btnStyle = { padding: '0.6rem 1.2rem', background: '#6C63FF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' };

export default Complaints;