import './Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faEyeSlash, faGear, faLocationDot, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Tab } from '../../types/Tab';

/**
 * Props for the Footer component.
 */
interface FooterProps
{
    activeTab: Tab;
    setActiveTab: (value: Tab) => void;
}

/**
 * Footer component displaying navigation buttons for different tabs.
 *
 * @param props - Props for the Footer component.
 * @component
 */
function Footer({ activeTab, setActiveTab }: FooterProps)
{
    /**
     * Determines the class for a tab based on whether it's active.
     *
     * @param tab - The tab to check.
     * @returns string - 'active' if the tab is active, otherwise an empty string.
     */
    function isTabActive(tab: Tab): string
    {
        return tab === activeTab
            ? "active"
            : "";
    };

    const footerInfos = [
        { tab: Tab.Explore, icon: faLocationDot, text: "Entdecken" },
        { tab: Tab.Find, icon: faMagnifyingGlass, text: "Finden" },
        { tab: Tab.Hide, icon: faEyeSlash, text: "Verstecken" },
        { tab: Tab.Settings, icon: faGear, text: "Einstellungen" },
        { tab: Tab.Credits, icon: faBookOpen, text: "Credits" }
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