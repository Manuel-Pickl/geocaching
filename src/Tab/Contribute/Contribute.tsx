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
        console.log(geocacheName)
        setQRCodeValue(geocacheName);
    }

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
                        <QRCode value={qrCodeValue} />
                    }
                </div>
            )}
        </>
    );
};

export default Contribute;
