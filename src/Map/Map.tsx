import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'

interface MapProps {
  position: [number, number];
}

enum MapType {
  Map,
  Hybrid,
  Satellite
}

const Leaflet: React.FC<MapProps> = ({ position }) => {
  const minZoom: number = 8;
  const maxZoom: number = 22;
  const startZoom: number = 13;
  
  const mapHtmlElement = useRef<Map | null>(null);

  useEffect(() => {
    const map: L.Map = initializeMap();

    mapHtmlElement.current = map;
    getTileLayer(MapType.Hybrid).addTo(mapHtmlElement.current);

    return () => {
      // Cleanup when the component unmounts
      if (mapHtmlElement.current) {
        mapHtmlElement.current.remove();
      }
    };
  }, [position, startZoom]);

  return <div id="map"></div>;

  function initializeMap() {
    return L.map('map').setView(toLatLngExpression(position), startZoom);
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

export default Leaflet;
