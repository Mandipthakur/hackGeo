import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandmarkIcon, Info } from 'lucide-react';
import ImageCapture from '../components/ImageCapture';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultCard from '../components/ResultCard';
import MapView from '../components/MapView';
import { identifyMonument } from '../services/geminiService';
import { GeminiResponse, Monument } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [imageData, setImageData] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<GeminiResponse | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([27.7172, 85.3240]);
  const [showInfo, setShowInfo] = useState(true);

  const handleImageCaptured = async (imageData: string) => {
    setImageData(imageData);
    setIsIdentifying(true);
    
    try {
      const identificationResult = await identifyMonument(imageData);
      setResult(identificationResult);
      
      // Update coordinates if available
      if (identificationResult.latitude && identificationResult.longitude) {
        setCoordinates([identificationResult.latitude, identificationResult.longitude]);
      }
    } catch (error) {
      console.error('Error identifying monument:', error);
    } finally {
      setIsIdentifying(false);
    }
  };

  const handleSaved = (monument: Monument) => {
    // Redirect to map view after a short delay
    setTimeout(() => {
      navigate('/map', { state: { highlightId: monument.id } });
    }, 1500);
  };

  const handleCoordinatesUpdate = (lat: number, lng: number) => {
    setCoordinates([lat, lng]);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Banner */}
      {showInfo && (
        <div className="bg-stone-50 border-l-4 border-accent-500 p-4 rounded-md shadow-sm mb-6 animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info size={20} className="text-accent-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-stone-800">How it works</h3>
              <div className="mt-2 text-sm text-stone-600">
                <p>Capture or upload an image of a Nepalese monument and our AI will identify it and provide cultural information.</p>
              </div>
              <div className="mt-3">
                <button 
                  type="button"
                  onClick={() => setShowInfo(false)}
                  className="text-sm font-medium text-primary-700 hover:text-primary-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
        <LandmarkIcon size={24} className="text-primary-700" />
        <span>Discover Nepalese Heritage</span>
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!imageData ? (
            <ImageCapture onImageCaptured={handleImageCaptured} />
          ) : isIdentifying ? (
            <LoadingSpinner message="Identifying monument..." />
          ) : result ? (
            <ResultCard 
              imageData={imageData} 
              result={result} 
              onSaved={handleSaved}
              onCoordinatesUpdate={handleCoordinatesUpdate}
            />
          ) : null}
        </div>
        
        <div className="rounded-lg overflow-hidden">
          <MapView 
            monuments={result ? [{
              name: result.name,
              description: result.description,
              imageUrl: imageData || '',
              latitude: coordinates[0],
              longitude: coordinates[1],
              timestamp: new Date().toISOString()
            }] : []}
            currentLocation={coordinates}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;