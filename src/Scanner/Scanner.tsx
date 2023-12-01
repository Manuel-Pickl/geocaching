import { useEffect, useRef } from 'react';
import './Scanner.css';
import QrScanner from 'qr-scanner';

interface ScannerProps {
    onScanResult: (message: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanResult }) => {
    const camera = useRef(null);

    const back = () => {
        onScanResult("");
    }

    useEffect(() => {
        if (!camera.current) {
            return;
        }

        const qrScanner = new QrScanner(
            camera.current,
            (result) => { onScanResult(result.data); },
            { highlightScanRegion: true }
        );

        qrScanner.start();
    
        return () => {
          qrScanner.stop();
          qrScanner.destroy();
        };
    }, []);

    return (
        <div className='scanner'>
            <button className='back' onClick={back}>{"<"}</button>
            <video className="camera" ref={camera} />
        </div>
    );
}

export default Scanner;