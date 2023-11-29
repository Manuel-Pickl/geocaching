import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css'

interface LeafletMapProps {
  position: [number, number];
  userPosition: [number, number] | null;
}

enum MapType {
  Map,
  Hybrid,
  Satellite
}

const LeafletMap: React.FC<LeafletMapProps> = ({ position, userPosition }) => {
  const maxZoom: number = 21;
  const minZoom: number = 3;
  const startZoom: number = 13;
  
  const map = useRef<Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);
  
  useEffect(() => {
    addMap();
  }, []);

  useEffect(() => {
    updateUserMarker();
  }, [userPosition]);

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
        radius: 8,
        color: 'white',
        fillColor: 'blue',
        fillOpacity: 1,
      });
      
      userMarker.current.addTo(map.current);
    }

    userMarker.current.setLatLng(toLatLngExpression(userPosition));
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
