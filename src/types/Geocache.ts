/**
 * Represents a Geocache.
 * It holds information about its name, coordinates, and the time it was found.
 */
export class Geocache
{
    name: string;
    latitude: number;
    longitude: number;
    found: boolean;
    time: string;
  
    /**
     * Constructs a Geocache.
     * @constructor
     */
    constructor(name: string, latitude: number, longitude: number, found: boolean = false, time: string = "")
    {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.found = found;
        this.time = time;
    }
}