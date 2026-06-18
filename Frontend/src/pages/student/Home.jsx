import { useState, useEffect } from 'react';
import axios from '../../api/axios.js';
import ListingCard from '../../components/listings/ListingCard.jsx';
import ListingMap from '../../components/listings/ListingMap.jsx';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid'); // 'grid' or 'map'
  const [filters, setFilters] = useState({
    city: '', minRent: '', maxRent: '', roomType: ''
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.minRent) params.minRent = filters.minRent;
      if (filters.maxRent) params.maxRent = filters.maxRent;
      if (filters.roomType) params.roomType = filters.roomType;

      const res = await axios.get('/listings', { params });
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#333', marginBottom: '0.5rem' }}>
        Find Your Perfect Room 🏠
      </h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Browse listings near your college
      </p>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap',
        background: 'white', padding: '1rem',
        borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        marginBottom: '1.5rem'
      }}>
        <input
          name="city"
          placeholder="🔍 Search city..."
          value={filters.city}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          name="minRent"
          type="number"
          placeholder="Min Rent ₹"
          value={filters.minRent}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <input
          name="maxRent"
          type="number"
          placeholder="Max Rent ₹"
          value={filters.maxRent}
          onChange={handleFilterChange}
          style={inputStyle}
        />
        <select
          name="roomType"
          value={filters.roomType}
          onChange={handleFilterChange}
          style={inputStyle}
        >
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="shared">Shared</option>
          <option value="flat">Flat</option>
          <option value="pg">PG</option>
        </select>
        <button onClick={fetchListings} style={btnStyle}>
          Search
        </button>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setView('grid')}
          style={{
            ...toggleBtn,
            background: view === 'grid' ? '#6C63FF' : 'white',
            color: view === 'grid' ? 'white' : '#6C63FF'
          }}>
          Grid View
        </button>
        <button
          onClick={() => setView('map')}
          style={{
            ...toggleBtn,
            background: view === 'map' ? '#6C63FF' : 'white',
            color: view === 'map' ? 'white' : '#6C63FF'
          }}>
          Map View 🗺️
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Loading listings...</p>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ fontSize: '3rem' }}>🏚️</p>
          <p>No listings found. Try different filters!</p>
        </div>
      ) : view === 'map' ? (
        <ListingMap listings={listings} />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  padding: '0.6rem 1rem',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '0.9rem',
  outline: 'none',
  flex: 1,
  minWidth: '140px'
};

const btnStyle = {
  padding: '0.6rem 1.5rem',
  background: '#6C63FF',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '500'
};

const toggleBtn = {
  padding: '0.5rem 1.2rem',
  border: '1px solid #6C63FF',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '500',
  fontSize: '0.9rem'
};

export default Home;