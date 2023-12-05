import React from 'react';
import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCirclePlus, faGear, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '../Tabs';

interface FooterProps {
    setActiveTab: (value: Tab) => void
}

const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {    
    return (
        <div className="footer">
            <button className="active"
                onClick={() => setActiveTab(Tab.Explore)}
            >
                <div>
                    <FontAwesomeIcon icon={faLocationDot}/>
                </div>
                <span>Entdecken</span>
            </button>
            <button
                onClick={() => setActiveTab(Tab.Scan)}
            >
                <div>
                    <FontAwesomeIcon icon={faQrcode}/>
                </div>
                <span>Scannen</span>
            </button>
            <button
                onClick={() => setActiveTab(Tab.Contribute)}
            >
                <div>
                    <FontAwesomeIcon icon={faCirclePlus}/>
                </div>
                <span>Beitragen</span>
            </button>
            <button
                onClick={() => setActiveTab(Tab.Settings)}
            >
                <div>
                    <FontAwesomeIcon icon={faGear}/>
                </div>
                <span>Einstellungen</span>
            </button>
            <button
                onClick={() => setActiveTab(Tab.Credits)}
            >
                <div>
                    <FontAwesomeIcon icon={faBookOpen}/>
                </div>
                <span>Verweise</span>
            </button>
        </div>
    );
};

export default Footer;