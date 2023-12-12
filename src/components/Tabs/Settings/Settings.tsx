import React from 'react';
import Switch from 'react-switch';
import './Settings.scss';
import "../tabs.scss";
import { Geocache } from '../../../types/Geocache';

interface SettingsProps {
    isOpen: boolean;
    geocaches: Geocache[];
    radius: number; setRadius: (value: number) => void;
    voiceIsOn: boolean; setVoiceIsOn: (value: boolean) => void;
    debug: boolean; setDebug: (value: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, geocaches, radius, setRadius, voiceIsOn, setVoiceIsOn, debug, setDebug }) => {
    return (
        <>
            {isOpen &&
                <div className="tab settings">
                    <span><b>Geochaches</b></span>
                    <ul>
                        {geocaches
                            .filter(geocache => geocache.found)
                            .map((geocache, index) => (
                            <li key={index} className="found">
                                <div>✓</div>
                                <div className="name">{geocache.name}</div>
                                <div>{geocache.time}</div>
                            </li>
                        ))}
                        {geocaches
                            .filter(geocache => !geocache.found)
                            .map((geocache, index) => (
                            <li key={index}>
                                <div>✗</div>
                                <div className="name">{geocache.name}</div>
                                <div>{geocache.time}</div>
                            </li>
                        ))}
                    </ul>

                    <hr/>
                    <span><b>Settings</b></span>
                    <div className="setting">
                        <span className="name">Radius:</span>
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
                    <div className="setting">
                        <span className="name">Voice:</span>
                        <Switch
                            id='voiceIsOn'
                            checked={voiceIsOn}
                            onChange={() => setVoiceIsOn(!voiceIsOn)}
                        />
                    </div>
                    <div className="setting">
                        <span className="name">Debug:</span>
                        <Switch
                            id='debug'
                            checked={debug}
                            onChange={() => setDebug(!debug)}
                        />
                    </div>
                    
                    <hr/>
                    <span><b>Permissions</b></span>
                    <div className="setting">
                        <span className="name">GPS:</span>
                        <button>Erlauben</button>
                    </div>
                    <div className="setting">
                        <span className="name">Kamera:</span>
                        <span className="allowed">✓ Erlaubt</span>
                    </div>
                    <div className="setting">
                        <span className="name">Audio:</span>
                        <span className="allowed">✓ Erlaubt</span>
                    </div>
                    <div className="setting">
                        <span className="name">Dateien:</span>
                        <button>Erlauben</button>
                    </div>
                </div>
            }
        </>
    );
};

export default Settings;