import React from 'react';
import { Monument } from '../types';
import { MapPin, User, Calendar } from 'lucide-react';

interface MonumentCardProps {
  monument: Monument;
  onClick?: () => void;
}

const MonumentCard: React.FC<MonumentCardProps> = ({ monument, onClick }) => {
  const formattedDate = new Date(monument.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={monument.imageUrl} 
          alt={monument.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-primary-700 mb-1">{monument.name}</h3>
        <p className="text-sm text-stone-600 line-clamp-2 mb-3">{monument.description}</p>
        
        <div className="space-y-1.5 text-xs text-stone-500">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{monument.latitude.toFixed(4)}, {monument.longitude.toFixed(4)}</span>
          </div>
          
          {monument.userName && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>Added by {monument.userName}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonumentCard;