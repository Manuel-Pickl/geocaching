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
        setActiveTab(Tab.Explore);
    
        const result: boolean = geocacheManager.onGeocacheFound(geocacheName, geocaches);
        const message: string = result
            ? `Herzlichen Glückwunsch! Du hast den Geocache '${geocacheName}' gefunden.`
            : `Schade! Den Geocache '${geocacheName}' hast du bereits gefunden.`;
        toast(message);
        
        setGeocaches([...geocaches])
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