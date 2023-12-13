import "./Debugger.scss";
import FindGeocacheList from './FindGeocacheList/FindGeocacheList';
import Joystick from './Joystick/Joystick';
import { Geocache } from '../../types/Geocache';
import Draggable from "react-draggable";
import HideGeocacheList from "./HideGeocacheList/HideGeocacheList";
import { GeocacheManager } from "../../services/GeocacheManager";

interface DebuggerProps
{
    geocaches: Geocache[];
    setGeocaches: (geocaches: Geocache[]) => void;
    userPosition: [number, number] | null;
    setUserPosition: (value: [number, number]) => void;
    onGeocacheFound: (geocacheName: string) => void;
    onGeocacheHidden: (geocacheName: string) => void;
    geocacheManager: GeocacheManager;
}

function Debugger({ geocaches, setGeocaches, userPosition, setUserPosition, onGeocacheFound, onGeocacheHidden, geocacheManager }: DebuggerProps)
{
    function clearLocalStorage()
    {
        localStorage.clear();
        setGeocaches([]);
    }
    
    return (
        <Draggable handle=".draggable">
            <div className='debugger'>
                <div className="bar draggable">✢</div>
                <Joystick
                    userPosition={userPosition}
                    setUserPosition={setUserPosition}
                />
                <button
                    onClick={clearLocalStorage}
                >
                    clear localstorage
                </button>
                <FindGeocacheList
                    geocaches={geocaches} setGeocaches={setGeocaches}
                    onGeocacheFound={onGeocacheFound}
                />
                <HideGeocacheList
                    geocaches={geocaches} setGeocaches={setGeocaches}
                    onGeocacheHidden={onGeocacheHidden}
                    geocacheManager={geocacheManager}
                />
            </div>
        </Draggable>
    );
};

export default Debugger;