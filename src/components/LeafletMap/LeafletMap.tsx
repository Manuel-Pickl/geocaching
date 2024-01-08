import { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.scss'
import { Geocache } from '../../types/Geocache';
import { toast } from 'react-toastify';
import { MapType } from '../../types/MapType';
import { getDistance } from 'geolib';
import { TimeManager } from '../../services/TimeManager';
import { SpeechSynthesiser } from '../../services/SpeechSynthesiser';

/**
 * Props for the LeafletMap component.
 */
interface LeafletMapProps
{
  position: [number, number];
  userPosition: [number, number] | null;
  geocaches: Geocache[];
  radius: number;
  voiceIsOn: boolean;
}

/**
 * Component for rendering a Leaflet map with geocache markers.
 * 
 * @param props - Props for the LeafletMap component.
 * @component
 */
function LeafletMap({ position, userPosition, geocaches, radius, voiceIsOn }: LeafletMapProps)
{
  const maxZoom: number = 21;
  const minZoom: number = 3;
  const startZoom: number = 16;
  const markerWidth: number = 30;
  const markerHeight: number = markerWidth / 0.61;

  const [nearGeocaches, _setNearGeocaches] = useState<Set<String>>(new Set());;
  const map = useRef<Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);

  /**
   * Initializes the map.
   */
  useEffect(() =>
  {
    addMap();
  }, []);

  /**
   * Checks for nearby geocaches and updates the user's marker.
   */
  useEffect(() =>
  {
    checkForNearGeocaches();
    updateUserMarker();
  }, [userPosition]);

  /**
   * Updates the markers for found geocaches.
   */
  useEffect(() =>
  {
    updateFoundMarkers();
  }, [geocaches]);

  /**
   * Checks if there are any geocaches within the specified radius of the user's position.
   */
  function checkForNearGeocaches(): void
  {
    if (!userPosition)
    {
      return;
    }

    for (const geocache of geocaches)
    {
      if (geocache.found)
      {
        return;
      }

      const distanceToGeocache = getDistance(
        { latitude: userPosition[0], longitude: userPosition[1] },
        { latitude: geocache.latitude, longitude: geocache.longitude }
      );
      const geocacheIsNear: boolean = distanceToGeocache <= radius;     
      if (!geocacheIsNear)
      {
        nearGeocaches.delete(geocache.name);
        continue;
      }
      
      const firstTimeNearGeocache: boolean = !nearGeocaches.has(geocache.name);
      if (!firstTimeNearGeocache)
      {
        continue;
      }

      nearGeocaches.add(geocache.name);

      const message: string = `Du bist in der Nähe vom Geocache: ${geocache.name}!`;
      toast(message);
                
      if (voiceIsOn)
      {
        SpeechSynthesiser.read(message);
      }
    }
  }

  /**
   * Adds the map to the component.
   */
  function addMap(): void
  {
    if (map.current)
    {
      return;
    }

    map.current = L
      .map('map', {zoomControl: false})
      .setView(toLatLngExpression(position), startZoom);
    getTileLayer(MapType.Hybrid).addTo(map.current);
  }

  /**
   * Updates the user's marker on the map.
   */
  function updateUserMarker(): void
  {
    if (!userPosition
      || !map.current)
    {
      return;
    }
    
    if (!userMarker.current)
    {
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

  /**
   * Generates HTML for a custom map icon.
   * 
   * @param geocache - The geocache for which to generate the icon HTML.
   * @returns string - HTML string for the icon.
   */
  function getIconHtml(geocache: Geocache): string
  {
    const iconHtml: string = `
      <img src='/markers/marker${geocache.iconIndex}.png' class='marker-pin' alt='marker pin'/>
    `;
  
    return iconHtml;
  }

  /**
   * Generates HTML for a popup associated with a geocache marker.
   * 
   * @param geocache - The geocache for which to generate the popup HTML.
   * @returns string - HTML string for the popup.
   */
  function getPopupHtml(geocache: Geocache): string
  {
    const popupHtml: string = `
      <div class="popup">
        <b>${geocache.name}</b>
        ✪ ${TimeManager.isoToLocal(geocache.time)}
      </div>
    `;

    return popupHtml;
  }

  /**
   * Updates markers on the map for found geocaches.
   */
  function updateFoundMarkers(): void
  {
    if (!geocaches || !map.current)
    {
      return;
    }
  
    // Remove existing markers before updating
    map.current.eachLayer((layer) =>
    {
      if (layer instanceof L.Marker)
      {
        map.current?.removeLayer(layer);
      }
    });
  
    geocaches.filter(geocache => geocache.found).forEach(geocache =>
    {
      const customIcon = L.divIcon({
        className: 'marker',
        iconSize: [markerWidth, markerHeight],
        iconAnchor: [markerWidth / 2, markerHeight],
        html: getIconHtml(geocache)
      });

      const marker = L.marker(toLatLngExpression([geocache.latitude, geocache.longitude]), { icon: customIcon });
      if (map.current)
      {
        marker.addTo(map.current);
      }
      
      marker
        .bindPopup(getPopupHtml(geocache))
        .on('click', () => { marker.openPopup(); });
    });
  }

  /**
   * Converts coordinates to a LatLngExpression.
   * 
   * @param coordinates - Coordinates to be converted.
   * @returns LatLngExpression - Leaflet LatLngExpression object.
   */
  function toLatLngExpression(coordinates: [number, number]): LatLngExpression
  {
    return L.latLng(coordinates);;
  }

  /**
   * Retrieves the appropriate tile layer based on the specified map type.
   * 
   * @param mapType - Type of the map.
   * @returns L.TileLayer - A Leaflet TileLayer object.
   */
  function getTileLayer(mapType: MapType): L.TileLayer
  {
    // tileLayers found on https://stackoverflow.com/questions/33343881/leaflet-in-google-maps
    switch(mapType)
    {
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