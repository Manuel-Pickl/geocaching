import React, { useState } from 'react';
import './Contribute.scss';
import "../tabs.scss";
import QRCode from 'qrcode.react';
import { GeoPointManager } from '../../../services/GeoPointManager';
import { GeoPoint } from '../../../types/GeoPoint';
import { toast } from 'react-toastify';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ContributeProps {
    isOpen: boolean;
    geoPointManager: GeoPointManager;
    geoPoints: GeoPoint[];
    setGeoPoints: (value: GeoPoint[]) => void;
    userPosition: [number, number] | null;
}

const Contribute: React.FC<ContributeProps> = ({ isOpen, geoPointManager, geoPoints, setGeoPoints, userPosition }) => {
    const geocacheMaxLength: number = 15
    const [geocacheName, setGeocacheName] = useState<string>("");
    const [qrCodeValue, setQRCodeValue] = useState<string>("");

    const contributeIsDisabled = (): boolean => {
        const nameIsEmpty: boolean = geocacheName.trim().length === 0;
        const nameIsAlreadyTaken: boolean = geoPointManager.geoPointExists(geocacheName, geoPoints);

        return nameIsEmpty || nameIsAlreadyTaken;
    }

    const onContribute = () => {
        const geoPointExists: boolean = geoPointManager.geoPointExists(geocacheName, geoPoints);
        const message: string = geoPointExists
            ? `Halt stopp! Der Geocache ${geocacheName} existiert bereits.`
            : `Super! Du hast den Geocache ${geocacheName} angelegt.`;
        toast(message);

        if (geoPointExists) {
            return;
        }

        geoPointManager.addGeoPoint(geoPoints, geocacheName, userPosition);
        setGeoPoints([...geoPoints]);

        setQRCodeValue(geocacheName);
    }

    const onDownloadClick = () => {
        const canvas: HTMLCanvasElement | null = document.getElementById('qr-code') as HTMLCanvasElement | null;
        if (!canvas) {
            return;
        }

        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.href = url;
        a.download = 'qrcode';
        a.click();
    };

    return (
        <>
            {isOpen && (
                <div className='tab contribute'>
                    <p>
                        Trage zum Netzwerk bei!<br/>
                        Erstelle einen Geocache und hänge den QR Code aus.
                    </p>
                    <div className="variables">
                        <span>Geocache:</span>
                        <input
                            type='text'
                            value={geocacheName}
                            onChange={(e) => setGeocacheName(e.target.value)}
                            maxLength={geocacheMaxLength}
                        />
                        <button
                            onClick={onContribute}
                            disabled={contributeIsDisabled()}
                        >
                            <FontAwesomeIcon icon={faUpload} />
                        </button>
                    </div>
                    {qrCodeValue != "" &&
                        <div className="code">
                            <QRCode value={qrCodeValue} id="qr-code" />
                            {qrCodeValue}
                            <button onClick={onDownloadClick}>
                                <span>Download </span>
                                <FontAwesomeIcon icon={faDownload} />
                            </button>
                        </div>
                    }
                </div>
            )}
        </>
    );
};

export default Contribute;
