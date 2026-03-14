import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { renderShips } from './shipLayer';

const MapView = ({ onConnectionChange }) => {
  const [ships, setShips] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    const wsUrl = "wss://ship-radar.onrender.com/live"; // update this to deployed render link
    
    const connect = () => {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("Connected to WebSocket");
        if (onConnectionChange) onConnectionChange(true);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const shipData = JSON.parse(event.data);
          
          setShips((prev) => ({
            ...prev,
            [shipData.mmsi]: shipData
          }));
        } catch (err) {
          console.error("Error parsing websocket message", err);
        }
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket Disconnected. Reconnecting in 3s...");
        if (onConnectionChange) onConnectionChange(false);
        setTimeout(connect, 3000);
      };

      wsRef.current.onerror = (err) => {
        console.error("WebSocket Error:", err);
        wsRef.current.close();
      };
    };

    connect();

    // Fetch initial ships via REST 
    fetch("https://ship-radar.onrender.com/ships") // update this to deployed render link
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const initialMap = {};
          data.forEach(ship => {
            initialMap[ship.mmsi] = ship;
          });
          setShips(initialMap);
        }
      })
      .catch(err => console.error("Error fetching initial ships:", err));

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [onConnectionChange]);

  return (
    <MapContainer
  center={[26, 56]}
  zoom={6}
  style={{ height: "100vh", width: "100%" }}
>
  {/* Satellite imagery */}
  <TileLayer
    attribution="Tiles © Esri"
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  />

  {/* English country & city labels */}
  <TileLayer
    attribution="Labels © Esri"
    url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
  />

  {/* your ship layer */}
</MapContainer>

  );
};

export default MapView;
