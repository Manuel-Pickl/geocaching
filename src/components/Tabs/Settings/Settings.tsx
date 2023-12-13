import Switch from 'react-switch';
import './Settings.scss';
import "../tabs.scss";
import { Geocache } from '../../../types/Geocache';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { GeocacheManager } from '../../../services/GeocacheManager';
import { TimeManager } from '../../../services/TimeManager';

interface SettingsProps
{
    isOpen: boolean;
    geocaches: Geocache[];
    radius: number; setRadius: (value: number) => void;
    voiceIsOn: boolean; setVoiceIsOn: (value: boolean) => void;
    debug: boolean; setDebug: (value: boolean) => void;
}

function Settings({ isOpen, geocaches, radius, setRadius, voiceIsOn, setVoiceIsOn, debug, setDebug }: SettingsProps)
{
    function exportGeocaches(): void
    {
        const gpxExport = GeocacheManager.getGpxExport(geocaches);

        const a = document.createElement('a');
        a.href = `data:application/gpx+xml,${encodeURIComponent(gpxExport)}`;
        a.download = 'geocaches.gpx';
        
        a.click();
    };

    return (
        <>
            {isOpen &&
                <div className="tab settings">
                    <span><b>Geocaches</b></span>
                    <ul>
                        {geocaches
                            .filter(geocache => geocache.found)
                            .map((geocache, index) => (
                            <li key={index} className="found">
                                <div>✓</div>
                                <div className="name">{geocache.name}</div>
                                <div>{TimeManager.isoToLocal(geocache.time)}</div>
                            </li>
                        ))}
                        {geocaches
                            .filter(geocache => !geocache.found)
                            .map((geocache, index) => (
                            <li key={index}>
                                <div>✗</div>
                                <div className="name">{geocache.name}</div>
                                <div>{TimeManager.isoToLocal(geocache.time)}</div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={exportGeocaches}>
                        <span>Geocaches as .gpx </span>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                    
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
                </div>
            }
        </>
    );
};

export default Settings;