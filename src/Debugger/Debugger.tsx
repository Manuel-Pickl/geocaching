import React from 'react';
import "./Debugger.scss";
import { GeoPoint } from '../GeoPoint';
import { GeoPointManager } from '../GeoPointManager';
import CheckboxList from './CheckboxList/CheckboxList';
import Joystick from './Joystick/Joystick';

interface DebuggerProps {
    geoPointManager: GeoPointManager;
    geoPoints: GeoPoint[];
    setGeoPoints: (geoPoints: GeoPoint[]) => void;
    userPosition: [number, number] | null;
    setUserPosition: (value: [number, number]) => void;
}

const Debugger: React.FC<DebuggerProps> = ({geoPointManager, geoPoints, setGeoPoints, userPosition, setUserPosition }) =>
{
    const clearLocalStorage = () => {
        localStorage.clear();
        setGeoPoints(geoPointManager.getDefaultGeoPoints());
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
                geoPointManager={geoPointManager}
                geoPoints={geoPoints} setGeoPoints={setGeoPoints}
            />
        </div>
    );
};

export default Debugger;