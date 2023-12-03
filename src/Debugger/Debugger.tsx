import React from 'react';
import "./Debugger.scss";
import { GeoPoint } from '../GeoPoint';

interface DebuggerProps {
  geoPoints: GeoPoint[];
//   setGeoPoints: (geoPoints: GeoPoint[]) => void;
}

const Debugger: React.FC<DebuggerProps> = ({ geoPoints }) => {
    const showLocalStorage = () => {
        const alertMessage = geoPoints.map(point => {
            return `${point.found ? '✓' : '✗'} ${point.name}: ${point.time}`;
        }).join('\n');
        
        alert(alertMessage);
    };
    
    return (
        <div className='debugger'>
            {/* <Dropdown
                geoPoints={geoPoints}
                onSelectionChanged={geoPointFound}
            /> */}
            <button onClick={showLocalStorage}>LocalStorage</button>
        </div>
    );
};

export default Debugger;