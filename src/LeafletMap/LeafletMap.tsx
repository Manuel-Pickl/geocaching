import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css'
import markerImage from '../assets/marker.png';
import { GeoPoint } from '../GeoPoint';

interface LeafletMapProps {
  position: [number, number];
  userPosition: [number, number] | null;
  geoPoints: GeoPoint[];
}

enum MapType {
  Map,
  Hybrid,
  Satellite
}

const LeafletMap: React.FC<LeafletMapProps> = ({ position, userPosition, geoPoints }) => {
  const maxZoom: number = 21;
  const minZoom: number = 3;
  const startZoom: number = 13;
  const markerWidth: number = 25;
  
  const map = useRef<Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);
  
  useEffect(() => {
    addMap();
  }, []);

  useEffect(() => {
    updateUserMarker();
  }, [userPosition]);

  useEffect(() => {
    updateFoundMarkers();
  }, [geoPoints]);

  return <div id="map"></div>;

  function addMap() {
    if (map.current) {
      return;
    }

    map.current = L.map('map').setView(toLatLngExpression(position), startZoom);
    getTileLayer(MapType.Hybrid).addTo(map.current);
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
      const icon = L.icon({
        iconUrl: markerImage,
        iconSize: [markerWidth, null as any]
      });

      const marker = L.marker(toLatLngExpression([geoPoint.latitude, geoPoint.longitude]), { icon: icon });
      marker.addTo(map.current);

      marker.bindPopup(`<b>${geoPoint.name}</b><br>${geoPoint.time}`).on('click', () => {
        marker.openPopup();
      });
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
};

export default LeafletMap;
