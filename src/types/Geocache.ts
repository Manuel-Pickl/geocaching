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
    iconIndex: number;
  
    /**
     * Constructs a Geocache.
     * @constructor
     */
    constructor(
        name: string,
        latitude: number,
        longitude: number,
        found: boolean = false,
        time: string = "",
        iconIndex: number = Math.floor(Math.random() * 9)
    ) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.found = found;
        this.time = time;
        this.iconIndex = iconIndex;
    }
}