import { Geocache } from '../types/Geocache';
import { Result } from '../types/Result';

/**
 * Manages a handling with Geocaches.
 */
export class GeocacheManager
{
    /**
     * Gets triggered, when a Geocache is found and scanned. Trys to add the found Geocache.
     * 
     * @param geocacheName - Name of the Geocache.
     * @param geocaches - All Geocaches of the app, found and hidden.
     * @param setGeocaches - Callback function for setting the Geocaches.
     * @returns - Result, holding information about find-operation success and the result message.
     */
    public static findGeocache(
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

    /**
     * Gets triggered, when a Geocache is hidden and scanned. Trys to add the hidden Geocache.
     *
     * @param geocaches - All Geocaches of the app, found and hidden.
     * @param geocacheName - Name of the Geocache.
     * @param position - Position of the Geocache.
     * @param setGeocaches - Callback function for setting the Geocaches.
     * @returns - Result object, holding information about find-operation success and the result message. 
     */
    public static hideGeocache(
        geocaches: Geocache[],
        geocacheName: string,
        position: [number, number] | null,
        setGeocaches: (value: Geocache[]) => void,
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

        const latitude: number = position[0];
        const longitude: number = position[1];
        const newGeocache = new Geocache(geocacheName, latitude, longitude)

        geocaches.push(newGeocache);
        setGeocaches([...geocaches]);

        return new Result(true, `Super! Du hast den Geocache '${geocacheName}' versteckt.`);
    }

    /**
     * Generates GPX data based on the given Geocaches.
     * 
     * @param geocaches - All Geocaches of the app, found and hidden.
     * @returns - GPX data as string.
     */
    public static getGpxExport(geocaches: Geocache[]): string
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

    /**
     * Returns the Geocache with the given name.
     * 
     * @param geocacheName - Name of the Geocache.
     * @param geocaches - All Geocaches of the app, found and hidden.
     * @returns - The Geocache with the corresponding name.
     */
    public static getGeocacheByName(geocacheName: string, geocaches: Geocache[]): Geocache | undefined
    {
        const geocache: Geocache | undefined = geocaches
            .find(geocache => geocache.name === geocacheName);
        
        return geocache;
    }

    /**
     * Checks if the Geocache with the given name exists.
     * 
     * @param geocacheName - Name of the Geocache.
     * @param geocaches - All Geocaches of the app, found and hidden.
     * @returns - true if the Geocache exists, false if it doesn't.
     */
    public static geocacheExists(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = this.getGeocacheByName(geocacheName, geocaches);
        const geocacheExists: boolean = geocache != undefined;

        return geocacheExists;
    }

    /**
     * Checks if the Geocache with the given name was already found.
     * 
     * @param geocacheName - Name of the Geocache.
     * @param geocaches - All Geocaches of the app, found and hidden. 
     * @returns - true if the Geocache was already found, false if it doesn't.
     */
    private static geocacheAlreadyFound(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        const geocacheAlreadyFound = geocache?.found ?? false;

        return geocacheAlreadyFound;
    }
}