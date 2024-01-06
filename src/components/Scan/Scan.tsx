import { useEffect, useRef } from 'react';
import './Scan.scss';
import QrScanner from 'qr-scanner';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Props for the Scan component.
 */
interface ScanProps
{
    onScanResult: (geocacheName: string) => void;
}

/**
 * Component for scanning QR codes.
 *
 * @param props - Props for the Scan component.
 * @component
 */
function Scan({ onScanResult }: ScanProps)
{
    const videoElement = useRef(null);
    
    /**
     * useEffect hook to handle the lifecycle of the QR scanner.
     */
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
            }, {}
        );

        qrScanner.start();

        return () =>
        {
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, [onScanResult]);

    return (
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
    );
};

export default Scan;