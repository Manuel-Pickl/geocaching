import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
}

enum MapType {
    Map,
    Hybrid,
    Satellite
  }

const Leaflet: React.FC<LeafletMapProps> = ({ center, zoom }) => {
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    // Initialize the map
    mapRef.current = L.map('map').setView(toLatLngExpression(center), zoom);

    getTileLayer(MapType.Hybrid).addTo(mapRef.current);

    // Add a marker
    L.marker(toLatLngExpression(center)).addTo(mapRef.current);

    return () => {
      // Cleanup when the component unmounts
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center, zoom]);

  return <div id="map"></div>;
};

export default Leaflet;

function toLatLngExpression(coordinates: [number, number]): LatLngExpression {
    return L.latLng(coordinates);;
}

function getTileLayer(mapType: MapType): L.TileLayer {
  switch(mapType) {
    case MapType.Satellite:
      // satellite
      return L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
    case MapType.Hybrid:
      // hybrid
      return L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
    default:
      // map
      return L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 20,
        subdomains:['mt0','mt1','mt2','mt3']
      });
  }
}
