import React from 'react';
import './Home.scss';
import LeafletMap from './LeafletMap/LeafletMap';
import userPosition from '../locationFetcher';
import { GeoPoint } from '../GeoPoint';

interface HomeProps {
    geoPoints: GeoPoint[];
    onSearchOpen: () => void;
    onSettingsOpen: () => void;
    debug: boolean;
    direction: [number, number];
}

const Home: React.FC<HomeProps> = ({
    geoPoints,
    onSearchOpen,
    onSettingsOpen,
    debug,
    direction
}) => {
    // LGS-Gelände
    const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
    
    return (
        <div className="home">
            <LeafletMap
                position={mapCenter}
                userPosition={userPosition(debug, direction)}
                geoPoints={geoPoints}
            />
            <div className="buttons">
                <button className="search" onClick={onSearchOpen}>
                    Scannen
                </button>
                <button className="hide" onClick={onSettingsOpen}>
                    H
                </button>
                <button className="settings" onClick={onSettingsOpen}>
                    S
                </button>
            </div>
        </div>
    );
};

export default Home;