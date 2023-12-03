import React from 'react';
import './Home.scss';
import LeafletMap from './LeafletMap/LeafletMap';
import userPosition from '../locationFetcher';
import { GeoPoint } from '../GeoPoint';

interface HomeProps {
    geoPoints: GeoPoint[];
    onSearchOpen: () => void;
    // onHideOpen: () => void;
}

const Home: React.FC<HomeProps> = ({ geoPoints, onSearchOpen }) => {
    // LGS-Gelände
    const mapCenter: [number, number] = [49.43306480206603, 11.86834899582829];
    
    return (
        <>
            <LeafletMap
                position={mapCenter}
                userPosition={userPosition()}
                geoPoints={geoPoints}
            />
            <div className="buttons">
                <button className="scan" onClick={onSearchOpen}>
                    Scannen
                </button>
                <button className="create"
                    // onClick={onHide}
                >
                    Verstecken
                </button>
            </div>
        </>
    );
};

export default Home;