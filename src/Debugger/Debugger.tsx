import React from 'react';
import "./Debugger.scss";
import { GeoPoint } from '../GeoPoint';
import { GeoPointManager } from '../GeoPointManager';
import CheckboxList from './CheckboxList/CheckboxList';

interface DebuggerProps {
  geoPoints: GeoPoint[];
  setGeoPoints: (geoPoints: GeoPoint[]) => void;
  geoPointManager: GeoPointManager;
}

const Debugger: React.FC<DebuggerProps> = ({
    geoPoints,
    setGeoPoints,
    geoPointManager }) => {
    const clearLocalStorage = () => {
        localStorage.clear();
        setGeoPoints(geoPointManager.getGeoPoints());
    }
    
    return (
        <div className='debugger'>
            <button onClick={clearLocalStorage}>clear localstorage</button>
            <CheckboxList
                geoPointManager={geoPointManager}
                geoPoints={geoPoints} setGeoPoints={setGeoPoints}/>
        </div>
    );
};

export default Debugger;