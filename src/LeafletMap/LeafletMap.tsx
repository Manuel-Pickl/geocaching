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
  const minZoom: number = 3;
  const maxZoom: number = 22;
  const startZoom: number = 13;
  
  const mapHtmlElement = useRef<Map | null>(null);

  useEffect(() => {
    addMap();
    addUserMarker();
    
    return () => { removeMap(); };
  }, [position, startZoom]);

  return <div id="map"></div>;

  function addMap() {
    const map: L.Map = L.map('map').setView(toLatLngExpression(position), startZoom);
    getTileLayer(MapType.Hybrid).addTo(map);
    
    mapHtmlElement.current = map;

    return map;
  }

  function addUserMarker() {
    if (!userPosition || !mapHtmlElement.current) {
      return;
    }
    
    const userMarker: L.CircleMarker = L.circleMarker(toLatLngExpression(userPosition), {
      radius: 8,
      color: 'white',
      fillColor: 'blue',
      fillOpacity: 1
    });
    userMarker.addTo(mapHtmlElement.current);

    return userMarker;
  }

  function removeMap() {
    if (!mapHtmlElement.current) {
      return;
    }

    return mapHtmlElement.current.remove();
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
