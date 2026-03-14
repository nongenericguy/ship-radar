import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from websocket_server import manager
from ais_stream import ais_stream_client

app = FastAPI(title="Maritime Traffic Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Start the AIS stream client in the background
    asyncio.create_task(ais_stream_client())

@app.get("/ships")
async def get_ships():
    """REST endpoint to get currently tracked ships within the bounding box."""
    return manager.get_all_ships()

@app.websocket("/live")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for live ship updates."""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle client disconnection
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
