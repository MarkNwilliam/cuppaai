import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.js';
import VideoAdPage from './pages/VideoAdPage.js';
import AudioAd from './pages/AudioAd.js';
import Reels from './pages/Reels.js';
import React from 'react';

function App() {
  return (
    <div className="App">
     <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/audio-ads" element={<AudioAd />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/video-ads" element={<VideoAdPage />} />

   
      </Routes>
    </div>
    </div>
  );
}

export default App;