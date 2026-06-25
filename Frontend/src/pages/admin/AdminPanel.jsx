import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts';
import axios from '../../api/axios.js';

const COLORS = ['#6C63FF', '#1D9E75', '#D85A30', '#BA7517'];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [aRes, uRes, lRes, cRes] = await Promise.all([
        axios.get('/admin/analytics'),
        axios.get('/admin/users'),
        axios.get('/admin/listings'),
        axios.get('/admin/complaints')
      ]);
      setAnalytics(aRes.data);
      setUsers(uRes.data);
      setListings(lRes.data);
      setComplaints(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (userId) => {
    try {
      const res = await axios.patch(`/admin/users/${userId}/ban`);
      alert(res.data.message);
      fetchAll();
    } catch (err) {
      alert('Error');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/admin/listings/${id}`);
      fetchAll();
    } catch (err) {
      alert('Error deleting listing');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <p style={{ color: '#888' }}>Loading admin panel...</p>
    </div>
  );

  // Prepare chart data
  const signupChartData = analytics?.monthlySignups?.map(m => ({
    name: `${m._id.month}/${m._id.year}`,
    users: m.count
  })) || [];

  const complaintPieData = analytics?.complaintStats?.map(c => ({
    name: c._id.replace('_', ' '),
    value: c.count
  })) || [];

  const statsCards = [
    { label: 'Total Users', value: analytics?.totalUsers, color: '#6C63FF', icon: '👥' },
    { label: 'Students', value: analytics?.totalStudents, color: '#1D9E75', icon: '🎓' },
    { label: 'Landlords', value: analytics?.totalLandlords, color: '#BA7517', icon: '🏠' },
    { label: 'Total Listings', value: analytics?.totalListings, color: '#D85A30', icon: '📋' },
    { label: 'Available Listings', value: analytics?.availableListings, color: '#1D9E75', icon: '✅' },
    { label: 'Total Complaints', value: analytics?.totalComplaints, color: '#D85A30', icon: '🔧' },
    { label: 'Resolved Complaints', value: analytics?.resolvedComplaints, color: '#1D9E75', icon: '✔️' },
    { label: 'Total Reviews', value: analytics?.totalReviews, color: '#6C63FF', icon: '⭐' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>⚙️ Admin Dashboard</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Platform overview and management</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['analytics', 'users', 'listings', 'complaints'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 20px',
            borderRadius: '8px',
            border: '1px solid #6C63FF',
            background: activeTab === tab ? '#6C63FF' : 'white',
            color: activeTab === tab ? 'white' : '#6C63FF',
            cursor: 'pointer',
            fontWeight: '500',
            textTransform: 'capitalize'
          }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            {statsCards.map((card, i) => (
              <div key={i} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.2rem',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${card.color}`
              }}>
                <p style={{ margin: 0, fontSize: '1.8rem' }}>{card.icon}</p>
                <p style={{ margin: '8px 0 4px', fontSize: '1.8rem', fontWeight: 'bold', color: card.color }}>
                  {card.value}
                </p>
                <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>{card.label}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Bar Chart — Monthly Signups */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 1rem', color: '#333', fontSize: '1rem' }}>📈 Monthly User Signups</h3>
              {signupChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={signupChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Not enough data yet</p>
              )}
            </div>

            {/* Pie Chart — Complaint Status */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 1rem', color: '#333', fontSize: '1rem' }}>🔧 Complaint Status Breakdown</h3>
              {complaintPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={complaintPieData}
                      cx="50%" cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {complaintPieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No complaints yet</p>
              )}
            </div>

          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div>
          <p style={{ color: '#888', marginBottom: '1rem' }}>{users.length} total users</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {users.map(user => (
              <div key={user._id} style={{
                background: 'white', borderRadius: '10px',
                padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '500' }}>{user.name}</p>
                  <p style={{ margin: '2px 0', color: '#888', fontSize: '0.85rem' }}>{user.email}</p>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span style={{
                      background: '#EEEDFE', color: '#3C3489',
                      padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem'
                    }}>
                      {user.role}
                    </span>
                    <span style={{
                      background: user.isVerified ? '#E8F5E9' : '#FFEBEE',
                      color: user.isVerified ? '#2E7D32' : '#C62828',
                      padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem'
                    }}>
                      {user.isVerified ? 'Active' : 'Banned'}
                    </span>
                  </div>
                </div>
                {user.role !== 'admin' && (
                  <button onClick={() => handleBan(user._id)} style={{
                    padding: '6px 14px', borderRadius: '8px', border: 'none',
                    background: user.isVerified ? '#FFEBEE' : '#E8F5E9',
                    color: user.isVerified ? '#C62828' : '#2E7D32',
                    cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem'
                  }}>
                    {user.isVerified ? 'Ban' : 'Unban'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LISTINGS TAB */}
      {activeTab === 'listings' && (
        <div>
          <p style={{ color: '#888', marginBottom: '1rem' }}>{listings.length} total listings</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {listings.map(listing => (
              <div key={listing._id} style={{
                background: 'white', borderRadius: '10px',
                padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: '500' }}>{listing.title}</p>
                  <p style={{ margin: '2px 0', color: '#6C63FF', fontSize: '0.9rem' }}>
                    ₹{listing.rent}/month · {listing.roomType}
                  </p>
                  <p style={{ margin: '2px 0', color: '#888', fontSize: '0.82rem' }}>
                    📍 {listing.address?.city} · By {listing.landlord?.name}
                  </p>
                </div>
                <button onClick={() => handleDeleteListing(listing._id)} style={{
                  padding: '6px 14px', borderRadius: '8px', border: 'none',
                  background: '#FFEBEE', color: '#C62828',
                  cursor: 'pointer', fontWeight: '500', fontSize: '0.85rem'
                }}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPLAINTS TAB */}
      {activeTab === 'complaints' && (
        <div>
          <p style={{ color: '#888', marginBottom: '1rem' }}>{complaints.length} total complaints</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {complaints.map(c => (
              <div key={c._id} style={{
                background: 'white', borderRadius: '10px',
                padding: '1rem 1.2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500' }}>{c.title}</p>
                    <p style={{ margin: '2px 0', color: '#888', fontSize: '0.85rem' }}>{c.description}</p>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#aaa' }}>
                      By {c.student?.name} → {c.landlord?.name} · {c.listing?.title}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem',
                    fontWeight: '500', whiteSpace: 'nowrap',
                    background: c.status === 'resolved' ? '#E8F5E9' : '#FFF3F0',
                    color: c.status === 'resolved' ? '#2E7D32' : '#D32F2F'
                  }}>
                    {c.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;