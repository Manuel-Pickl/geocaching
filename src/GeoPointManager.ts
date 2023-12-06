import { GeoPoint } from './GeoPoint';
import geopointsJson from './assets/geopoints.json';

export class GeoPointManager {
    getDefaultGeoPoints(): GeoPoint[] {
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

    geoPointExists(geoPointName: string, geoPoints: GeoPoint[]) {
        const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
        const geoPointExists: boolean = geoPoint != undefined;

        return geoPointExists;
    }

    geoPointAlreadyFound(geoPointName: string, geoPoints: GeoPoint[]): boolean {
        const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
        if (!geoPoint) {
            return false;
        }

        return geoPoint.found
    }

    onGeoPointFound(geoPointName: string, geoPoints: GeoPoint[]): boolean {
        const geoPoint: GeoPoint | undefined = geoPoints.find(x => x.name == geoPointName);
        if (!geoPoint) {
            return false;
        }

        if (this.geoPointAlreadyFound(geoPointName, geoPoints)) {
            return false;
        }

        geoPoint.found = true;
        geoPoint.time = new Date().toLocaleDateString('de-DE');

        return true;
    };

    addGeoPoint(
        geoPoints: GeoPoint[],
        geoPointName: string,
        position: [number, number] | null,
        found: boolean = false,
        time: string = "")
    {
        if (!position) {
            return;
        }

        geoPoints.push(new GeoPoint(
            geoPointName,
            position[0],
            position[1],
            found,
            time
        ));
    }
}