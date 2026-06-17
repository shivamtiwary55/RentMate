import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axios.js';
import { useAuth } from '../../context/AuthContext.jsx';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    role: 'student', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
    <div style={{ maxWidth: '420px', margin: '3rem auto', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', color: '#6C63FF' }}>Join RentMate 🏠</h2>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={handleChange} required style={inputStyle} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={inputStyle} />

        {/* Role Selection */}
        <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
          <option value="student">Student / Tenant</option>
          <option value="landlord">Landlord / Owner</option>
        </select>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#6C63FF' }}>Login</Link>
      </p>
    </div>
  );
};

const inputStyle = {
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '1rem',
  outline: 'none'
};

const btnStyle = {
  padding: '0.75rem',
  background: '#6C63FF',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  cursor: 'pointer',
  fontWeight: '500'
};

export default Register;