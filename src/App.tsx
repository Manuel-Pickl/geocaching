import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
import { Geocache } from './types/Geocache';
import { GeocacheManager } from './services/GeocacheManager';
import { Tab } from './types/Tab';
import { serialize, deserialize } from './services/JsonHelper';
import Debugger from './components/Debugger/Debugger';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Settings from './components/Tabs/Settings/Settings';
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoFromAssets from "./assets/globe.svg";
import Find from './components/Tabs/Find/Find';
import Hide from './components/Tabs/Hide/Hide';
import { Result } from './types/Result';

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
    setGeocaches(deserialize("geocaches") ?? geocaches);
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

  function onGeocacheFound(geocacheName: string): void
  {
      const findGeocacheResult: Result = geocacheManager.findGeocache(geocacheName, geocaches, setGeocaches);
      toast(findGeocacheResult.message);
      setActiveTab(Tab.Explore);
  }

  function onGeocacheHidden(geocacheName: string): void
  {
      const hideGeocacheResult: Result = geocacheManager.hideGeocache(geocaches, geocacheName, userPosition, setGeocaches);
      toast(hideGeocacheResult.message);
      setActiveTab(Tab.Explore);
  }

  return (
    <div className="app">
      {debug &&
        <Debugger
          geocaches={geocaches} setGeocaches={setGeocaches}
          userPosition={userPosition} setUserPosition={setUserPosition}
          onGeocacheFound={onGeocacheFound}
          onGeocacheHidden={onGeocacheHidden}
          geocacheManager={geocacheManager}
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

      <Find
        isOpen={activeTab == Tab.Find}
        onGeocacheFound={onGeocacheFound}
      />

      <Hide
        isOpen={activeTab == Tab.Hide}
        onGeocacheHidden={onGeocacheHidden}
      />
      
      <Settings 
        isOpen={activeTab == Tab.Settings}
        geocaches={geocaches}
        geocacheManager={geocacheManager}
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