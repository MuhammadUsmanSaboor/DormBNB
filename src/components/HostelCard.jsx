import React, { useState } from 'react';
import { Star, MapPin, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HostelCard = ({ hostel, searchQuery }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Determine which university to show distance for
  let universityToShow = hostel.nearestUniversities[0];
  if (searchQuery) {
    const matchedUni = hostel.nearestUniversities.find(uni => 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedUni) {
      universityToShow = matchedUni;
    }
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? hostel.images.length - 1 : prev - 1));
  };

  const handleCardClick = () => {
    navigate(`/hostel/${hostel.id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', { maximumSignificantDigits: 3 }).format(price);
  };

  return (
    <div className="hostel-card" onClick={handleCardClick}>
      <div className="card-image-wrapper">
        <img 
          src={hostel.images[currentImageIndex]} 
          alt={hostel.name} 
          className="card-image"
        />
        <div className="card-badge">{hostel.gender} • {hostel.roomType}</div>
        
        {hostel.images.length > 1 && (
          <>
            <button 
              className="carousel-btn left" 
              onClick={prevImage}
              style={{position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', background: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)'}}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="carousel-btn right" 
              onClick={nextImage}
              style={{position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', background: 'white', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-soft)'}}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{hostel.name}</h3>
          <div className="card-rating">
            <Star size={16} fill="#FCD34D" color="#FCD34D" />
            {hostel.rating}
          </div>
        </div>

        <div className="card-info" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <MapPin size={14} />
          {universityToShow.distance} km from {universityToShow.name}
        </div>
        <div className="card-info" style={{ marginLeft: 18 }}>
          {hostel.location}
        </div>

        <div className="card-amenities">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} style={{ fontSize: 12, background: 'var(--background-light)', padding: '4px 8px', borderRadius: 4 }}>
              {amenity}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span style={{ fontSize: 12, background: 'var(--background-light)', padding: '4px 8px', borderRadius: 4 }}>
              +{hostel.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="card-footer">
          <div className="card-price">
            Rs {formatPrice(hostel.price)} <span>/ month</span>
          </div>
          <div className="card-actions">
            <a 
              href={`https://wa.me/${hostel.contact.replace('+', '')}`} 
              className="btn-icon btn-whatsapp" 
              onClick={(e) => e.stopPropagation()}
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
            <a 
              href={`tel:${hostel.contact}`} 
              className="btn-icon btn-call" 
              onClick={(e) => e.stopPropagation()}
              title="Quick Call"
            >
              <Phone size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
