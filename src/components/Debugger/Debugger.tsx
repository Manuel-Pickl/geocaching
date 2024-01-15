import "./Debugger.scss";
import FindGeocacheList from './FindGeocacheList/FindGeocacheList';
import Joystick from './Joystick/Joystick';
import { Geocache } from '../../types/Geocache';
import Draggable from "react-draggable";
import HideGeocacheList from "./HideGeocacheList/HideGeocacheList";

/**
 * Props for the Debugger component.
 */
interface DebuggerProps
{
    geocaches: Geocache[];
    setGeocaches: (geocaches: Geocache[]) => void;
    userPosition: [number, number] | null;
    setUserPosition: (value: [number, number]) => void;
    onGeocacheFound: (geocacheName: string) => void;
    onGeocacheHidden: (geocacheName: string) => void;
}

/**
 * The main Debugger component, which holds the different debugging tools.
 *
 * @param props - Props for Debugger component.
 * @component
 */
function Debugger({ geocaches, setGeocaches, userPosition, setUserPosition, onGeocacheFound, onGeocacheHidden }: DebuggerProps)
{    
    return (
        <Draggable handle=".draggable">
            <div className='debugger'>
                <div className="bar draggable">✢</div>

                <Joystick
                    userPosition={userPosition}
                    setUserPosition={setUserPosition}
                />

                <FindGeocacheList
                    geocaches={geocaches} setGeocaches={setGeocaches}
                    onGeocacheFound={onGeocacheFound}
                />

                <HideGeocacheList
                    geocaches={geocaches} setGeocaches={setGeocaches}
                    onGeocacheHidden={onGeocacheHidden}
                />
            </div>
        </Draggable>
    );
};

export default Debugger;