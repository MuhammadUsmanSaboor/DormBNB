import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom icons based on gender
const boysIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const girlsIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically adjust map bounds based on markers
const MapBounds = ({ hostels }) => {
  const map = useMap();
  useEffect(() => {
    if (hostels.length > 0) {
      const bounds = L.latLngBounds(hostels.map(h => [h.lat, h.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [hostels, map]);
  return null;
};

const InteractiveMap = ({ hostels }) => {
  const navigate = useNavigate();
  // Default to Lahore center
  const position = [31.5204, 74.3587];

  return (
    <div className="map-container">
      <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBounds hostels={hostels} />
        {hostels.map((hostel) => (
          <Marker 
            key={hostel.id} 
            position={[hostel.lat, hostel.lng]}
            icon={hostel.gender === 'Girls' ? girlsIcon : boysIcon}
          >
            <Popup>
              <div 
                style={{ cursor: 'pointer', minWidth: '150px' }}
                onClick={() => navigate(`/hostel/${hostel.id}`)}
              >
                <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>
                  {hostel.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' }}>
                  <Star size={12} fill="#FCD34D" color="#FCD34D" /> {hostel.rating}
                </div>
                <div style={{ marginTop: '8px', fontWeight: 'bold', color: 'var(--lahore-green)' }}>
                  Rs {hostel.price.toLocaleString()} / month
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
