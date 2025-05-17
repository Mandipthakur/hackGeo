import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Monument } from '../types';
import { Map as MapIcon } from 'lucide-react';

interface MapViewProps {
  monuments: Monument[];
  currentLocation?: [number, number];
  height?: string;
  onMonumentClick?: (monument: Monument) => void;
}

const MapView: React.FC<MapViewProps> = ({ 
  monuments, 
  currentLocation = [27.7172, 85.3240], // Default to Kathmandu
  height = '400px',
  onMonumentClick
}) => {
  // Custom marker icon
  const customIcon = new Icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  return (
    <div className="relative">
      <div className="absolute top-2 left-2 z-10 bg-white bg-opacity-80 px-3 py-2 rounded-lg flex items-center shadow-sm">
        <MapIcon size={16} className="text-primary-700 mr-2" />
        <span className="text-sm font-medium text-primary-700">Heritage Map</span>
      </div>
      
      <MapContainer 
        center={currentLocation} 
        zoom={13} 
        style={{ height, width: '100%', borderRadius: '0.5rem' }}
        className="z-0 shadow-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {monuments.map((monument, index) => (
          <Marker 
            key={monument.id || index}
            position={[monument.latitude, monument.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                if (onMonumentClick) {
                  onMonumentClick(monument);
                }
              }
            }}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-semibold text-primary-700">{monument.name}</h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">{monument.description}</p>
                <div className="mt-2">
                  <img 
                    src={monument.imageUrl} 
                    alt={monument.name} 
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;