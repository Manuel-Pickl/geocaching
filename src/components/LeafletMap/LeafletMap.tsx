import { useEffect, useRef, useState } from 'react';
import L, { LatLngExpression, Map } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.scss'
import { read } from '../../services/SpeechSynthesis';
import { Geocache } from '../../types/Geocache';
import { toast } from 'react-toastify';
import { MapType } from '../../types/MapType';
import { getDistance } from 'geolib';

interface LeafletMapProps
{
  position: [number, number];
  userPosition: [number, number] | null;
  geocaches: Geocache[];
  radius: number;
  voiceIsOn: boolean;
}

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

  useEffect(() =>
  {
    addMap();
  }, []);

  useEffect(() =>
  {
    checkForNearGeocaches();
    updateUserMarker();
  }, [userPosition]);

  useEffect(() =>
  {
    updateFoundMarkers();
  }, [geocaches]);

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
        read(message);
      }
    }
  }

  // debug function
  function handleMapClick(event: L.LeafletMouseEvent): void
  {
    // @ts-ignore
    const clickedLatLng = event.latlng;
    // console.log(`"latitude": ${clickedLatLng.lat}, "longitude": ${clickedLatLng.lng},`);
  }

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

    map.current.on('click', handleMapClick);
  }

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

  function getIconHtml(geocache: Geocache): string
  {
    const markerImage: string = geocache.isDefault
      ? "<img src='/markers/marker.png' class='marker-pin' alt='marker pin'/>"
      : `<img src='/markers/marker${Math.floor(Math.random() * 5) + 1}.png' class='marker-pin' alt='marker pin'/>`;
    const geocacheImage: string = geocache.isDefault
      ? `<img src="/landmarks/${geocache.name}.jpg" class="marker-image" alt=${geocache.name}/>`
      : "";
    const iconHtml: string = `${markerImage}${geocacheImage}`;
  
    return iconHtml;
  }

  function getPopupHtml(geocache: Geocache): string
  {
    const geocacheImage: string = geocache.isDefault
      ? `<img src="/landmarks/${geocache.name}.jpg" class="popup-image" alt=${geocache.name}/>`
      : "";
      const popupHtml: string = `
      <div class="popup">
        <b>${geocache.name}</b>
        ${geocacheImage}
        ✪ ${geocache.time}
      </div>
    `;

    return popupHtml;
  }

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

  function toLatLngExpression(coordinates: [number, number]): LatLngExpression
  {
    return L.latLng(coordinates);;
  }

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