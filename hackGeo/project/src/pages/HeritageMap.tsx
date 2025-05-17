import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MapView from '../components/MapView';
import MonumentCard from '../components/MonumentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getMonuments } from '../services/supabaseService';
import { Monument } from '../types';
import { Map as MapIcon, Search } from 'lucide-react';

const HeritageMap: React.FC = () => {
  const location = useLocation();
  const [monuments, setMonuments] = useState<Monument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([27.7172, 85.3240]);
  
  const highlightId = location.state?.highlightId;

  useEffect(() => {
    const fetchMonuments = async () => {
      setIsLoading(true);
      const data = await getMonuments();
      setMonuments(data);
      setIsLoading(false);
      
      // If a highlightId is provided, find and select that monument
      if (highlightId && data.length > 0) {
        const highlighted = data.find(m => m.id === highlightId);
        if (highlighted) {
          setSelectedMonument(highlighted);
          setMapCenter([highlighted.latitude, highlighted.longitude]);
        }
      }
    };
    
    fetchMonuments();
  }, [highlightId]);
  
  const handleMonumentClick = (monument: Monument) => {
    setSelectedMonument(monument);
    setMapCenter([monument.latitude, monument.longitude]);
    
    // Scroll to the details section on mobile
    if (window.innerWidth < 768) {
      const detailsElement = document.getElementById('monument-details');
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  const filteredMonuments = monuments.filter(monument => 
    monument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    monument.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MapIcon size={24} className="text-primary-700" />
          <span>Heritage Stories Map</span>
        </h1>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monuments..."
            className="pl-9 pr-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full max-w-xs"
          />
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="md:col-span-1 lg:col-span-2 order-2 md:order-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-[400px] md:h-[600px]">
            {isLoading ? (
              <LoadingSpinner message="Loading heritage sites..." />
            ) : (
              <MapView 
                monuments={filteredMonuments}
                currentLocation={mapCenter}
                height="100%"
                onMonumentClick={handleMonumentClick}
              />
            )}
          </div>
        </div>
        
        <div className="md:col-span-1 order-1 md:order-2 space-y-6">
          <div id="monument-details" className="space-y-6">
            {selectedMonument ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={selectedMonument.imageUrl} 
                    alt={selectedMonument.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-primary-700 mb-2">{selectedMonument.name}</h2>
                  <p className="text-stone-700 mb-4">{selectedMonument.description}</p>
                  
                  <div className="text-sm text-stone-500 space-y-1">
                    {selectedMonument.userName && (
                      <p>Added by: {selectedMonument.userName}</p>
                    )}
                    <p>Date: {new Date(selectedMonument.timestamp).toLocaleDateString()}</p>
                    <p>Location: {selectedMonument.latitude.toFixed(4)}, {selectedMonument.longitude.toFixed(4)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 text-center">
                <MapIcon size={24} className="mx-auto text-stone-400 mb-2" />
                <p className="text-stone-600">Select a monument from the map or the list below to see details</p>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Heritage List</h3>
            
            {isLoading ? (
              <LoadingSpinner message="Loading monuments..." />
            ) : filteredMonuments.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {filteredMonuments.map((monument) => (
                  <MonumentCard
                    key={monument.id}
                    monument={monument}
                    onClick={() => handleMonumentClick(monument)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-stone-50 rounded-lg">
                <p className="text-stone-500">No monuments found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeritageMap;