import React, { useState } from 'react';
import { Search, Navigation } from 'lucide-react';

const HeroSearch = ({ onSearch, onNearMe }) => {
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  return (
    <div className="hero-search">
      <Search className="search-icon" size={20} color="var(--text-muted)" />
      <input 
        type="text" 
        className="search-input" 
        placeholder="Search by University Name (e.g. LUMS, FAST)..." 
        value={query}
        onChange={handleSearchChange}
      />
      <button className="near-me-btn" onClick={onNearMe}>
        <Navigation size={16} />
        Near Me
      </button>
    </div>
  );
};

export default HeroSearch;
