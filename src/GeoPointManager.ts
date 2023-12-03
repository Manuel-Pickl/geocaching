import { GeoPoint } from './GeoPoint';
import geopointsJson from './assets/geopoints.json';

const key: string = "geopoints";

export class GeoPointManager {
    getGeoPoints(): GeoPoint[] {
        var persistentGeoPoints: GeoPoint[] | null = this.deserialize();
        if (persistentGeoPoints) {
            return persistentGeoPoints;
        }

        return this.getDefaultGeoPoints();
    }

    private getDefaultGeoPoints() {
        console.log("initialize geopoints");
        const defaultGeoPoints: GeoPoint[] = geopointsJson.map((geopointJson: GeoPoint) => {
            return new GeoPoint(
                geopointJson.name,
                geopointJson.latitude,
                geopointJson.longitude,
                geopointJson.found,
                geopointJson.time
            );
        });

        return defaultGeoPoints;
    }

    onGeoPointFound(geoPointName: string, geoPoints: GeoPoint[]): boolean {
        const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
        if (!geoPoint) {
            return false;
        }

        const geoPointAlreadyFound = geoPoint.found;
        if (geoPointAlreadyFound) {
            return false;
        }

        geoPoint.found = true;
        geoPoint.time = new Date().toLocaleDateString('de-DE');

        this.serialize(geoPoints);

        return true;
    };

    deserialize(): GeoPoint[] | null {
        try {
            const serializedData = localStorage.getItem(key);
            if (serializedData === null) {
                return null;
            }
            return JSON.parse(serializedData);
        } catch (error) {
            console.error('Error deserializing data:', error);
            return null;
        }
    }

    serialize(geoPoints: GeoPoint[]): void {
        try {
            const serializedData = JSON.stringify(geoPoints);
            localStorage.setItem(key, serializedData);
        } catch (error) {
            console.error('Error serializing data:', error);
        }
    }
}