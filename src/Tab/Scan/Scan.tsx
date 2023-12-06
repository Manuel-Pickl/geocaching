import React, { useEffect, useRef } from 'react';
import './Scan.scss';
import QrScanner from 'qr-scanner';
import { Tab } from '../../Tabs';
import { GeoPoint } from '../../GeoPoint';
import { GeoPointManager } from '../../GeoPointManager';

interface ScanProps {
    isOpen: boolean;
    geoPointManager: GeoPointManager;
    geoPoints: GeoPoint[];
    setGeoPoints: (value: GeoPoint[]) => void;
    setActiveTab: (value: Tab) => void;
}

const Scan: React.FC<ScanProps> = ({ isOpen, geoPointManager, geoPoints, setGeoPoints, setActiveTab }) => {
    const videoElement = useRef(null);

    const onScanResult = (geoPointName: string) => {
        setActiveTab(Tab.Explore);
    
        const result: boolean = geoPointManager.onGeoPointFound(geoPointName, geoPoints);
        const message: string = result
        ? `Herzlichen Glückwunsch! Du hast den Standort ${geoPointName} gefunden.`
        : `Schade! Den Standort ${geoPointName} hast du bereits gefunden.`;
        console.log(message);

        setGeoPoints([...geoPoints])
    }
    
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