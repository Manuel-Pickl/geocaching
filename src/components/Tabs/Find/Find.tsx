import './Find.scss';
import "../tabs.scss";
import Scan from '../../Scan/Scan';

/**
 * Props for the Find component.
 */
interface FindProps
{
    isOpen: boolean;
    onGeocacheFound: (geocacheName: string) => void;
}

/**
 * Component for the 'Find' tab in the application. 
 * It displays instructions for finding geocaches and includes a scanner for QR codes.
 *
 * @param props - Props for the Find component.
 * @component
 */
function Find({ isOpen, onGeocacheFound }: FindProps)
{
    return isOpen ? (
        <div className='tab find'>
            <h2>Finden</h2>

            <p>
                Du hast einen Geocache gefunden?<br/>
                Scanne den QR-Code ein, um ihn zu speichern.
            </p>
            
            <Scan
                onScanResult={onGeocacheFound}
            />
        </div>
    ) : null;
};

export default Find;