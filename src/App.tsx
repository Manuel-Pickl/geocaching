import Scanner from './Scanner/Scanner';
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';

function App() {
  const debug = true;
  const [scanning, setScanning] = useState<boolean>(false);
  
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const geoPointFound = (geoPointName: string) => {
    const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
      if (!geoPoint) {
          return;
      }
      
      geoPoint.found = !geoPoint.found;
      geoPoint.time = new Date().toLocaleDateString('de-DE');

      GeoPoint.serializeGeoPoints(geoPoints);
      setGeoPoints([...geoPoints])
    };

  useEffect(() => {
      setGeoPoints(GeoPoint.getGeoPoints());
  }, []);
  
  const onScan = () => {
    setScanning(true);
  }
  
  const onHide = () => {
    console.log("hide");
  }

  const onScanResult = (message: string) => {
    setScanning(false);
    geoPointFound(message);
  }

  return (
    <>
      {debug &&
        <Debugger
          geoPoints={geoPoints}
          geoPointFound={geoPointFound}
        />
      }
      {!scanning ? (
        <Home
          geoPoints={geoPoints}
          geoPointFound={geoPointFound}
          onScan={onScan}
          onHide={onHide}
        />
      ) : (
        <Scanner
          onScanResult={onScanResult}
        />
      )}
    </>
  );
}

export default App;