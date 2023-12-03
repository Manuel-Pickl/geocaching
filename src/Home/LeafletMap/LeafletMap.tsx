import React, { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.scss'
import { GeoPoint } from '../../GeoPoint';
import * as geolib from 'geolib';

interface LeafletMapProps {
  position: [number, number];
  userPosition: [number, number] | null;
  geoPoints: GeoPoint[];
  radius: number;
}

enum MapType {
  Map,
  Hybrid,
  Satellite
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  position,
  userPosition,
  geoPoints,
  radius
}) => {
  const maxZoom: number = 21;
  const minZoom: number = 3;
  const startZoom: number = 16;
  const markerWidth: number = 30;
  const markerHeight: number = markerWidth / 0.61;

  const [nearGeoPoints, _setNearGeoPoints] = useState<Set<String>>(new Set());;
  const map = useRef<Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    addMap();
  }, []);

  useEffect(() => {
    checkForNearGeoPoints();
    updateUserMarker();
  }, [userPosition]);

  useEffect(() => {
    updateFoundMarkers();
  }, [geoPoints]);

  const checkForNearGeoPoints = () => {
    if (!userPosition) {
      return;
    }

    geoPoints
      .filter(geoPoint => !geoPoint.found)
      .forEach(geoPoint => {
      const distanceToGeoPoint = geolib.getDistance(
        { latitude: userPosition[0], longitude: userPosition[1] },
        { latitude: geoPoint.latitude, longitude: geoPoint.longitude }
      );

      const geoPointIsNear: boolean = distanceToGeoPoint <= radius;     
      const firstTimeNearGeoPoint: boolean = !nearGeoPoints.has(geoPoint.name);
      if (geoPointIsNear) {
        if (firstTimeNearGeoPoint) {
          nearGeoPoints.add(geoPoint.name);
          console.log(geoPoint.name);
          // voice
          // notification
        }
      } else {
        nearGeoPoints.delete(geoPoint.name);
      }
    });
  }

  // debug function
  function handleMapClick(event: L.LeafletMouseEvent) {
    const clickedLatLng = event.latlng;
    console.log(`"latitude": ${clickedLatLng.lat}, "longitude": ${clickedLatLng.lng},`);
  }

  function addMap() {
    if (map.current) {
      return;
    }

    map.current = L.map('map').setView(toLatLngExpression(position), startZoom);
    getTileLayer(MapType.Hybrid).addTo(map.current);

    map.current.on('click', handleMapClick);
  }

  function updateUserMarker() {
    if (!userPosition || !map.current) {
      return;
    }
    
    if (!userMarker.current) {
      userMarker.current = L.circleMarker(toLatLngExpression(userPosition), {
        radius: markerWidth / 3,
        color: 'white',
        fillColor: 'blue',
        fillOpacity: 1,
      });
      
      userMarker.current.addTo(map.current);
    }

    userMarker.current.setLatLng(toLatLngExpression(userPosition));
  }

  function updateFoundMarkers() {
    if (!geoPoints || !map.current) {
      return;
    }
  
    // Remove existing markers before updating
    map.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.current?.removeLayer(layer);
      }
    });
  
    geoPoints.filter(geoPoint => geoPoint.found).forEach((geoPoint) => {
      const customIcon = L.divIcon({
        className: 'marker',
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [markerWidth / 2, markerHeight],
        html: `
          <img src="/marker.png" class="marker-pin" alt="marker pin"/>
          <img src="/landmarks/${geoPoint.name}.jpg" class="marker-image" alt=${geoPoint.name}/>
        `
      });

      const marker = L.marker(toLatLngExpression([geoPoint.latitude, geoPoint.longitude]), { icon: customIcon });
      if (map.current) {
        marker.addTo(map.current);
      }
      
      marker.bindPopup(`
        <div class="popup">
          <b>${geoPoint.name}</b>
          <img src="/landmarks/${geoPoint.name}.jpg" class="popup-image" alt=${geoPoint.name}/>
          ✪ ${geoPoint.time}
        </div>
      `).on('click', () => { marker.openPopup(); });
    });
  }

  function toLatLngExpression(coordinates: [number, number]): LatLngExpression {
    return L.latLng(coordinates);;
  }

  function getTileLayer(mapType: MapType): L.TileLayer {
    // tileLayers found on https://stackoverflow.com/questions/33343881/leaflet-in-google-maps
    switch(mapType) {
      case MapType.Satellite:
        // satellite
        return L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          minZoom: minZoom,
          maxZoom: maxZoom,
          subdomains:['mt0','mt1','mt2','mt3']
        });
      case MapType.Hybrid:
        // hybrid
        return L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
          maxZoom: maxZoom,
          minZoom: minZoom,
          subdomains:['mt0','mt1','mt2','mt3']
        });
      default:
        // map
        return L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          maxZoom: maxZoom,
          minZoom: minZoom,
          subdomains:['mt0','mt1','mt2','mt3']
        });
    }
  }

  return (
    <>
      <div id="map"></div>
    </>
  );
};

export default LeafletMap;
