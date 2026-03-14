import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Create a rotated custom icon
const createRotatedIcon = (heading, type) => {
  let color = "#58a6ff"; // default blue
  let stroke = "#1f6feb";
  
  if (type === "Cargo") {
    color = "#58a6ff"; // blue
    stroke = "#1f6feb";
  } else if (type === "Tanker") {
    color = "#fb8f24"; // orange
    stroke = "#b55e05";
  } else if (type === "Fishing") {
    color = "#3fb950"; // green
    stroke = "#2ea043";
  } else if (type === "High-Speed") {
    color = "#ff7b72"; // red
    stroke = "#da3633";
  } else if (type === "Anchored") {
    color = "#8b949e"; // gray
    stroke = "#6e7681";
  }

  return L.divIcon({
    className: 'custom-ship-icon',
    html: `<div style="transform: rotate(${heading || 0}deg);">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L20 20L12 18L4 20L12 2Z" fill="${color}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>
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
      icon={createRotatedIcon(ship.cog || ship.heading, ship.ship_type)}
    >
      <Popup className="ship-popup">
        <div className="ship-popup-content">
          <h3>{ship.name || 'Unknown Vessel'}</h3>
          <p><span className="label">MMSI:</span> {ship.mmsi}</p>
          <p><span className="label">Speed:</span> {ship.sog} kn</p>
          <p><span className="label">Course:</span> {ship.cog}°</p>
          <p><span className="label">Type:</span> {ship.ship_type || 'Unknown'}</p>
        </div>
      </Popup>
    </Marker>
  ));
};
