const ListingCard = ({ listing }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {/* Image */}
      <div style={{ height: '180px', overflow: 'hidden', background: '#f0f0f0' }}>
        {listing.images && listing.images.length > 0 ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '3rem'
          }}>🏠</div>
        )}
      </div>

      {/* Details */}
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#333' }}>{listing.title}</h3>
          <span style={{
            background: '#EEF0FF', color: '#6C63FF',
            padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem'
          }}>
            {listing.roomType}
          </span>
        </div>

        <p style={{ color: '#6C63FF', fontWeight: 'bold', fontSize: '1.1rem', margin: '0.5rem 0' }}>
          ₹{listing.rent.toLocaleString()}/month
        </p>

        <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>
          📍 {listing.address?.city}, {listing.address?.state}
        </p>

        {/* Amenities */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {listing.amenities?.slice(0, 3).map((a, i) => (
            <span key={i} style={{
              background: '#f5f5f5', padding: '2px 8px',
              borderRadius: '20px', fontSize: '0.75rem', color: '#555'
            }}>
              {a}
            </span>
          ))}
        </div>

        <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '0.75rem' }}>
          Posted by: {listing.landlord?.name}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;