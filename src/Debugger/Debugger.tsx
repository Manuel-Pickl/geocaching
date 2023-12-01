import React from 'react';
import { GeoPoint } from '../GeoPoint';
import Dropdown from '../Dropdown/Dropdown';
import "./Debugger.css";

interface DebuggerProps {
  geoPoints: GeoPoint[];
  geoPointFound: (geoPointName: string) => void;
}

const Debugger: React.FC<DebuggerProps> = ({ geoPoints, geoPointFound }) => {
    const showLocalStorage = () => {
        const alertMessage = geoPoints.map(point => {
            return `${point.found ? '✓' : '✗'} ${point.name}: ${point.time}`;
        }).join('\n');
        
        alert(alertMessage);
    }    

    return (
        <div className='debugger'>
            <Dropdown
                geoPoints={geoPoints}
                onSelectionChanged={geoPointFound}
            />
            <button onClick={showLocalStorage}>LocalStorage</button>
        </div>
    );
};

export default Debugger;