"use client";

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect } from 'react';


interface MapViewProps {
  lat: number;
  lng: number;
  zoom?: number;
}

export default function MapView({ lat, lng, zoom = 10 }: MapViewProps) {
  useEffect(() => {
    // Dynamically import Leaflet only on the client to avoid SSR issues
    import('leaflet').then((L) => {
      try {
        // Fix default icon paths when using bundlers by pointing to CDN
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });
      } catch (e) {
        // ignore if leaflet not available at runtime
        // eslint-disable-next-line no-console
        console.warn('Leaflet icon patch failed', e);
      }
    });
  }, []);

  return (
    <div className="w-full h-64 rounded overflow-hidden">
      <MapContainer center={[lat, lng]} zoom={zoom} className="w-full h-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[lat, lng]}>
          <Popup>Current location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
