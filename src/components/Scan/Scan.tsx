import { useEffect, useRef } from 'react';
import './Scan.scss';
import QrScanner from 'qr-scanner';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ScanProps
{
    onScanResult: (geocacheName: string) => void;
}

function Scan({ onScanResult }: ScanProps)
{
    const videoElement = useRef(null);
    
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