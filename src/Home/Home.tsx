import React, { useEffect, useState } from 'react';
import './Home.css';
import LeafletMap from '../LeafletMap/LeafletMap';
import Dropdown from '../Dropdown/Dropdown';
import { GeoPoint } from '../GeoPoint';
import userPosition from '../locationFetcher';

interface HomeProps {
    geoPoints: GeoPoint[];
    geoPointFound: (geoPointName: string) => void;
    onScan: () => void;
    onHide: () => void;
}

const Home: React.FC<HomeProps> = ({ geoPoints, geoPointFound, onScan, onHide }) => {
    // LGS-Gelände
    const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
    
    return (
        <>
            <Dropdown
                geoPoints={geoPoints}
                onSelectionChanged={geoPointFound}
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