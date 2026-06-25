import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#6C63FF',
      color: 'white'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold' }}>
        🏠 RentMate
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span>Hi, {user.name} ({user.role})</span>
            {user.role === 'student' && (
              <>
                <Link to="/quiz" style={{ color: 'white' }}>Roommate Quiz</Link>
                <Link to="/complaints" style={{ color: 'white' }}>Complaints</Link>
              </>
            )}
            {user.role === 'landlord' && (
              <>
                <Link to="/landlord/dashboard" style={{ color: 'white' }}>My Listings</Link>
                <Link to="/complaints" style={{ color: 'white' }}>Complaints</Link>
              </>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={{ color: 'white' }}>Admin Panel</Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'white',
                color: '#6C63FF',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" style={{ color: 'white' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;