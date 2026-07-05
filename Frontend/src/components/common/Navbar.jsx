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
      background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
      padding: '0 2rem',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 20px rgba(108, 99, 255, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        color: 'white', fontWeight: '700', fontSize: '1.3rem',
        textDecoration: 'none'
      }}>
        <span style={{ fontSize: '1.5rem' }}>🏠</span>
        <span>RentMate</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {user ? (
          <>
            {/* User Badge */}
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              padding: '4px 12px',
              color: 'white',
              fontSize: '0.85rem',
              marginRight: '8px'
            }}>
              👋 {user.name}
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '2px 8px',
                marginLeft: '6px',
                fontSize: '0.75rem',
                textTransform: 'capitalize'
              }}>
                {user.role}
              </span>
            </div>

            {/* Student Links */}
            {user.role === 'student' && (
              <>
                <NavLink to="/" label="🏠 Listings" />
                <NavLink to="/quiz" label="🧩 Quiz" />
                <NavLink to="/complaints" label="🔧 Complaints" />
              </>
            )}

            {/* Landlord Links */}
            {user.role === 'landlord' && (
              <>
                <NavLink to="/landlord/dashboard" label="📋 Dashboard" />
                <NavLink to="/complaints" label="🔧 Complaints" />
              </>
            )}

            {/* Admin Links */}
            {user.role === 'admin' && (
              <NavLink to="/admin" label="⚙️ Admin Panel" />
            )}

            {/* Logout */}
            <button onClick={handleLogout} style={{
              background: 'white',
              color: '#6C63FF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              marginLeft: '8px',
              transition: 'all 0.2s'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" label="Login" />
            <Link to="/register" style={{
              background: 'white',
              color: '#6C63FF',
              padding: '8px 18px',
              borderRadius: '20px',
              fontWeight: '600',
              fontSize: '0.85rem',
              textDecoration: 'none'
            }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, label }) => (
  <Link to={to} style={{
    color: 'white',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    background: 'rgba(255,255,255,0.1)',
    transition: 'all 0.2s'
  }}
    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.25)'}
    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
  >
    {label}
  </Link>
);

export default Navbar;