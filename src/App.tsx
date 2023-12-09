import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { GeoPoint } from './types/GeoPoint';
import { GeoPointManager } from './services/GeoPointManager';
import { Tab } from './types/Tab';
import { serialize, deserialize } from './services/JsonHelper';
import Debugger from './components/Debugger/Debugger';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Contribute from './components/Tabs/Contribute/Contribute';
import Scan from './components/Tabs/Scan/Scan';
import Settings from './components/Tabs/Settings/Settings';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../public/globe.svg";

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
    requestPermissionGPS();
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

  const requestPermissionGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => { 
          console.log("'GPS' permission granted")
          initializeLocationWatcher();
        },
        () => { console.log("'GPS' permission denied") },
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
      
      <ToastContainer
        position="top-center"
        autoClose={4800}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        closeButton={false}
        pauseOnFocusLoss={false}
        draggable
        transition={Flip}
        className={"toast"}
        bodyClassName={"toast-content"}
        icon={<img src={logo} alt="logo" />}
      />
    </div>
  );
}

export default App;