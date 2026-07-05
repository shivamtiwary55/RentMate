import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/auth/login', form);
      login(res.data);
      if (res.data.role === 'landlord') navigate('/landlord/dashboard');
      else if (res.data.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #f5f7ff 0%, #ede9fe 100%)'
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem', color: 'white'
      }} className="hidden md:flex">
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏠</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', color: 'white' }}>
          RentMate
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, textAlign: 'center', maxWidth: '300px', color: 'white' }}>
          Find your perfect room and compatible roommates in one place
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
          {['🗺️ Browse rooms on live map', '🧩 Roommate compatibility quiz', '💰 Split expenses easily', '🔧 Track complaints'].map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '10px', padding: '10px 16px',
              color: 'white', fontSize: '0.9rem'
            }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right Panel — Form */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white', borderRadius: '20px',
          padding: '2.5rem', width: '100%', maxWidth: '420px',
          boxShadow: '0 20px 60px rgba(108,99,255,0.1)'
        }}>
          <h2 style={{ color: '#1a1a2e', fontWeight: '700', fontSize: '1.8rem', marginBottom: '8px' }}>
            Welcome back 👋
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Login to your RentMate account
          </p>

          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: '10px', padding: '12px 16px',
              color: '#DC2626', marginBottom: '1rem', fontSize: '0.9rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '6px', fontSize: '0.9rem' }}>
                Email Address
              </label>
              <input
                type="email" placeholder="rahul@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '500', marginBottom: '6px', fontSize: '0.9rem' }}>
                Password
              </label>
              <input
                type="password" placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? '⏳ Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6C63FF', fontWeight: '600' }}>
              Register here
            </Link>
          </p>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1.5rem', background: '#F5F3FF',
            borderRadius: '12px', padding: '1rem',
            border: '1px solid #DDD6FE'
          }}>
            <p style={{ color: '#6C63FF', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px' }}>
              🎯 Demo Credentials
            </p>
            {[
              { role: 'Student', email: 'rahul@test.com', pass: '123456' },
              { role: 'Landlord', email: 'suresh@test.com', pass: '123456' },
              { role: 'Admin', email: 'admin@rentmate.com', pass: 'admin123' },
            ].map((d, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#4B5563', marginBottom: '4px' }}>
                <strong style={{ color: '#6C63FF' }}>{d.role}:</strong> {d.email} / {d.pass}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '12px 16px',
  borderRadius: '10px', border: '1.5px solid #E5E7EB',
  fontSize: '0.95rem', outline: 'none',
  color: '#1a1a2e', background: 'white',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};

const btnStyle = {
  width: '100%', padding: '13px',
  background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
  color: 'white', border: 'none',
  borderRadius: '10px', fontSize: '1rem',
  fontWeight: '600', cursor: 'pointer',
  marginTop: '8px'
};

export default Login;