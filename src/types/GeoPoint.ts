export class GeoPoint {
    name: string;
    latitude: number;
    longitude: number;
    found: boolean;
    time: string;
  
    constructor(name: string, latitude: number, longitude: number, found: boolean, time: string) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.found = found;
        this.time = time;
    }
}