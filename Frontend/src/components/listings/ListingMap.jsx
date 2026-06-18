import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const ListingMap = ({ listings }) => {
  // Default center — Kolkata
  const defaultCenter = [22.5726, 88.3639];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      style={{ height: '450px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {listings.map(listing => (
        listing.location?.coordinates && (
          <Marker
            key={listing._id}
            position={[
              listing.location.coordinates[1], // latitude
              listing.location.coordinates[0]  // longitude
            ]}
          >
            <Popup>
              <div style={{ minWidth: '150px' }}>
                <strong>{listing.title}</strong>
                <p style={{ margin: '4px 0', color: '#6C63FF' }}>
                  ₹{listing.rent}/month
                </p>
                <p style={{ margin: '4px 0', fontSize: '0.8rem' }}>
                  {listing.roomType} • {listing.address?.city}
                </p>
              </div>
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default ListingMap;