import React, { useState } from 'react';
import './Contribute.scss';
import QRCode from 'qrcode.react';

interface ContributeProps {
    isOpen: boolean;
    onContribute: (geoPointName: string) => void;
}

const Contribute: React.FC<ContributeProps> = ({ isOpen, onContribute }) => {
    const geocacheMaxLength: number = 15
    const [geocacheName, setGeocacheName] = useState<string>("");
    const [qrCodeValue, setQRCodeValue] = useState<string>("");

    const onContributeClick = () => {
        onContribute(geocacheName);
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
        a.download = 'qrcode.jpg';
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
                        onClick={onContributeClick}
                        disabled={geocacheName.trim().length === 0}
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
