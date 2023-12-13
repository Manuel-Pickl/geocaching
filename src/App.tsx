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
import Find from './components/Tabs/Find/Find';
import Hide from './components/Tabs/Hide/Hide';
import { Result } from './types/Result';
import { PermissionManager } from './services/PermissionManager';
import Credits from './components/Tabs/Credits/Credits';

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
  const [geocaches, setGeocaches] = useState<Geocache[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Explore);

  useEffect(() =>
  {
    loadPersistentSettings();
    PermissionManager.requestPermissionGPS(setUserPosition, debug);
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

  function onGeocacheFound(geocacheName: string): void
  {
      const findGeocacheResult: Result = GeocacheManager.findGeocache(geocacheName, geocaches, setGeocaches);
      toast(findGeocacheResult.message);
      setActiveTab(Tab.Explore);
  }

  function onGeocacheHidden(geocacheName: string): void
  {
      const hideGeocacheResult: Result = GeocacheManager.hideGeocache(geocaches, geocacheName, userPosition, setGeocaches);
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
        radius={radius} setRadius={setRadius}
        voiceIsOn={voiceIsOn} setVoiceIsOn={setVoiceIsOn}
        debug={debug} setDebug={setDebug}
      />

      <Credits
        isOpen={activeTab == Tab.Credits}
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
        icon={<img src="logo.svg" alt="logo" />}
      />
    </div>
  );
}

export default App;