import './App.css';
import LeafletMap from './LeafletMap/LeafletMap';
import userPosition from './locationFetcher';
import { GeoPoint } from './GeoPoint';
import { useEffect, useState } from 'react';
import Dropdown from './Dropdown/Dropdown';

function App() {
  // LGS-Gelände
  const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);

  const geoPointFound = (geoPoint: GeoPoint) => {
    geoPoint.found = !geoPoint.found;

    GeoPoint.serializeGeoPoints(geoPoints);
    setGeoPoints([...geoPoints])
  };

  useEffect(() => {
    setGeoPoints(GeoPoint.getGeoPoints());
  }, []);
  
  return (
    <>
      <LeafletMap position={mapCenter} userPosition={userPosition()} geoPoints={geoPoints} />
      <Dropdown geoPoints={geoPoints} onSelectChange={geoPointFound} />
    </>
  );
}

export default App;