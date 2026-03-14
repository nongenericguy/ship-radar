import React from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

const createRotatedIcon = (heading = 0, type = "Cargo") => {

  const colors = {
    Cargo: "#2f81f7",
    Tanker: "#f0883e",
    Fishing: "#3fb950",
    "High-Speed": "#f85149",
    Anchored: "#8b949e"
  };

  const color = colors[type] || "#58a6ff";

  return L.divIcon({
    className: "ship-icon-wrapper",
    html: `
      <div style="
        transform: rotate(${heading}deg);
        transition: transform 0.25s linear;
        filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.6));
      ">
        <svg width="36" height="36" viewBox="0 0 24 24">
          <path 
            d="M12 2L20 20L12 17L4 20L12 2Z"
            fill="${color}"
            stroke="black"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

export const renderShips = (shipsMap) => {

  const ships = Object.values(shipsMap);

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={40}
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
    >
      {ships.map(ship => (
        <Marker
          key={ship.mmsi}
          position={[ship.lat, ship.lon]}
          icon={createRotatedIcon(ship.cog || 0, ship.ship_type)}
        >
          <Popup>
            <strong>{ship.name || "Unknown Vessel"}</strong><br/>
            MMSI: {ship.mmsi}<br/>
            Speed: {ship.sog} kn<br/>
            Course: {ship.cog}°<br/>
            Type: {ship.ship_type}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};
