import { useEffect, useRef } from 'react';
import './Scan.scss';
import "../tabs.scss";
import QrScanner from 'qr-scanner';
import { GeocacheManager } from '../../../services/GeocacheManager';
import { Geocache } from '../../../types/Geocache';
import { Tab } from '../../../types/Tab';
import { toast } from 'react-toastify';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ScanProps
{
    isOpen: boolean;
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (value: Geocache[]) => void;
    setActiveTab: (value: Tab) => void;
}

function Scan({ isOpen, geocacheManager, geocaches, setGeocaches, setActiveTab }: ScanProps)
{
    const videoElement = useRef(null);

    function onScanResult(geocacheName: string): void
    {
        setActiveTab(Tab.Explore);
    
        const result: boolean = geocacheManager.onGeocacheFound(geocacheName, geocaches);
        const message: string = result
        ? `Herzlichen Glückwunsch! Du hast den Geocache ${geocacheName} gefunden.`
        : `Schade! Den Geocache ${geocacheName} hast du bereits gefunden.`;
        toast(message);
        
        setGeocaches([...geocaches])
    }
    
    useEffect(() =>
    {
        if (!videoElement.current)
        {
            return;
        }

        const qrScanner = new QrScanner(
            videoElement.current,
            (result) =>
            {
                onScanResult(result.data);
            },
            {}
        );

        qrScanner.start();

        return () =>
        {
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, [onScanResult]);

    return (
        <>
            {isOpen &&
                <div className='tab scan'>
                    <p>
                        Du hast einen Geocache gefunden?<br/>
                        Scanne ihn ein, um den Punkt zu speichern.
                    </p>
                    <div className="camera">
                        <video className="camera" ref={videoElement} />
                        <div className="scanRegion">
                            <div className="top left"></div>
                            <div className="top right"></div>
                            <div className="bottom right"></div>
                            <div className="bottom left"></div>
                        </div>
                        <FontAwesomeIcon icon={faCamera} />
                    </div>
                </div>
            }
        </>
    );
};

export default Scan;