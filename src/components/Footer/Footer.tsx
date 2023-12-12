import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faCirclePlus, faGear, faLocationDot, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '../../types/Tab';

interface FooterProps
{
    activeTab: Tab;
    setActiveTab: (value: Tab) => void;
}

function Footer({ activeTab, setActiveTab }: FooterProps)
{
    function isTabActive(tab: Tab): string
    {
        return tab === activeTab
            ? "active"
            : "";
    };

    const footerInfos = [
        { tab: Tab.Explore,     icon: faLocationDot,    text: "Entdecken" },
        { tab: Tab.Scan,        icon: faQrcode,         text: "Scannen" },
        { tab: Tab.Contribute,  icon: faCirclePlus,     text: "Beitragen" },
        { tab: Tab.Settings,    icon: faGear,           text: "Einstellungen" },
        { tab: Tab.Credits,     icon: faBookOpen,       text: "Verweise" }
    ];

    return (
        <div className="footer">
            {footerInfos.map(footerInfo => (
                <button
                    key={footerInfo.tab}
                    className={isTabActive(footerInfo.tab)}
                    onClick={() => setActiveTab(footerInfo.tab)}
                >
                    <div>
                        <FontAwesomeIcon icon={footerInfo.icon} />
                    </div>
                    <span>{footerInfo.text}</span>
                </button>
            ))}
    </div>
    );
};

export default Footer;