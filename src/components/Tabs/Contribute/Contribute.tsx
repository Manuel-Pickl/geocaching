import { useState } from 'react';
import './Contribute.scss';
import "../tabs.scss";
import QRCode from 'qrcode.react';
import { GeocacheManager } from '../../../services/GeocacheManager';
import { Geocache } from '../../../types/Geocache';
import { toast } from 'react-toastify';
import { faDownload, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ContributeProps
{
    isOpen: boolean;
    geocacheManager: GeocacheManager;
    geocaches: Geocache[];
    setGeocaches: (value: Geocache[]) => void;
    userPosition: [number, number] | null;
}

function Contribute({ isOpen, geocacheManager, geocaches, setGeocaches, userPosition }: ContributeProps)
{
    const geocacheMaxLength: number = 15
    const [geocacheName, setGeocacheName] = useState<string>("");
    const [qrCodeValue, setQRCodeValue] = useState<string>("");

    function contributeIsDisabled(): boolean
    {
        const nameIsEmpty: boolean = geocacheName.trim().length === 0;
        const nameIsAlreadyTaken: boolean = geocacheManager.geocacheExists(geocacheName, geocaches);

        return nameIsEmpty || nameIsAlreadyTaken;
    }

    function onContribute()
    {
        const geocacheExists: boolean = geocacheManager.geocacheExists(geocacheName, geocaches);
        const message: string = geocacheExists
            ? `Halt stopp! Der Geocache ${geocacheName} existiert bereits.`
            : `Super! Du hast den Geocache ${geocacheName} angelegt.`;
        toast(message);

        if (geocacheExists)
        {
            return;
        }

        geocacheManager.addGeocache(geocaches, geocacheName, userPosition);
        setGeocaches([...geocaches]);

        setQRCodeValue(geocacheName);
    }

    function onDownloadClick(): void
    {
        const canvas: HTMLCanvasElement | null = document.getElementById('qr-code') as HTMLCanvasElement | null;
        if (!canvas)
        {
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