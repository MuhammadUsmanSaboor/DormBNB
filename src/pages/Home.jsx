import React, { useState } from 'react';
import HeroSearch from '../components/HeroSearch';
import FilterChips from '../components/FilterChips';
import HostelCard from '../components/HostelCard';
import InteractiveMap from '../components/InteractiveMap';
import { getHostels } from '../services/googleMapsService';
import { filterHostels } from '../utils/filterLogic';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'All',
    roomType: 'All',
    amenities: []
  });
  const [hostelsData, setHostelsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([31.5204, 74.3587]); // Default Lahore

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query) return;

    setLoading(true);
    setError(null);
    try {
      const response = await getHostels(query, filters.gender);
      const modeledData = response.hostels.map(h => ({
        ...h,
        lat: h.coordinates[0],
        lng: h.coordinates[1],
        price: 'Contact for price', // Placeholder as GMaps doesn't provide price natively
        gender: filters.gender === 'All' ? 'Unknown' : filters.gender 
      }));
      setHostelsData(modeledData);
      if (response.universityLocation) {
        setMapCenter(response.universityLocation);
      }
    } catch (err) {
      console.error(err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got position: ", position.coords.latitude, position.coords.longitude);
          // In a real app, this would filter by actual user distance using Haversine formula
          alert(`Located you at: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}. In a full app, this would sort hostels by distance from you.`);
        },
        (error) => {
          alert('Unable to retrieve your location. Check your browser permissions.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const filteredHostels = filterHostels(hostelsData, searchQuery, filters);

  return (
    <div>
      <div style={{ backgroundColor: 'var(--lahore-green)', padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--clean-white)', fontSize: '36px', marginBottom: '16px' }}>Find Your Perfect Student Home in Lahore</h1>
        <p style={{ color: 'var(--lahore-light-green)', fontSize: '18px', marginBottom: '32px' }}>Search hostels near FAST, LUMS, PU, and more.</p>
        <HeroSearch onSearch={handleSearch} onNearMe={handleNearMe} />
      </div>

      <div className="split-view">
        <div className="list-section">
          <FilterChips activeFilters={filters} onFilterChange={handleFilterChange} />
          
          <div style={{ marginBottom: '16px', fontWeight: '500', color: 'var(--text-muted)' }}>
            {loading && <span>Fetching realtime results from Google Maps...</span>}
            {error && <span style={{color: 'red'}}>Error: {error}</span>}
            {!loading && !error && <span>{filteredHostels.length} {filteredHostels.length === 1 ? 'hostel' : 'hostels'} found</span>}
          </div>

          <div className="hostels-list">
            {filteredHostels.map(hostel => (
              <HostelCard key={hostel.id} hostel={hostel} searchQuery={searchQuery} />
            ))}
            {filteredHostels.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                No hostels found matching your criteria. Try adjusting your filters or search query.
              </div>
            )}
          </div>
        </div>
        
        <div className="map-section">
          <InteractiveMap hostels={filteredHostels} center={mapCenter} />
        </div>
      </div>
    </div>
  );
};

export default Home;
