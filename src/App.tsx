import Scanner from './Scanner/Scanner';
import Home from './Home/Home';
import { useState } from 'react';

function App() {
  const [scanning, setScanning] = useState<boolean>(false);

  const onScan = () => {
    setScanning(true);
  }
  
  const onHide = () => {
    console.log("hide");
  }

  const onScanResult = () => {
    setScanning(false);
  }

  return (
    <>
      {!scanning ? (
        <Home
          onScan={onScan}
          onHide={onHide}
        />
      ) : (
        <Scanner
          onScanResult={onScanResult}
        />
      )}
    </>
  );
}

export default App;