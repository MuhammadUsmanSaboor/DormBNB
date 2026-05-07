import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, MessageCircle, ArrowLeft, Star, Users, Home as HomeIcon, CheckCircle2 } from 'lucide-react';
import { hostelsData } from '../data/mockData';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const HostelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hostel = hostelsData.find(h => h.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!hostel) {
    return <div className="container" style={{ paddingTop: 40 }}>Hostel not found!</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK').format(price);
  };

  return (
    <div className="container detail-page">
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', marginBottom: 24, fontWeight: 500 }}
      >
        <ArrowLeft size={20} /> Back to Search
      </button>

      <div className="gallery">
        <img src={hostel.images[0]} alt="Primary view" className="gallery-main" />
        {hostel.images[1] ? <img src={hostel.images[1]} alt="View 2" /> : <div style={{background: '#eee'}} />}
        {hostel.images[2] ? <img src={hostel.images[2]} alt="View 3" /> : <div style={{background: '#eee'}} />}
      </div>

      <div className="detail-content">
        <div className="detail-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h1 style={{ fontSize: 32, marginBottom: 8 }}>{hostel.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={18} fill="#FCD34D" color="#FCD34D" /> {hostel.rating}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={18} /> {hostel.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Users size={18} /> {hostel.gender}
                </span>
              </div>
            </div>
          </div>

          <div style={{ padding: '24px 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', margin: '24px 0' }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {hostel.amenities.map(amenity => (
                <div key={amenity} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
                  <CheckCircle2 size={20} color="var(--lahore-green)" /> {amenity}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>University Proximity</h2>
            <ul className="proximity-list">
              {hostel.nearestUniversities.map(uni => (
                <li key={uni.name} className="proximity-item">
                  <span style={{ fontWeight: 500 }}>{uni.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{uni.distance} km away</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="detail-sidebar">
          <div style={{ background: 'var(--clean-white)', padding: 24, borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-hover)', position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--lahore-green)', marginBottom: 24 }}>
              Rs {formatPrice(hostel.price)} <span style={{ fontSize: 16, fontWeight: 400, color: 'var(--text-muted)' }}>/ month</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a 
                href={`tel:${hostel.contact}`}
                style={{ width: '100%', padding: 14, background: 'var(--lahore-green)', color: 'white', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 600, transition: 'background 0.2s' }}
              >
                <Phone size={20} /> Call Warden Now
              </a>
              <a 
                href={`https://wa.me/${hostel.contact.replace('+', '')}`}
                style={{ width: '100%', padding: 14, background: '#25D366', color: 'white', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, fontWeight: 600, transition: 'background 0.2s' }}
              >
                <MessageCircle size={20} /> Chat on WhatsApp
              </a>
            </div>

            <div style={{ marginTop: 32 }}>
              <h3 style={{ fontSize: 18, marginBottom: 16 }}>Location</h3>
              <div style={{ height: 200, borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <MapContainer center={[hostel.lat, hostel.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} dragging={false}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[hostel.lat, hostel.lng]} icon={customIcon} />
                </MapContainer>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>
                Exact location provided after booking confirmation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetail;
