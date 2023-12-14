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
        { name: "Sass", url: "https://sass-lang.com/" },
    ];
    
    const libraries = [
        { name: "Leaflet", url: "https://leafletjs.com/" },
        { name: "qr-scanner", url: "https://www.npmjs.com/package/qr-scanner" },
        { name: "fontawesome", url: "https://fontawesome.com/" },
        { name: "geolib", url: "https://deltares.github.io/GEOLib/latest/index.html" },
    ]
    
    const sources = [
        { name: "React Learn", url: "https://react.dev/learn" },
        { name: "Leaflet Docs", url: "https://leafletjs.com/reference.html" },
        { name: "SVG Repo", url: "https://www.svgrepo.com/" },
    ]

    const creditsData = [
        { category: "Technologies", entries: technologies },
        { category: "Libraries", entries: libraries },
        { category: "Sources", entries: sources },
      ];

    return isOpen ? (
        <div className="tab credits">
            <h2>Credits</h2>
            {creditsData.map((credit, index) => (
            <div key={index}>
                <h3>{credit.category}</h3>
                <ul>
                    {credit.entries.map((entry, entryIndex) => (
                    <a key={entryIndex} href={entry.url} target="_blank">
                        <div className="icon">
                            <img src={`credits/${credit.category.toLowerCase()}/${entry.name}.png`} alt={entry.name} />
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