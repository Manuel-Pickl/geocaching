import Search from './Search/Search';
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import "./App.scss";
import { GeoPointManager } from './GeoPointManager';

function App() {
  const debug = false;
  const geoPointManager = new GeoPointManager();

  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  // const [hideIsOpen, setHideIsOpen] = useState<boolean>(false);

  useEffect(() => {
      setGeoPoints(geoPointManager.getGeoPoints());
  }, []);
  
  const onScanResult = (geoPointName: string) => {
    setSearchIsOpen(false);
    
    const result: boolean = geoPointManager.onGeoPointFound(geoPointName, geoPoints);
    const message: string = result
      ? `Herzlichen Glückwunsch! Du hast den Standort ${geoPointName} gefunden.`
      : `Schade! Den Standort ${geoPointName} hast du bereits gefunden.`;
    console.log(message);

    setGeoPoints([...geoPoints])
  }

  return (
    <div className="app">
      {debug &&
        <Debugger
          geoPoints={geoPoints}
          // setGeoPoints={setGeoPoints}
        />
      }
      <Home
        geoPoints={geoPoints}
        onSearchOpen={() => setSearchIsOpen(true)}
        // onHideOpen={() => setHideIsOpen(true)}
      />
      <Search
        isOpen={searchIsOpen}
        onClose={() => setSearchIsOpen(false)}
        onScanResult={onScanResult}
      />
    </div>
  );
}

export default App;