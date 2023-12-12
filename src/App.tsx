import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Geocache } from './types/Geocache';
import { GeocacheManager } from './services/GeocacheManager';
import { Tab } from './types/Tab';
import { serialize, deserialize } from './services/JsonHelper';
import Debugger from './components/Debugger/Debugger';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Contribute from './components/Tabs/Contribute/Contribute';
import Scan from './components/Tabs/Scan/Scan';
import Settings from './components/Tabs/Settings/Settings';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoFromAssets from "./assets/globe.svg";

function App() {
  // LGS-Gelände
  const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];

  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(false);

  const geocacheManager = new GeocacheManager();
  const [geocaches, setGeocaches] = useState<Geocache[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

  useEffect(() => {
    loadPersistentSettings();
    requestPermissionGPS();
  }, []);

  useEffect(() => {
    serialize("geocaches", geocaches);
  }, [geocaches]);
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
      if (debug) {
        return;
      }
      
      setUserPosition([position.coords.latitude, position.coords.longitude])
    });
  };

  const loadPersistentSettings = () => {
    setGeocaches(deserialize("geocaches") ?? geocacheManager.getDefaultGeocaches());
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
          geocacheManager={geocacheManager}
          geocaches={geocaches} setGeocaches={setGeocaches}
          userPosition={userPosition} setUserPosition={setUserPosition}
        />
      }

      <LeafletMap
          position={mapCenter}
          userPosition={userPosition}
          geocaches={geocaches}
          radius={radius}
          voiceIsOn={voiceIsOn}
      />
      
      <Footer
        activeTab={activeTab} setActiveTab={setActiveTab}
      />

      {/* tabs */}
      <Scan
        isOpen={activeTab == Tab.Scan}
        geocacheManager={geocacheManager}
        geocaches={geocaches}
        setGeocaches={setGeocaches}
        setActiveTab={setActiveTab}
      />

      <Contribute
        isOpen={activeTab == Tab.Contribute}
        geocacheManager={geocacheManager}
        geocaches={geocaches}
        setGeocaches={setGeocaches}
        userPosition={userPosition}
      />
      
      <Settings 
        isOpen={activeTab == Tab.Settings}
        geocaches={geocaches}
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
        draggable={false}
        transition={Flip}
        className={"toast"}
        bodyClassName={"toast-content"}
        icon={<img src={logoFromAssets} alt="logo" />}
      />
    </div>
  );
}

export default App;