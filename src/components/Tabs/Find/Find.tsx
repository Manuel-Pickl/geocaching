import './Find.scss';
import "../tabs.scss";
import { GeocacheManager } from '../../../services/GeocacheManager';
import { Geocache } from '../../../types/Geocache';
import { Tab } from '../../../types/Tab';
import { toast } from 'react-toastify';
import Scan from '../../Scan/Scan';

interface FindProps
{
    isOpen: boolean;
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (value: Geocache[]) => void;
    setActiveTab: (value: Tab) => void;
}

function Find({ isOpen, geocacheManager, geocaches, setGeocaches, setActiveTab }: FindProps)
{
    function onScanResult(geocacheName: string): void
    {
        const successfullyFound: boolean = geocacheManager.findGeocache(geocacheName, geocaches, setGeocaches);
        
        const message: string = successfullyFound
        ? `Herzlichen Glückwunsch! Du hast den Geocache '${geocacheName}' gefunden.`
        : `Schade! Den Geocache '${geocacheName}' hast du bereits gefunden.`;
        toast(message);
        
        setActiveTab(Tab.Explore);
    }
    
    return (
        <>
            {isOpen &&
                <div className='tab find'>
                    <p>
                        Du hast einen Geocache gefunden?<br/>
                        Scanne den QR-Code ein, um ihn zu speichern.
                    </p>
                    <Scan
                        onScanResult={onScanResult}/>
                </div>
            }
        </>
    );
};

export default Find;