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
    setDirection: (direction: [number, number]) => void;
}

const Debugger: React.FC<DebuggerProps> = ({
    geoPointManager,
    geoPoints, setGeoPoints,
    setDirection
    }) => {
    const clearLocalStorage = () => {
        localStorage.clear();
        setGeoPoints(geoPointManager.getGeoPoints());
    }
    
    return (
        <div className='debugger'>
            <Joystick setDirection={setDirection} />
            <button onClick={clearLocalStorage}>clear localstorage</button>
            <CheckboxList
                geoPointManager={geoPointManager}
                geoPoints={geoPoints} setGeoPoints={setGeoPoints}/>
        </div>
    );
};

export default Debugger;