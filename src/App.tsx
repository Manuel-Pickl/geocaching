import React from 'react';
import './App.css'
import LeafletMap from './LeafletMap/LeafletMap';
import userPosition from './locationFetcher';

const mapCenter: [number, number] = [49.4169693, 11.8820955];

function App() {
  return (
    <>
      <LeafletMap position={mapCenter} userPosition={userPosition()}/>
    </>
  )
}

export default App