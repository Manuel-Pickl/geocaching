import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Geocache } from './types/Geocache';
import { GeocacheManager } from './services/GeocacheManager';
import { Tab } from './types/Tab';
import { serialize, deserialize } from './services/JsonHelper';
import Debugger from './components/Debugger/Debugger';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Settings from './components/Tabs/Settings/Settings';
import { Flip, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoFromAssets from "./assets/globe.svg";
import Find from './components/Tabs/Find/Find';
import Hide from './components/Tabs/Hide/Hide';

/**
 * The main App component.
 *
 * @component
 * @category Component
 */
const App = () =>
{
  // LGS-Gelände
  const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];

  const [radius, setRadius] = useState<number>(50);
  const [voiceIsOn, setVoiceIsOn] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(false);

  const geocacheManager = new GeocacheManager();
  const [geocaches, setGeocaches] = useState<Geocache[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

  useEffect(() =>
  {
    loadPersistentSettings();
    requestPermissionGPS();
  }, []);

  useEffect(() => { serialize("geocaches", geocaches)}, [geocaches]);
  useEffect(() => { serialize("radius", radius); }, [radius]);
  useEffect(() => { serialize("voiceIsOn", voiceIsOn); }, [voiceIsOn]);
  useEffect(() => { serialize("debug", debug); }, [debug]);

  /**
   * Loads the persistent settings from LocalStorage
   */
  const loadPersistentSettings = (): void =>
  {
    setGeocaches(deserialize("geocaches") ?? geocacheManager.getDefaultGeocaches());
    setRadius(deserialize("radius") ?? radius);
    setVoiceIsOn(deserialize("voiceIsOn") ?? voiceIsOn);
    setDebug(deserialize("debug") ?? debug);
  }

  /**
   * Initializes the watch on the user's GPS.
   * When debug is false, the userPosition gets updated with the current GPS.
   */
  function initializeLocationWatcher(): void
  {
    navigator.geolocation.watchPosition((position: GeolocationPosition) =>
    {
      if (debug)
      {
        return;
      }
      
      setUserPosition([position.coords.latitude, position.coords.longitude])
    });
  };

  /**
   * Requests the permission for GPS.
   */
  function requestPermissionGPS(): void
  {
    if (!('geolocation' in navigator))
    {
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      () => { 
        console.log("'GPS' permission granted")
        initializeLocationWatcher();
      },
      () => { console.log("'GPS' permission denied") },
    );
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
      <Find
        isOpen={activeTab == Tab.Find}
        geocacheManager={geocacheManager}
        geocaches={geocaches}
        setGeocaches={setGeocaches}
        setActiveTab={setActiveTab}
      />

      <Hide
        isOpen={activeTab == Tab.Hide}
        geocacheManager={geocacheManager}
        geocaches={geocaches}
        setGeocaches={setGeocaches}
        userPosition={userPosition}
        setActiveTab={setActiveTab}
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