import React from 'react';
import "./Debugger.scss";
import CheckboxList from './CheckboxList/CheckboxList';
import Joystick from './Joystick/Joystick';
import { GeocacheManager } from '../../services/GeocacheManager';
import { Geocache } from '../../types/Geocache';

interface DebuggerProps {
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (geocaches: Geocache[]) => void;
    userPosition: [number, number] | null;
    setUserPosition: (value: [number, number]) => void;
}

const Debugger: React.FC<DebuggerProps> = ({geocacheManager, geocaches, setGeocaches, userPosition, setUserPosition }) =>
{
    const clearLocalStorage = () => {
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
                geocacheManager={geocacheManager}
                geocaches={geocaches} setGeocaches={setGeocaches}
            />
        </div>
    );
};

export default Debugger;