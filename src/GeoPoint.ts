import geopointsJson from './assets/geopoints.json';

const key: string = "geopoints";
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

    static getGeoPoints(): GeoPoint[] {
        var geopoints: GeoPoint[] | null = this.deserializeGeoPoints();
        
        if (!geopoints) {
            console.log("initialize geopoints");
            geopoints = geopointsJson.map((geopointJson: GeoPoint) => {
                return new GeoPoint(
                    geopointJson.name,
                    geopointJson.latitude,
                    geopointJson.longitude,
                    geopointJson.found,
                    geopointJson.time
                );
            });
        }

        return geopoints;
    }

    static deserializeGeoPoints(): GeoPoint[] | null {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error getting from local storage:', error);
            return null;
        }
    }
}