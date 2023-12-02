import Scanner from './Scanner/Scanner';
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import "./App.scss";

function App() {
  const debug = true;
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  
  const geoPointFound = (geoPointName: string) => {
    const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
      if (!geoPoint) {
          return;
      }
      
      geoPoint.found = true;
      geoPoint.time = new Date().toLocaleDateString('de-DE');

      GeoPoint.serializeGeoPoints(geoPoints);
      setGeoPoints([...geoPoints])
    };

  useEffect(() => {
      setGeoPoints(GeoPoint.getGeoPoints());
  }, []);
  
  const onOpenSearch = () => {
    setScannerOpen(true);
  }

  const onCloseSearch = () => {
    setScannerOpen(false);
  }

  const onScanResult = (geoPoint: string) => {
    setScannerOpen(false);
    geoPointFound(geoPoint);
    alert(`Standort ${geoPoint} gefunden!`);
  }

  const onOpenHide = () => {
    console.log("hide");
  }

  return (
    <div className="app">
      {debug &&
        <Debugger
          geoPoints={geoPoints}
          geoPointFound={geoPointFound}
        />
      }
      <Home
        geoPoints={geoPoints}
        onOpenSearch={onOpenSearch}
        onOpenHide={onOpenHide}
      />
      <Scanner
        scannerOpen={scannerOpen}
        onCloseSearch={onCloseSearch}
        onScanResult={onScanResult}
      />
    </div>
  );
}

export default App;