import './Scanner.css';
import { QrReader } from 'react-qr-reader';

interface ScannerProps {
    onScanResult: (message: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanResult }) => {
    const handleScan = (qrData: any) => {
        if (qrData) {
            onScanResult(qrData.text);
        };
    }

    const back = () => {
        onScanResult("");
    }

    return (
        <div className='scanner'>
            <button className='back' onClick={back}>{"<"}</button>
            <QrReader
                onResult={handleScan}
                className='camera'
                constraints={{}}
            />
        </div>
    );
}

export default Scanner;