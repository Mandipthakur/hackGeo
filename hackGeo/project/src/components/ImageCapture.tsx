import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';

interface ImageCaptureProps {
  onImageCaptured: (imageData: string) => void;
}

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCaptured }) => {
  const [captureMode, setCaptureMode] = useState<'none' | 'camera' | 'upload'>('none');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCameraCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCapturedImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onImageCaptured(capturedImage);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
  };

  const handleCancel = () => {
    setCaptureMode('none');
    setCapturedImage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {captureMode === 'none' ? (
        <div className="flex flex-col space-y-4 animate-fade-in">
          <button
            onClick={() => setCaptureMode('camera')}
            className="flex items-center justify-center gap-2 bg-primary-700 text-white py-3 px-6 rounded-lg shadow-md hover:bg-primary-800 transition-colors"
          >
            <Camera size={20} />
            <span>Capture with Camera</span>
          </button>
          <button
            onClick={() => setCaptureMode('upload')}
            className="flex items-center justify-center gap-2 bg-stone-100 text-primary-700 border border-primary-700 py-3 px-6 rounded-lg shadow-sm hover:bg-stone-200 transition-colors"
          >
            <Upload size={20} />
            <span>Upload Image</span>
          </button>
        </div>
      ) : captureMode === 'camera' && !capturedImage ? (
        <div className="space-y-4 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden bg-black shadow-lg">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: 'environment',
              }}
              className="w-full h-auto"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1 py-2 px-4 bg-stone-100 text-stone-800 rounded-lg"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleCameraCapture}
              className="flex items-center gap-1 py-2 px-4 bg-primary-700 text-white rounded-lg"
            >
              <Camera size={16} />
              <span>Capture</span>
            </button>
          </div>
        </div>
      ) : captureMode === 'upload' && !capturedImage ? (
        <div className="space-y-4 animate-fade-in">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 bg-stone-50 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors"
          >
            <Upload size={40} className="mx-auto mb-2 text-stone-400" />
            <p className="text-stone-600">Click to select an image</p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 py-2 px-4 bg-stone-100 text-stone-800 rounded-lg"
          >
            <X size={16} />
            <span>Cancel</span>
          </button>
        </div>
      ) : capturedImage ? (
        <div className="space-y-4 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-auto"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 py-2 px-4 bg-stone-100 text-stone-800 rounded-lg"
            >
              <RotateCcw size={16} />
              <span>Retake</span>
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-1 py-2 px-4 bg-primary-700 text-white rounded-lg"
            >
              <span>Confirm & Identify</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageCapture;