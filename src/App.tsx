import Search from './Search/Search';
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import "./App.scss";
import { GeoPointManager } from './GeoPointManager';
import Settings from './Settings/Settings';

function App() {
  const geoPointManager = new GeoPointManager();
  
  const [debug, setDebug] = useState<boolean>(true);
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);

  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false);

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
          geoPoints={geoPoints} setGeoPoints={setGeoPoints}
          geoPointManager={geoPointManager}
        />
      }

      <Home
        geoPoints={geoPoints}
        onSearchOpen={() => setSearchIsOpen(true)}
        onSettingsOpen={() => setSettingsIsOpen(true)}
      />

      <Search
        isOpen={searchIsOpen}
        onClose={() => setSearchIsOpen(false)}
        onScanResult={onScanResult}
      />

      <Settings 
        isOpen={settingsIsOpen}
        onClose={() => setSettingsIsOpen(false)}
        geoPoints={geoPoints}
        radius={radius} setRadius={setRadius}
        voiceIsOn={voiceIsOn} setVoiceIsOn={setVoiceIsOn}
        debug={debug} setDebug={setDebug}
      />
    </div>
  );
}

export default App;