import './Hide.scss';
import "../tabs.scss";
import Scan from '../../Scan/Scan';

interface HideProps
{
    isOpen: boolean;
    onGeocacheHidden: (geocacheName: string) => void;
}

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