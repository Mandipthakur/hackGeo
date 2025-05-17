import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import HeritageMap from './pages/HeritageMap';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<HeritageMap />} />
          </Routes>
        </main>
        
        <footer className="bg-primary-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-sm">
            <p>© 2025 NepaliHeritage Voice Map | Discover and preserve cultural heritage</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;