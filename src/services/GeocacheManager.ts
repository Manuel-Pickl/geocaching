import { Geocache } from '../types/Geocache';
import geocachesJson from '../assets/geocaches.json';

export class GeocacheManager
{
    public getDefaultGeocaches(): Geocache[]
    {
        const defaultGeocaches: Geocache[] = geocachesJson.map((geocacheJson: Geocache) =>
        {
            return new Geocache(
                geocacheJson.name,
                geocacheJson.latitude,
                geocacheJson.longitude,
                geocacheJson.found,
                geocacheJson.time,
                geocacheJson.isDefault
            );
        });

        return defaultGeocaches;
    }

    public onGeocacheFound(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        if (!geocache)
        {
            return false;
        }

        if (this.geocacheAlreadyFound(geocacheName, geocaches))
        {
            return false;
        }

        geocache.found = true;
        geocache.time = new Date().toLocaleDateString('de-DE');

        return true;
    };

    public addGeocache(
        geocaches: Geocache[],
        geocacheName: string,
        position: [number, number] | null,
        found: boolean = false,
        time: string = ""): boolean
    {
        if (!position)
        {
            return false;
        }

        const geocacheExistsAlready = this.geocacheExists(geocacheName, geocaches);
        if (geocacheExistsAlready)
        {
            return false;
        }

        const newGeocache = new Geocache(
            geocacheName,
            position[0],
            position[1],
            found,
            time,
            false
        )
        geocaches.push(newGeocache);

        return true;
    }

    private geocacheExists(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        const geocacheExists: boolean = geocache != undefined;

        return geocacheExists;
    }

    private geocacheAlreadyFound(geocacheName: string, geocaches: Geocache[]): boolean
    {
        const geocache: Geocache | undefined = geocaches.find(geocache => geocache.name == geocacheName);
        if (!geocache)
        {
            return false;
        }

        return geocache.found
    }
}