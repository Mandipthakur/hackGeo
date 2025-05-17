import React, { useState } from 'react';
import { GeminiResponse, Monument } from '../types';
import { saveMonument } from '../services/supabaseService';
import { MapPin, Save, Check } from 'lucide-react';

interface ResultCardProps {
  imageData: string;
  result: GeminiResponse;
  onSaved: (monument: Monument) => void;
  onCoordinatesUpdate: (lat: number, lng: number) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  imageData, 
  result, 
  onSaved,
  onCoordinatesUpdate 
}) => {
  const [userName, setUserName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [latitude, setLatitude] = useState(result.latitude || 27.7172);
  const [longitude, setLongitude] = useState(result.longitude || 85.3240);

  // Update coordinates in parent component when they change
  React.useEffect(() => {
    onCoordinatesUpdate(latitude, longitude);
  }, [latitude, longitude, onCoordinatesUpdate]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const monument: Monument = {
      name: result.name,
      description: result.description,
      imageUrl: imageData,
      latitude: latitude,
      longitude: longitude,
      timestamp: new Date().toISOString(),
      userName: userName || undefined
    };

    const savedMonument = await saveMonument(monument);
    
    setIsSaving(false);
    
    if (savedMonument) {
      setIsSaved(true);
      onSaved(savedMonument);
    }
  };

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'lat' | 'lng') => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      if (type === 'lat') {
        setLatitude(value);
        onCoordinatesUpdate(value, longitude);
      } else {
        setLongitude(value);
        onCoordinatesUpdate(latitude, value);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto animate-slide-up">
      <div className="h-52 overflow-hidden">
        <img 
          src={imageData} 
          alt={result.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary-700 mb-2">{result.name}</h2>
        
        <p className="text-stone-700 mb-4">{result.description}</p>
        
        <div className="space-y-4 mb-4">
          <div className="flex items-center text-stone-600 gap-1">
            <MapPin size={18} className="text-primary-500" />
            <span className="text-sm">Location Coordinates</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => handleCoordinateChange(e, 'lat')}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => handleCoordinateChange(e, 'lng')}
                className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-stone-600 mb-1">Your Name (Optional)</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-stone-300 rounded-md"
            disabled={isSaved}
          />
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 ${
            isSaved 
              ? 'bg-green-600 text-white' 
              : 'bg-primary-700 text-white hover:bg-primary-800'
          } transition-colors`}
        >
          {isSaved ? (
            <>
              <Check size={18} />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>{isSaving ? 'Saving...' : 'Save to Heritage Map'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;