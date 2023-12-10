import React, { useEffect, useRef } from 'react';
import './Scan.scss';
import "../tabs.scss";
import QrScanner from 'qr-scanner';
import { GeoPointManager } from '../../../services/GeoPointManager';
import { GeoPoint } from '../../../types/GeoPoint';
import { Tab } from '../../../types/Tab';
import { toast } from 'react-toastify';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        toast(message);
        
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
            {}
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
                <div className='tab scan'>
                    <p>
                        Du hast einen Geocache gefunden?<br/>
                        Scanne ihn ein, um den Punkt zu speichern.
                    </p>
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
                </div>
            }
        </>
    );
};

export default Scan;