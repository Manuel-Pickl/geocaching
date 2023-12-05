import Search from './Search/Search';
import Footer from './Footer/Footer';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import { GeoPointManager } from './GeoPointManager';
import Settings from './Settings/Settings';
import LeafletMap from './LeafletMap/LeafletMap';

function App() {
  // LGS-Gelände
  const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];

  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(false);

  const geoPointManager = new GeoPointManager();
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const [scanIsOpen, setScanIsOpen] = useState<boolean>(false);
  const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false);

  useEffect(() => {
    loadPersistentSettings();
    askForPermissions();
  }, []);

  useEffect(() => {
    localStorage.setItem("radius", radius.toString());
  }, [radius]);
  useEffect(() => {
    localStorage.setItem("voiceIsOn", voiceIsOn.toString());
  }, [voiceIsOn]);
  useEffect(() => {
    localStorage.setItem("debug", debug.toString());
  }, [debug]);

  const initializeLocationWatcher = () => {
    navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      setUserPosition([position.coords.latitude, position.coords.longitude])
    });
  };

  const onExploreClick = () => {
    setScanIsOpen(false);
    setSettingsIsOpen(false);
  }

  const onScanResult = (geoPointName: string) => {
    setScanIsOpen(false);
    
    const result: boolean = geoPointManager.onGeoPointFound(geoPointName, geoPoints);
    const message: string = result
      ? `Herzlichen Glückwunsch! Du hast den Standort ${geoPointName} gefunden.`
      : `Schade! Den Standort ${geoPointName} hast du bereits gefunden.`;
    console.log(message);

    setGeoPoints([...geoPoints])
  }

  const loadPersistentSettings = () => {
    setGeoPoints(geoPointManager.getGeoPoints());
    setRadius(JSON.parse(localStorage.getItem("radius") ?? `${radius}`));
    setVoiceIsOn(JSON.parse(localStorage.getItem("voiceIsOn") ?? `${voiceIsOn}`));
    setDebug(JSON.parse(localStorage.getItem("debug") ?? `${debug}`));
  }

  const askForPermissions = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      () => { initializeLocationWatcher(); },
      () => { console.log("gps denied") },
    );
  }
}

  return (
    <div className="app">
      {debug &&
        <Debugger
          geoPointManager={geoPointManager}
          geoPoints={geoPoints} setGeoPoints={setGeoPoints}
          userPosition={userPosition} setUserPosition={setUserPosition}
        />
      }

      <LeafletMap
          position={mapCenter}
          userPosition={userPosition}
          geoPoints={geoPoints}
          radius={radius}
          voiceIsOn={voiceIsOn}
      />
      
      <Footer
        onExploreClick={onExploreClick}
        onScanClick={() => setScanIsOpen(true)}
        onContributeClick={() => {}}
        onSettingsClick={() => setSettingsIsOpen(true)}
      />

      <Search
        isOpen={scanIsOpen}
        onClose={() => setScanIsOpen(false)}
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