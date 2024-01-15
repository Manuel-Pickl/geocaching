import Switch from 'react-switch';
import './Settings.scss';
import "../tabs.scss";
import { Geocache } from '../../../types/Geocache';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { GeocacheManager } from '../../../services/GeocacheManager';
import { TimeManager } from '../../../services/TimeManager';
import { useRef } from 'react';
import { Result } from '../../../types/Result';
import { toast } from 'react-toastify';

/**
 * Props for the Settings component.
 */
interface SettingsProps
{
    isOpen: boolean;
    geocaches: Geocache[];
    setGeocaches: (value: Geocache[]) => void;
    radius: number; setRadius: (value: number) => void;
    voiceIsOn: boolean; setVoiceIsOn: (value: boolean) => void;
    debug: boolean; setDebug: (value: boolean) => void;
}

/**
 * Component for the 'Settings' tab in the application.
 * Allows users to view and export found and unfound geocaches, and adjust application settings.
 *
 * @param props - Props for the Settings component.
 * @component
 */
function Settings({ isOpen, geocaches, setGeocaches, radius, setRadius, voiceIsOn, setVoiceIsOn, debug, setDebug }: SettingsProps)
{
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Import a GPX file with Geocaches.
     */
    async function importGpx(e: any )
    {
        const gpxFile = e.target.files[0];
        e.target.value = "";

        if (!gpxFile)
        {
            return;
        }

        const fileReader: FileReader = new FileReader();
        fileReader.onload = async (e) =>
        {
            const gpxContent: string = e.target?.result as string;
            const importGpxResult: Result = await GeocacheManager.importGpx(gpxContent, setGeocaches);
            toast(importGpxResult.message);
        };
        fileReader.readAsText(gpxFile);
    };

    /**
     * Exports the found geocaches as a GPX file.
     */
    function exportGpx(): void
    {
        const gpxExport = GeocacheManager.getGpxExport(geocaches);

        const a = document.createElement('a');
        a.href = `data:application/gpx+xml,${encodeURIComponent(gpxExport)}`;
        a.download = 'geocaches.gpx';
        
        a.click();
    };

    return isOpen ? (
        <div className="tab settings">
            <h2>Einstellungen</h2>

            <h3>Geocaches</h3>

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

            <div className="buttons">
                <button onClick={() => fileInputRef.current?.click()}>
                    <span>Importieren </span>
                    <FontAwesomeIcon icon={faUpload} />
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept=".gpx" 
                        onChange={importGpx} 
                        style={{ display: 'none' }} 
                    />
                </button>
                    
                <button onClick={exportGpx}>
                    <span>Exportieren </span>
                    <FontAwesomeIcon icon={faDownload} />
                </button>
            </div>

            <hr/>
            <h3>Optionen</h3>

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

                <span>{radius}m</span>
            </div>

            <div className="setting">
                <span className="name">Stimme:</span>

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
    ) : null;
};

export default Settings;