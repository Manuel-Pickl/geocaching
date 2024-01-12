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
import { GeocacheStatus } from '../../types/GeocacheStatus';

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
  currentGeocache: Geocache | undefined;
}

/**
 * Component for rendering a Leaflet map with geocache markers.
 * 
 * @param props - Props for the LeafletMap component.
 * @component
 */
function LeafletMap({ position, userPosition, geocaches, radius, voiceIsOn, currentGeocache }: LeafletMapProps)
{
  const maxZoom: number = 21;
  const minZoom: number = 3;
  const startZoom: number = 16;
  const markerWidth: number = 30;
  const markerHeight: number = markerWidth / 0.61;

  const [nearGeocaches, _setNearGeocaches] = useState<Set<String>>(new Set());;
  const map = useRef<Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);
  const markersRef = useRef<Set<L.Marker<any>>>(new Set());
  const geocachesInitialized = useRef<boolean>(false);
  const geocachesLoaded = useRef<boolean>(false);

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
   * Updates the markers on the map.
   */
  useEffect(() =>
  {
    if (geocachesInitialized.current
      && geocachesLoaded.current)
    {
      updateMarkerForCurrentGeocache();
    }
    else
    {
      initializeMarkers();
    }
  }, [geocaches]);

  /**
   * Initialized the markers on startup.
   */
  function initializeMarkers() {
    if (geocachesInitialized.current)
    {
      geocachesLoaded.current = true;
    }
    geocachesInitialized.current = true;

    geocaches
      .filter(geocache => geocache.found)
      .forEach(geocache => 
        markersRef.current.add(addMarker(geocache))
      )
  }

  /**
   * Updates the markers for the current geocache.
   */
  function updateMarkerForCurrentGeocache() {
    switch (currentGeocache?.geocacheStatus)
    {
      case GeocacheStatus.Hidden:
        onGeocacheHidden(currentGeocache);
        break;
      
      case GeocacheStatus.Found:
        onGeocacheFound(currentGeocache);
        break;
      
      case GeocacheStatus.Removed:
        onGeocacheRemoved(currentGeocache);
        break;
    }
  }
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
   * @param aGeocache - The geocache for which to generate the icon HTML.
   * @param aGeocacheStatus - The status of the geocache.
   * @returns string - HTML string for the icon.
   */
  function getIconHtml(aGeocache: Geocache, aGeocacheStatus: GeocacheStatus): string
  {
    const iconHtml: string = `
      <img 
        class='marker-pin ${aGeocacheStatus}' 
        src='/markers/marker${aGeocache.iconIndex}.png'
        alt='marker pin'
      />
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
   * 
   * @param aGeocache - The found geocache.
  */
  function onGeocacheFound(aGeocache: Geocache | undefined): void
  {
    if (!aGeocache)
    {
      return;
    }

    markersRef.current.add(addMarker(aGeocache, GeocacheStatus.Found));
  }

  /**
   * Updates markers on the map for hidden geocaches.
   * 
   * @param aGeocache - The hidden geocache.
  */
  function onGeocacheHidden(aGeocache: Geocache | undefined)
  {
    if (!aGeocache)
    {
      return;
    }

    const marker = addMarker(aGeocache, GeocacheStatus.Hidden);
    setTimeout(() => {
      marker.remove();

    }, 3000)
  }

  /**
   * Updates markers on the map for removed geocaches.
   * 
   * @param aGeocache - The removed geocache.
  */
  function onGeocacheRemoved(aGeocache: Geocache | undefined)
  {
    const correspondingMarker = Array.from(markersRef.current)
      // @ts-ignore
      .find(marker => marker.name == aGeocache.name);
    if (!correspondingMarker)
    {
      return;
    }

    markersRef.current.delete(correspondingMarker);
    correspondingMarker?.remove();
  }
  
  /**
   * Add a marker on the map for the given geocache.
   * 
   * @param aGeocache - The geocache for which to add a marker.
   * @param aGeocacheStatus - The status of the geocache.
  */
  function addMarker(aGeocache: Geocache, aGeocacheStatus: GeocacheStatus = GeocacheStatus.None): L.Marker<any>
  {
    const customIcon = L.divIcon({
      className: "marker",
      iconSize: [markerWidth, markerHeight],
      iconAnchor: [markerWidth / 2, markerHeight],
      html: getIconHtml(aGeocache, aGeocacheStatus)
    });

    const marker = L.marker(toLatLngExpression([aGeocache.latitude, aGeocache.longitude]), { icon: customIcon });
    // @ts-ignore
    marker.name = aGeocache.name;
    if (map.current)
    {
      marker.addTo(map.current);
    }
    
    marker
      .bindPopup(getPopupHtml(aGeocache))
      .on('click', () => { marker.openPopup(); });

    return marker;
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