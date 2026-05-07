import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="navbar">
          <Link to="/" className="brand">
            <Building2 size={28} />
            DormBnB
          </Link>
          <div className="user-menu">
            {/* Future user menu */}
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hostel/:id" element={<HostelDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
