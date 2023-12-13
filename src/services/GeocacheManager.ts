import { Geocache } from '../types/Geocache';
import { Result } from '../types/Result';

export class GeocacheManager
{
    public findGeocache(
        geocacheName: string,
        geocaches: Geocache[],
        setGeocaches: (value: Geocache[]) => void
    ): Result
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        if (!geocache)
        {
            return new Result(false, `Schade! Der Geocache '${geocacheName}' wurde noch nicht versteckt.`);
        }

        if (this.geocacheAlreadyFound(geocacheName, geocaches))
        {
            return new Result(false, `Schade! Den Geocache '${geocacheName}' hast du bereits gefunden.`);
        }

        geocache.found = true;
        geocache.time = new Date().toISOString();
        setGeocaches([...geocaches])
        
        return new Result(true, `Herzlichen Glückwunsch! Du hast den Geocache '${geocacheName}' gefunden.`);
    };

    public hideGeocache(
        geocaches: Geocache[],
        geocacheName: string,
        position: [number, number] | null,
        setGeocaches: (value: Geocache[]) => void,
        found: boolean = false,
        time: string = ""
    ): Result
    {
        if (!position)
        {
            return new Result(true, `Unerwarteter Fehler! Deine Position ist unbekannt.`);
        }

        const geocacheExistsAlready = this.geocacheExists(geocacheName, geocaches);
        if (geocacheExistsAlready)
        {
            return new Result(true, `Halt stopp! Der Geocache '${geocacheName}' existiert bereits.`);
        }

        const newGeocache = new Geocache(
            geocacheName,
            position[0],
            position[1],
            found,
            time
        )

        geocaches.push(newGeocache);
        setGeocaches([...geocaches]);

        return new Result(true, `Super! Du hast den Geocache '${geocacheName}' versteckt.`);
    }

    public getGpxExport(geocaches: Geocache[]): string
    {
        const gpxHeader = 
`<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<gpx version="1.1" creator="Manuel Pickl">`;
    
        const gpxWaypoints = geocaches.map(cache =>
        {
            const gpxTime = cache.time != ""
                ? `<time>${cache.time}</time>
        ` : "";
            const gpxName = `<name>${cache.name}</name>`;
            const gpxDescription = !cache.found ? "" : `
        <desc>gefunden</desc>`;

            return `
    <wpt lat="${cache.latitude}" lon="${cache.longitude}">
        ${gpxTime}${gpxName}${gpxDescription}
    </wpt>`;
        }).join('');
    
        const gpxFooter = `
</gpx>`;
        
        const gpxData = 
            gpxHeader +
            gpxWaypoints +
            gpxFooter;

        return gpxData;
    }

    public getGeocacheByName(geocacheName: string, geocaches: Geocache[]): Geocache | undefined
    {
        const geocache: Geocache | undefined = geocaches
            .find(geocache => geocache.name === geocacheName);
        
        return geocache;
    }

    public geocacheExists(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = this.getGeocacheByName(geocacheName, geocaches);
        const geocacheExists: boolean = geocache != undefined;

        return geocacheExists;
    }

    private geocacheAlreadyFound(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        const geocacheAlreadyFound = geocache?.found ?? false;

        return geocacheAlreadyFound;
    }
}