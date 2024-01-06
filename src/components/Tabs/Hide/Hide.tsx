import './Hide.scss';
import "../tabs.scss";
import Scan from '../../Scan/Scan';

/**
 * Props for the Hide component.
 */
interface HideProps
{
    isOpen: boolean;
    onGeocacheHidden: (geocacheName: string) => void;
}

/**
 * Component for the 'Hide' tab in the application.
 * It displays instructions for hiding geocaches and includes a scanner for QR codes.
 *
 * @param props - Props for the Hide component.
 * @component
 */
function Hide({ isOpen, onGeocacheHidden }: HideProps)
{
    return isOpen ? (
        <div className='tab find'>
            <h2>Verstecken</h2>

            <p>
                Trage zum Netzwerk bei!<br/>
                Scanne einen QR Code, um den Geocache zu verstecken.
            </p>
            
            <Scan
                onScanResult={onGeocacheHidden}
            />
        </div>
    ) : null;
};

export default Hide;