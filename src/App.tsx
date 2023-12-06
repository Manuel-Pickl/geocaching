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
import { serialize, deserialize } from './JsonHelper';

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
    serialize("geoPoints", geoPoints);
  }, [geoPoints]);
  useEffect(() => {
    serialize("radius", radius);
  }, [radius]);
  useEffect(() => {
    serialize("voiceIsOn", voiceIsOn);
  }, [voiceIsOn]);
  useEffect(() => {
    serialize("debug", debug);
  }, [debug]);

  const initializeLocationWatcher = () => {
    navigator.geolocation.watchPosition((position: GeolocationPosition) => {
      setUserPosition([position.coords.latitude, position.coords.longitude])
    });
  };

  const loadPersistentSettings = () => {
    setGeoPoints(deserialize("geoPoints") ?? geoPointManager.getDefaultGeoPoints());
    setRadius(deserialize("radius") ?? radius);
    setVoiceIsOn(deserialize("voiceIsOn") ?? voiceIsOn);
    setDebug(deserialize("debug") ?? debug);
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
        geoPointManager={geoPointManager}
        geoPoints={geoPoints}
        setGeoPoints={setGeoPoints}
        setActiveTab={setActiveTab}
      />

      <Contribute
        isOpen={activeTab == Tab.Contribute}
        geoPointManager={geoPointManager}
        geoPoints={geoPoints}
        setGeoPoints={setGeoPoints}
        userPosition={userPosition}
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