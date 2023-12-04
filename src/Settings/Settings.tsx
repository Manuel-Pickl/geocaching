import React from 'react';
import Switch from 'react-switch';
import './Settings.scss';
import { GeoPoint } from '../GeoPoint';

interface SettingsProps {
    isOpen: boolean;
    onClose: () => void;
    geoPoints: GeoPoint[];
    radius: number; setRadius: (value: number) => void;
    voiceIsOn: boolean; setVoiceIsOn: (value: boolean) => void;
    debug: boolean; setDebug: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
    isOpen,
    onClose,
    geoPoints,
    radius, setRadius,
    voiceIsOn, setVoiceIsOn,
    debug, setDebug}) => {

    return (
        <>
            {isOpen &&
                <div className='tab'>
                    <div className="backdrop" />
                    <div className="modal">
                        <button className="close" onClick={onClose}>x</button>
                        Settings
                        <ul>
                            Gefunden
                            {geoPoints
                                .filter(geoPoint => geoPoint.found)
                                .map((geoPoint, index) => (
                                <li key={index}>
                                    ✓ {geoPoint.name}: {geoPoint.time}
                                </li>
                            ))}
                        </ul>
                        <ul>
                            Noch Entdecken
                            {geoPoints
                                .filter(geoPoint => !geoPoint.found)
                                .map((geoPoint, index) => (
                                <li key={index}>
                                    ✗ {geoPoint.name}: {geoPoint.time}
                                </li>
                            ))}
                        </ul>
                        <div>
                            <label htmlFor="radius">Radius:</label>
                            <input
                                type="range"
                                min={10}
                                max={100}
                                step={1}
                                value={radius}
                                onChange={(event) => setRadius(parseFloat(event.target.value))}
                            />
                            <span>{radius}</span>
                        </div>
                        <div>
                            <label htmlFor='voiceIsOn'>Voice:</label>
                            <Switch
                                id='voiceIsOn'
                                checked={voiceIsOn}
                                onChange={() => setVoiceIsOn(!voiceIsOn)}
                            />
                        </div>
                        <div>
                            <label htmlFor='debug'>Debug:</label>
                            <Switch
                                id='debug'
                                checked={debug}
                                onChange={() => setDebug(!debug)}
                            />
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Settings;