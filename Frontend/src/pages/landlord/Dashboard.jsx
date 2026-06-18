import { useState, useEffect } from 'react';
import axios from '../../api/axios.js';

const Dashboard = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', rent: '', deposit: '',
    roomType: 'single', amenities: '', longitude: '',
    latitude: '', availableFrom: '', preferredTenants: 'any',
    street: '', city: '', state: '', pincode: ''
  });
  const [images, setImages] = useState([]);

  const fetchMyListings = async () => {
    try {
      const res = await axios.get('/listings');
      setListings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));

      // Address as JSON string
      formData.set('address', JSON.stringify({
        street: form.street, city: form.city,
        state: form.state, pincode: form.pincode
      }));

      images.forEach(img => formData.append('images', img));

      await axios.post('/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowForm(false);
      fetchMyListings();
      alert('Listing created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating listing');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/listings/${id}`);
      fetchMyListings();
    } catch (err) {
      alert('Error deleting listing');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#333', margin: 0 }}>My Listings 📋</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? 'Cancel' : '+ Add Listing'}
        </button>
      </div>

      {/* Add Listing Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          background: 'white', borderRadius: '12px',
          padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem'
        }}>
          <h3 style={{ margin: 0, color: '#6C63FF' }}>New Listing</h3>

          <input name="title" placeholder="Title e.g. Cozy PG near Campus" value={form.title} onChange={handleChange} required style={inputStyle} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="rent" type="number" placeholder="Monthly Rent ₹" value={form.rent} onChange={handleChange} required style={inputStyle} />
            <input name="deposit" type="number" placeholder="Deposit ₹" value={form.deposit} onChange={handleChange} style={inputStyle} />
          </div>

          <select name="roomType" value={form.roomType} onChange={handleChange} style={inputStyle}>
            <option value="single">Single Room</option>
            <option value="shared">Shared Room</option>
            <option value="flat">Full Flat</option>
            <option value="pg">PG</option>
          </select>

          <input name="amenities" placeholder="Amenities (comma separated: wifi, ac, parking)" value={form.amenities} onChange={handleChange} style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="street" placeholder="Street" value={form.street} onChange={handleChange} style={inputStyle} />
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} required style={inputStyle} />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} style={inputStyle} />
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input name="longitude" type="number" step="any" placeholder="Longitude (e.g. 88.3639)" value={form.longitude} onChange={handleChange} required style={inputStyle} />
            <input name="latitude" type="number" step="any" placeholder="Latitude (e.g. 22.5726)" value={form.latitude} onChange={handleChange} required style={inputStyle} />
          </div>

          <p style={{ fontSize: '0.8rem', color: '#888', margin: '-0.5rem 0' }}>
            💡 Get coordinates from <a href="https://www.latlong.net" target="_blank" rel="noreferrer">latlong.net</a>
          </p>

          <select name="preferredTenants" value={form.preferredTenants} onChange={handleChange} style={inputStyle}>
            <option value="any">Any</option>
            <option value="students">Students Only</option>
            <option value="working professionals">Working Professionals</option>
          </select>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#444' }}>Property Images (max 5)</label>
            <input type="file" multiple accept="image/*" onChange={e => setImages([...e.target.files])} />
          </div>

          <button type="submit" style={btnStyle}>Create Listing</button>
        </form>
      )}

      {/* Listings List */}
      {loading ? (
        <p>Loading...</p>
      ) : listings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
          <p style={{ fontSize: '3rem' }}>🏚️</p>
          <p>No listings yet. Add your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {listings.map(listing => (
            <div key={listing._id} style={{
              background: 'white', borderRadius: '12px',
              padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0 }}>{listing.title}</h3>
                <p style={{ color: '#6C63FF', margin: '4px 0' }}>₹{listing.rent}/month</p>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>
                  📍 {listing.address?.city} • {listing.roomType}
                </p>
              </div>
              <button
                onClick={() => handleDelete(listing._id)}
                style={{
                  background: '#FFE5E5', color: '#D32F2F',
                  border: 'none', padding: '0.5rem 1rem',
                  borderRadius: '8px', cursor: 'pointer'
                }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  padding: '0.65rem', borderRadius: '8px',
  border: '1px solid #ddd', fontSize: '0.9rem',
  outline: 'none', width: '100%'
};

const btnStyle = {
  padding: '0.65rem 1.5rem', background: '#6C63FF',
  color: 'white', border: 'none', borderRadius: '8px',
  cursor: 'pointer', fontWeight: '500'
};

export default Dashboard;