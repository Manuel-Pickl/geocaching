import './Find.scss';
import "../tabs.scss";
import Scan from '../../Scan/Scan';

interface FindProps
{
    isOpen: boolean;
    onGeocacheFound: (geocacheName: string) => void;
}

function Find({ isOpen, onGeocacheFound }: FindProps)
{
    return (
        <>
            {isOpen &&
                <div className='tab find'>
                    <p>
                        Du hast einen Geocache gefunden?<br/>
                        Scanne den QR-Code ein, um ihn zu speichern.
                    </p>
                    <Scan
                        onScanResult={onGeocacheFound}/>
                </div>
            }
        </>
    );
};

export default Find;