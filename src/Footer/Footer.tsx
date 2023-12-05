import React from 'react';
import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faGear, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
    onExploreClick: () => void;
    onScanClick: () => void;
    onContributeClick: () => void;
    onSettingsClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onExploreClick, onScanClick, onContributeClick, onSettingsClick }) => {    
    return (
        <div className="footer">
            <button className="active" onClick={onExploreClick}>
                <div>
                    <FontAwesomeIcon icon={faLocationDot}/>
                </div>
                <span>Entdecken</span>
            </button>
            <button onClick={onScanClick}>
                <div>
                    <FontAwesomeIcon icon={faQrcode}/>
                </div>
                <span>Scannen</span>
            </button>
            <button onClick={onContributeClick}>
                <div>
                    <FontAwesomeIcon icon={faCirclePlus}/>
                </div>
                <span>Beitragen</span>
            </button>
            <button onClick={onSettingsClick}>
                <div>
                    <FontAwesomeIcon icon={faGear}/>
                </div>
                <span>Einstellungen</span>
            </button>
            <button>
                <div>
                    <FontAwesomeIcon icon={faGear}/>
                </div>
                <span>Verweise</span>
            </button>
        </div>
    );
};

export default Footer;