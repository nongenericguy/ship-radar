import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Create a rotated custom icon
const createRotatedIcon = (heading) => {
  return L.divIcon({
    className: 'custom-ship-icon',
    html: `<div style="transform: rotate(${heading || 0}deg);">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L20 20L12 18L4 20L12 2Z" fill="#58a6ff" stroke="#1f6feb" stroke-width="2" stroke-linejoin="round"/>
      </svg>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export const renderShips = (shipsMap) => {
  return Object.values(shipsMap).map(ship => (
    <Marker 
      key={ship.mmsi} 
      position={[ship.lat, ship.lon]}
      icon={createRotatedIcon(ship.cog || ship.heading)}
    >
      <Popup className="ship-popup">
        <div className="ship-popup-content">
          <h3>{ship.name || 'Unknown Vessel'}</h3>
          <p><span className="label">MMSI:</span> {ship.mmsi}</p>
          <p><span className="label">Speed:</span> {ship.sog} knots</p>
          <p><span className="label">Course:</span> {ship.cog}°</p>
          <p><span className="label">Timestamp:</span> {ship.timestamp ? new Date(ship.timestamp).toLocaleTimeString() : 'N/A'}</p>
        </div>
      </Popup>
    </Marker>
  ));
};
