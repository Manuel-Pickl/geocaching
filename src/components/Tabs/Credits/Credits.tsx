import './Credits.scss';
import "../tabs.scss";

/**
 * Props for the Credits component.
 */
interface CreditsProps
{
    isOpen: boolean;
}

/**
 * Component to display credits and acknowledgments for technologies, libraries, and sources used in the project.
 *
 * @param props - Props for the Credits component.
 * @component
 */
function Credits({ isOpen }: CreditsProps)
{
    // Array of technologies used in the project
    const technologies = [
        { name: "React",   url: "https://react.dev/" },
        { name: "Vite", url: "https://vitejs.dev/" },
        { name: "Typescript", url: "https://www.typescriptlang.org/" },
        { name: "Sass", url: "https://sass-lang.com/" },
    ];
    
    // Array of libraries used in the project
    const libraries = [
        { name: "Leaflet", url: "https://leafletjs.com/" },
        { name: "qr-scanner", url: "https://www.npmjs.com/package/qr-scanner" },
        { name: "geolib", url: "https://deltares.github.io/GEOLib/latest/index.html" },
    ]
    
    // Array of sources for assets used in the project
    const sources = [
        { name: "fontawesome", url: "https://fontawesome.com/" },
        { name: "SVG Repo", url: "https://www.svgrepo.com/" },
    ]
4   
    // Structured data combining all credits
    const creditsData = [
        { category: "Technologien", entries: technologies, url: "technologies" },
        { category: "Bibliotheken", entries: libraries, url: "libraries" },
        { category: "Quellen", entries: sources, url: "sources" },
      ];

    return isOpen ? (
        <div className="tab credits">
            <h2>Credits</h2>

            {creditsData.map((credit, index) => (
                <div key={index} className="category">
                    <h3>{credit.category}</h3>

                    <ul>
                        {credit.entries.map((entry, entryIndex) => (
                        <a key={entryIndex} href={entry.url} target="_blank">
                            <div className="icon">
                                <img 
                                    src={`credits/${credit.url}/${entry.name}.png`}
                                    alt={entry.name}
                                />
                            </div>

                            <span>{entry.name}</span>
                        </a>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    ) : null;    
};

export default Credits;