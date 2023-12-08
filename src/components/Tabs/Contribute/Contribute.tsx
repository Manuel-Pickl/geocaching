import React, { useState } from 'react';
import './Contribute.scss';
import QRCode from 'qrcode.react';
import { GeoPointManager } from '../../../services/GeoPointManager';
import { GeoPoint } from '../../../types/GeoPoint';
import { sendPushMessage } from '../../../services/NotificationManager';

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
        sendPushMessage(message);

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
                <div className='tab'>
                    <label>
                        Geocache Name:
                        <input
                            type='text'
                            value={geocacheName}
                            onChange={(e) => setGeocacheName(e.target.value)}
                            maxLength={geocacheMaxLength}
                        />
                    </label>
                    <button
                        onClick={onContribute}
                        disabled={contributeIsDisabled()}
                    >
                        Contribute
                    </button>
                    {qrCodeValue != "" &&
                        <>
                            {qrCodeValue}
                            <QRCode value={qrCodeValue} id="qr-code" />
                            <button onClick={onDownloadClick}>
                                Download QR Code
                            </button>
                        </>
                    }
                </div>
            )}
        </>
    );
};

export default Contribute;
