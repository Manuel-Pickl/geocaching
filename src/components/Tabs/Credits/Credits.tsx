import './Credits.scss';
import "../tabs.scss";

interface CreditsProps
{
    isOpen: boolean;
}

function Credits({ isOpen }: CreditsProps)
{
    const technologies = [
        { name: "React",   url: "https://react.dev/" },
        { name: "Vite", url: "https://vitejs.dev/" },
        { name: "Typescript", url: "https://www.typescriptlang.org/" },
        { name: "Sass", url: "https://sass-lang.com/" }
    ];
    
    const libraries = [
        { name: "Leaflet", url: "https://leafletjs.com/" },
        { name: "qr-scanner", url: "https://www.npmjs.com/package/qr-scanner" },
        { name: "geolib", url: "https://deltares.github.io/GEOLib/latest/index.html" },
        { name: "fontawesome", url: "https://fontawesome.com/" }
    ]
    
    const sources = [
        { name: "SVG Repo", url: "https://www.svgrepo.com/" },
        { name: "React Learn", url: "https://react.dev/learn" },
        { name: "Leaflet Docs", url: "https://leafletjs.com/reference.html" } 
    ]

    return (
        <>
            {isOpen &&
                <div className="tab credits">
                    Credits
                    
                    <div>
                        Technologien
                        <ul>
                        {technologies.map((technology, index) => (
                            <a key={index} href={technology.url} target="_blank">
                                <div className="icon">
                                    <img src={`credits/technologies/${technology.name}.png`} alt={technology.name} />
                                </div>
                                <span>{technology.name}</span>
                            </a>
                        ))}
                        </ul>
                    </div>

                    <div>
                        Bibliotheken
                        <ul>
                        {libraries.map((library, index) => (
                            <a key={index} href={library.url} target="_blank">
                                <div className="icon">
                                    <img src={`credits/libraries/${library.name}.png`} alt={library.name} />
                                </div>
                                <span>{library.name}</span>
                            </a>
                        ))}
                        </ul>
                    </div>

                    <div>
                        Quellen
                        <ul>
                        {sources.map((source, index) => (
                            <a key={index} href={source.url} target="_blank">
                                <div className="icon">
                                    <img src={`credits/sources/${source.name}.png`} alt={source.name} />
                                </div>
                                <span>{source.name}</span>
                            </a>
                        ))}
                        </ul>
                    </div>
                </div>
            }
        </>
    );
};

export default Credits;