import React, { useEffect, useRef } from 'react';
import './Search.scss';
import QrScanner from 'qr-scanner';

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
    onScanResult: (geoPoint: string) => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose, onScanResult }) => {
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
                    <div className="backdrop" />
                    <div className="modal">
                        QR Code des Standorts
                        <button className="close" onClick={onClose}>x</button>
                        <video className="camera" ref={videoElement} />
                    </div>
                </div>
            }
        </>
    );
};

export default Search;