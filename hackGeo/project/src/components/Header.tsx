import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LandmarkIcon, Map } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();
  
  return (
    <header className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <LandmarkIcon size={24} className="text-accent-500" />
            <div>
              <h1 className="text-xl font-bold">NepaliHeritage</h1>
              <p className="text-xs opacity-80">Voice Map</p>
            </div>
          </Link>
          
          <nav>
            <ul className="flex space-x-1">
              <li>
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-primary-800 text-white' 
                      : 'text-white/80 hover:bg-primary-600'
                  }`}
                >
                  <LandmarkIcon size={16} />
                  <span>Identify</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/map"
                  className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors ${
                    location.pathname === '/map' 
                      ? 'bg-primary-800 text-white' 
                      : 'text-white/80 hover:bg-primary-600'
                  }`}
                >
                  <Map size={16} />
                  <span>Map</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;