'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/fixLeafletIcon';

type Issue = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  location: string;
};

interface DynamicMapProps {
  issues: Issue[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function DynamicMap({ issues, selectedId, onSelect }: DynamicMapProps) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const center: LatLngExpression = [22.7196, 75.8577];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {issues.map((issue) => (
        <Marker
          key={issue.id}
          position={[issue.latitude, issue.longitude]}
          eventHandlers={{
            click: () => onSelect(issue.id === selectedId ? null : issue.id),
          }}
        >
          {selectedId === issue.id && (
            <Popup>
              <strong>{issue.title}</strong>
              <br />
              {issue.location}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
}
