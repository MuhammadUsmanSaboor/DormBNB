import React from 'react';

const FILTER_CATEGORIES = {
  gender: ['All', 'Boys', 'Girls'],
  roomType: ['All', 'Single', 'Bi-seater', 'Dorm'],
  amenities: ['AC', 'Wi-Fi', 'Mess', 'UPS/Generator']
};

const FilterChips = ({ activeFilters, onFilterChange }) => {
  const toggleAmenity = (amenity) => {
    const isSelected = activeFilters.amenities.includes(amenity);
    let newAmenities;
    if (isSelected) {
      newAmenities = activeFilters.amenities.filter(a => a !== amenity);
    } else {
      newAmenities = [...activeFilters.amenities, amenity];
    }
    onFilterChange('amenities', newAmenities);
  };

  return (
    <div className="filters-container">
      <div className="filter-chips">
        <span style={{fontWeight: 600, marginRight: 8, display: 'flex', alignItems: 'center'}}>Gender:</span>
        {FILTER_CATEGORIES.gender.map(item => (
          <button 
            key={item}
            className={`chip ${activeFilters.gender === item ? 'active' : ''}`}
            onClick={() => onFilterChange('gender', item)}
          >
            {item}
          </button>
        ))}
      </div>
      
      <div className="filter-chips">
        <span style={{fontWeight: 600, marginRight: 8, display: 'flex', alignItems: 'center'}}>Room:</span>
        {FILTER_CATEGORIES.roomType.map(item => (
          <button 
            key={item}
            className={`chip ${activeFilters.roomType === item ? 'active' : ''}`}
            onClick={() => onFilterChange('roomType', item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="filter-chips">
        <span style={{fontWeight: 600, marginRight: 8, display: 'flex', alignItems: 'center'}}>Amenities:</span>
        {FILTER_CATEGORIES.amenities.map(item => (
          <button 
            key={item}
            className={`chip ${activeFilters.amenities.includes(item) ? 'active' : ''}`}
            onClick={() => toggleAmenity(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;
