import "./Debugger.scss";
import CheckboxList from './CheckboxList/CheckboxList';
import Joystick from './Joystick/Joystick';
import { GeocacheManager } from '../../services/GeocacheManager';
import { Geocache } from '../../types/Geocache';

interface DebuggerProps
{
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (geocaches: Geocache[]) => void;
    userPosition: [number, number] | null;
    setUserPosition: (value: [number, number]) => void;
}

function Debugger({geocacheManager, geocaches, setGeocaches, userPosition, setUserPosition }: DebuggerProps)
{
    function clearLocalStorage()
    {
        localStorage.clear();
        setGeocaches(geocacheManager.getDefaultGeocaches());
    }
    
    return (
        <div className='debugger'>
            <Joystick
                userPosition={userPosition}
                setUserPosition={setUserPosition}
            />
            <button
                onClick={clearLocalStorage}
            >
                clear localstorage
            </button>
            <CheckboxList
                geocaches={geocaches} setGeocaches={setGeocaches}
            />
        </div>
    );
};

export default Debugger;