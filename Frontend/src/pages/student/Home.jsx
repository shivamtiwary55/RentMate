import { useState, useEffect } from 'react';
import axios from '../../api/axios.js';
import ListingCard from '../../components/listings/ListingCard.jsx';
import ListingMap from '../../components/listings/ListingMap.jsx';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({ city: '', minRent: '', maxRent: '', roomType: '' });

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

  useEffect(() => { fetchListings(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #6C63FF 0%, #4F46E5 100%)',
        padding: '3rem 2rem', textAlign: 'center', color: 'white'
      }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', marginBottom: '10px', color: 'white' }}>
          Find Your Perfect Room 🏠
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, color: 'white', marginBottom: '2rem' }}>
          Browse verified listings near your college
        </p>

        {/* Search Bar */}
        <div style={{
          background: 'white', borderRadius: '16px',
          padding: '1.2rem', maxWidth: '800px',
          margin: '0 auto', display: 'flex',
          gap: '10px', flexWrap: 'wrap',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }}>
          <input
            placeholder="🔍 Search city..."
            value={filters.city}
            onChange={e => setFilters({ ...filters, city: e.target.value })}
            style={searchInput}
          />
          <input
            type="number" placeholder="Min ₹"
            value={filters.minRent}
            onChange={e => setFilters({ ...filters, minRent: e.target.value })}
            style={{ ...searchInput, maxWidth: '100px' }}
          />
          <input
            type="number" placeholder="Max ₹"
            value={filters.maxRent}
            onChange={e => setFilters({ ...filters, maxRent: e.target.value })}
            style={{ ...searchInput, maxWidth: '100px' }}
          />
          <select
            value={filters.roomType}
            onChange={e => setFilters({ ...filters, roomType: e.target.value })}
            style={{ ...searchInput, maxWidth: '130px' }}
          >
            <option value="">All Types</option>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
            <option value="flat">Flat</option>
            <option value="pg">PG</option>
          </select>
          <button onClick={fetchListings} style={{
            background: 'linear-gradient(135deg, #6C63FF, #4F46E5)',
            color: 'white', border: 'none',
            borderRadius: '10px', padding: '10px 24px',
            fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem'
          }}>
            Search
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{
        background: 'white', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'center', gap: '3rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        {[
          { label: 'Active Listings', value: listings.length },
          { label: 'Cities', value: '10+' },
          { label: 'Happy Tenants', value: '500+' }
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#6C63FF' }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* View Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#1a1a2e', fontWeight: '600', fontSize: '1.2rem' }}>
            {loading ? 'Loading...' : `${listings.length} listings found`}
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { key: 'grid', label: '⊞ Grid' },
              { key: 'map', label: '🗺️ Map' }
            ].map(v => (
              <button key={v.key} onClick={() => setView(v.key)} style={{
                padding: '8px 18px', borderRadius: '20px',
                border: '1.5px solid #6C63FF', cursor: 'pointer',
                fontWeight: '500', fontSize: '0.9rem',
                background: view === v.key ? '#6C63FF' : 'white',
                color: view === v.key ? 'white' : '#6C63FF',
              }}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ color: '#6b7280' }}>Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏚️</div>
            <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>No listings found</h3>
            <p style={{ color: '#6b7280' }}>Try different filters or check back later</p>
          </div>
        ) : view === 'map' ? (
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <ListingMap listings={listings} />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {listings.map(listing => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const searchInput = {
  flex: 1, padding: '10px 14px',
  borderRadius: '10px', border: '1.5px solid #E5E7EB',
  fontSize: '0.9rem', outline: 'none',
  color: '#1a1a2e', background: 'white',
  minWidth: '120px', boxSizing: 'border-box'
};

export default Home;