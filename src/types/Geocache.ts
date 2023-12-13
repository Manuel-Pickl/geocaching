/**
 * class for Geocache objects
 * @test
 */
export class Geocache
{
    name: string;
    latitude: number;
    longitude: number;
    found: boolean;
    time: string;
  
    /**
     * Represents a book.
     * @constructor
     */
    constructor(name: string, latitude: number, longitude: number, found: boolean, time: string)
    {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.found = found;
        this.time = time;
    }
}