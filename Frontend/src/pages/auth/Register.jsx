import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/auth/register', form);
      login(res.data);
      if (res.data.role === 'landlord') navigate('/landlord/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%)',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px',
        padding: '2.5rem', width: '100%', maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(108,99,255,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem' }}>🏠</div>
          <h2 style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '1.8rem', marginBottom: '6px' }}>
            Join RentMate
          </h2>
          <p style={{ color: '#6b7280' }}>Create your account to get started</p>
        </div>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: '10px', padding: '12px 16px',
            color: '#DC2626', marginBottom: '1rem', fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.5rem' }}>
          {[
            { value: 'student', label: '🎓 Student', desc: 'Find rooms & roommates' },
            { value: 'landlord', label: '🏠 Landlord', desc: 'List your property' }
          ].map(r => (
            <div key={r.value} onClick={() => setForm({ ...form, role: r.value })}
              style={{
                border: `2px solid ${form.role === r.value ? '#6C63FF' : '#E5E7EB'}`,
                borderRadius: '12px', padding: '12px',
                cursor: 'pointer', textAlign: 'center',
                background: form.role === r.value ? '#F5F3FF' : 'white',
                transition: 'all 0.2s'
              }}>
              <div style={{ fontSize: '1.2rem' }}>{r.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>{r.desc}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Full Name</label>
            <input placeholder="Rahul Das" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" placeholder="rahul@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone Number</label>
            <input placeholder="9876543210" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={inputStyle} />
          </div>

          <button type="submit" disabled={loading} style={btnStyle}>
            {loading ? '⏳ Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C63FF', fontWeight: '600' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const labelStyle = { display: 'block', color: '#374151', fontWeight: '500', marginBottom: '6px', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E5E7EB', fontSize: '0.95rem', outline: 'none', color: '#1a1a2e', background: 'white', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '13px', background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '8px' };

export default Register;