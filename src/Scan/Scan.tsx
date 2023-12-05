import React, { useEffect, useRef } from 'react';
import './Scan.scss';
import QrScanner from 'qr-scanner';

interface ScanProps {
    isOpen: boolean;
    onScanResult: (geoPoint: string) => void;
}

const Scan: React.FC<ScanProps> = ({ isOpen, onScanResult }) => {
    const videoElement = useRef(null);

    useEffect(() => {
        if (!videoElement.current) {
            return;
        }

        const qrScanner = new QrScanner(
            videoElement.current,
            (result) => {
                onScanResult(result.data);
            },
            { highlightScanRegion: true }
        );

        qrScanner.start();

        return () => {
            qrScanner.stop();
            qrScanner.destroy();
        };
    }, [onScanResult]);

    return (
        <>
            {isOpen &&
                <div className='tab'>
                    QR Code des Standorts
                    <video className="camera" ref={videoElement} />
                </div>
            }
        </>
    );
};

export default Scan;