export class GeoPoint {
    name: string;
    latitude: number;
    longitude: number;
    found: boolean;
    time: string;
    isDefault: boolean;
  
    constructor(name: string, latitude: number, longitude: number, found: boolean, time: string, isDefault: boolean) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.found = found;
        this.time = time;
        this.isDefault = isDefault;
    }
}