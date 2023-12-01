import React, { useEffect, useState } from 'react';
import './Home.css';
import LeafletMap from '../LeafletMap/LeafletMap';
import Dropdown from '../Dropdown/Dropdown';
import { GeoPoint } from '../GeoPoint';
import userPosition from '../locationFetcher';

interface HomeProps {
    onScan: () => void;
    onHide: () => void;
}

const Home: React.FC<HomeProps> = ({ onScan, onHide }) => {
    // LGS-Gelände
    const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
    const [geoPoints, setGeoPoints] = useState<GeoPoint[]>([]);

    const geoPointFound = (geoPoint: GeoPoint) => {
    geoPoint.found = !geoPoint.found;

    GeoPoint.serializeGeoPoints(geoPoints);
    setGeoPoints([...geoPoints])
    };

    useEffect(() => {
        setGeoPoints(GeoPoint.getGeoPoints());
    }, []);
    
    return (
        <>
            <Dropdown
                geoPoints={geoPoints}
                onSelectChange={geoPointFound}
            />
            <LeafletMap
                position={mapCenter}
                userPosition={userPosition()}
                geoPoints={geoPoints}
            />
            <div className="buttons">
                <button className="scan" onClick={onScan}>
                    Scannen
                </button>
                <button className="create" onClick={onHide}>
                    Verstecken
                </button>
            </div>
        </>
    );
};

export default Home;