import React, { useState } from 'react';
import MapView from './MapView';

function App() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <>
      <header>
        <h1>Maritime Traffic Radar</h1>
        <div className={`connection-status ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
          {isConnected ? 'LIVE' : 'DISCONNECTED'}
        </div>
      </header>
      <main className="map-container">
        <MapView onConnectionChange={setIsConnected} />
      </main>
    </>
  );
}

export default App;
