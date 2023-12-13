import './Hide.scss';
import "../tabs.scss";
import { GeocacheManager } from '../../../services/GeocacheManager';
import { Geocache } from '../../../types/Geocache';
import { Tab } from '../../../types/Tab';
import { toast } from 'react-toastify';
import Scan from '../../Scan/Scan';

interface HideProps
{
    isOpen: boolean;
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (value: Geocache[]) => void;
    userPosition: [number, number] | null;
    setActiveTab: (value: Tab) => void;
}

function Hide({ isOpen, geocacheManager, geocaches, setGeocaches, userPosition, setActiveTab }: HideProps)
{
    function onScanResult(geocacheName: string): void
    {
        setActiveTab(Tab.Explore);
    
        const result: boolean = geocacheManager.addGeocache(geocaches, geocacheName, userPosition);
        const message: string = result
            ? `Super! Du hast den Geocache '${geocacheName}' versteckt.`
            : `Halt stopp! Der Geocache '${geocacheName}' existiert bereits.`;
        toast(message);
        
        setGeocaches([...geocaches])
    }
    
    return (
        <>
            {isOpen &&
                <div className='tab find'>
                    <p>
                        Trage zum Netzwerk bei!<br/>
                        Scanne einen QR Code, um den Geocache zu verstecken.
                    </p>
                    <Scan
                        onScanResult={onScanResult}/>
                </div>
            }
        </>
    );
};

export default Hide;