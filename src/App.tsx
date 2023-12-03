import Search from './Search/Search';
import Home from './Home/Home';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import { GeoPointManager } from './GeoPointManager';
import Settings from './Settings/Settings';

function App() {
  const geoPointManager = new GeoPointManager();

  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(true);
  const [direction, setDirection] = useState<[number, number]>([0,0]);

  const [searchIsOpen, setSearchIsOpen] = useState<boolean>(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false);

  useEffect(() => {
    askForPermissions();
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

  const askForPermissions = () => {
    if ('geolocation' in navigator) {
      (navigator as Navigator).geolocation.getCurrentPosition(() => {});
    }
    else if ('permissions' in navigator) {
      (navigator as Navigator).permissions.query({ name: 'geolocation' });
    }
  };

  return (
    <div className="app">
      {debug &&
        <Debugger
          geoPointManager={geoPointManager}
          geoPoints={geoPoints} setGeoPoints={setGeoPoints}
          setDirection={setDirection}
        />
      }

      <Home
        geoPoints={geoPoints}
        onSearchOpen={() => setSearchIsOpen(true)}
        onSettingsOpen={() => setSettingsIsOpen(true)}
        debug={debug}
        direction={direction}
        radius={radius}
        voiceIsOn={voiceIsOn}
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