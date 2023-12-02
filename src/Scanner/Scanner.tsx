import React, { useEffect, useRef } from 'react';
import './Scanner.scss';
import QrScanner from 'qr-scanner';

interface ScannerProps {
    scannerOpen: boolean;
    onCloseSearch: () => void;
    onScanResult: (geoPoint: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ scannerOpen, onCloseSearch, onScanResult }) => {
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
            {scannerOpen &&
                <div className='scanner'>
                    <div className="backdrop" />
                    <div className="scanModal">
                        QR Code des Standorts
                        <button className="close" onClick={onCloseSearch}>x</button>
                        <video className="camera" ref={videoElement} />
                    </div>
                </div>
            }
        </>
    );
};

export default Scanner;