/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FireReport } from '../api/types';

// Fix for default marker icons in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface FireMapProps {
  reports: FireReport[];
  center?: [number, number];
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
}

// Component to handle map click events
const MapEventHandler: React.FC<{
  onClick?: (lat: number, lng: number) => void;
}> = ({ onClick }) => {
  const map = useMap();

  useEffect(() => {
    if (!onClick) return;

    const handleClick = (e: any) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);

  return null;
};

// Get marker color based on fire status
const getMarkerColor = (status: string | undefined) => {
  switch (status) {
    case 'REPORTED':
      return 'red';
    case 'VERIFIED':
      return 'orange';
    case 'CONTAINED':
      return 'blue';
    case 'EXTINGUISHED':
      return 'green';
    case 'FALSE_ALARM':
      return 'gray';
    default:
      return 'red';
  }
};

const FireMap: React.FC<FireMapProps> = ({
  reports,
  center = [36.7783, -119.4179], // California center
  zoom = 6,
  onMapClick,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {reports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={
            new Icon({
              ...DefaultIcon.options,
              iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${getMarkerColor(
                report.status
              )}.png`,
            })
          }
        >
          <Popup>
            <div className="text-black">
              <h3 className="font-bold">
                {report.locationName || 'Unknown Location'}
              </h3>
              <p>{report.description}</p>
              <p className="text-sm">
                Status: <span className="font-semibold">{report.status}</span>
              </p>
              <p className="text-sm">
                Reported: {new Date(report.timestamp).toLocaleString()}
              </p>
              <p className="text-sm">Severity: {report.severity}/5</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {onMapClick && <MapEventHandler onClick={onMapClick} />}
    </MapContainer>
  );
};

export default FireMap;
