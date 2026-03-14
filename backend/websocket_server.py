from typing import List, Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.latest_ships: Dict[str, dict] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Send current state upon connection
        for ship in self.latest_ships.values():
            try:
                await websocket.send_json(ship)
            except Exception:
                pass

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Update state
        mmsi = message.get("mmsi")
        if mmsi:
            self.latest_ships[str(mmsi)] = message
            
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Handle disconnected clients gracefully
                pass

    def get_all_ships(self):
        return list(self.latest_ships.values())

manager = ConnectionManager()
