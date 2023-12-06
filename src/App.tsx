import Scan from './Tab/Scan/Scan';
import Footer from './Footer/Footer';
import { useEffect, useState } from 'react';
import { GeoPoint } from './GeoPoint';
import Debugger from './Debugger/Debugger';
import { GeoPointManager } from './GeoPointManager';
import Settings from './Tab/Settings/Settings';
import LeafletMap from './LeafletMap/LeafletMap';
import { Tab } from './Tabs';
import Contribute from './Tab/Contribute/Contribute';

function App() {
  // LGS-Gelände
  const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];

  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(false);

  const geoPointManager = new GeoPointManager();
  const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

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

  const onScanResult = (geoPointName: string) => {
    setActiveTab(Tab.Explore);
    
    const result: boolean = geoPointManager.onGeoPointFound(geoPointName, geoPoints);
    const message: string = result
      ? `Herzlichen Glückwunsch! Du hast den Standort ${geoPointName} gefunden.`
      : `Schade! Den Standort ${geoPointName} hast du bereits gefunden.`;
    console.log(message);

    setGeoPoints([...geoPoints])
  }

  const onContribute = (geoPointName: string) => {
    geoPointManager.addGeoPoint(geoPoints, geoPointName, userPosition);
    setGeoPoints([...geoPoints]);
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
        activeTab={activeTab} setActiveTab={setActiveTab}
      />

      {/* tabs */}
      <Scan
        isOpen={activeTab == Tab.Scan}
        onScanResult={onScanResult}
      />

      <Contribute
        isOpen={activeTab == Tab.Contribute}
        onContribute={onContribute}
      />
      
      <Settings 
        isOpen={activeTab == Tab.Settings}
        geoPoints={geoPoints}
        radius={radius} setRadius={setRadius}
        voiceIsOn={voiceIsOn} setVoiceIsOn={setVoiceIsOn}
        debug={debug} setDebug={setDebug}
      />
    </div>
  );
}

export default App;