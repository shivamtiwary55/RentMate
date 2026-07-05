const amenityIcons = { wifi: '📶', ac: '❄️', parking: '🚗', laundry: '👕', gym: '💪', water: '💧' };

const ListingCard = ({ listing }) => {
  return (
    <div style={{
      background: 'white', borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden', transition: 'all 0.3s',
      cursor: 'pointer', border: '1px solid #f0f0f0'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(108,99,255,0.15)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image */}
      <div style={{ height: '200px', overflow: 'hidden', background: '#f5f3ff', position: 'relative' }}>
        {listing.images && listing.images.length > 0 ? (
          <img src={listing.images[0]} alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
            flexDirection: 'column', gap: '8px'
          }}>
            <span style={{ fontSize: '3rem' }}>🏠</span>
            <span style={{ color: '#6C63FF', fontSize: '0.85rem' }}>No image available</span>
          </div>
        )}

        {/* Room Type Badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(108, 99, 255, 0.9)',
          color: 'white', padding: '4px 12px',
          borderRadius: '20px', fontSize: '0.78rem',
          fontWeight: '600', textTransform: 'capitalize'
        }}>
          {listing.roomType}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.2rem' }}>
        <h3 style={{ color: '#1a1a2e', fontWeight: '600', fontSize: '1rem', marginBottom: '6px' }}>
          {listing.title}
        </h3>

        <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          📍 {listing.address?.city}, {listing.address?.state}
        </p>

        {/* Rent */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#6C63FF' }}>
              ₹{listing.rent?.toLocaleString()}
            </span>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>/month</span>
          </div>
          {listing.deposit > 0 && (
            <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
              Deposit: ₹{listing.deposit?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Amenities */}
        {listing.amenities && listing.amenities.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {listing.amenities.slice(0, 4).map((a, i) => (
              <span key={i} style={{
                background: '#F5F3FF', color: '#6C63FF',
                padding: '3px 10px', borderRadius: '20px',
                fontSize: '0.78rem', fontWeight: '500'
              }}>
                {amenityIcons[a.toLowerCase()] || '✓'} {a}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', paddingTop: '10px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
            By {listing.landlord?.name}
          </span>
          <span style={{
            background: listing.isAvailable ? '#ECFDF5' : '#FEF2F2',
            color: listing.isAvailable ? '#059669' : '#DC2626',
            padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '500'
          }}>
            {listing.isAvailable ? '✓ Available' : '✗ Taken'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;