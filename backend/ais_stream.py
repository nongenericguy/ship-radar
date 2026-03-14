import json
import asyncio
import websockets
from ship_filter import is_in_strait_of_hormuz
from websocket_server import manager

AIS_STREAM_URL = "wss://stream.aisstream.io/v0/stream"
API_KEY = "e1278715114f2365b41a1e88c402107a8ec7050d"  # IMPORTANT: Users MUST replace this with their actual AISStream API key

async def ais_stream_client():
    # Bounding box for the Strait of Hormuz and Arabian Sea
    # Latitude: 23 to 29
    # Longitude: 53 to 60
    subscribe_message = {
        "APIKey": API_KEY,
        "BoundingBoxes": [[[23.0, 53.0], [29.0, 60.0]]], 
        "FilterMessageTypes": ["PositionReport", "ShipStaticData"]
    }

    while True:
        try:
            async with websockets.connect(AIS_STREAM_URL) as websocket:
                await websocket.send(json.dumps(subscribe_message))
                print("Connected to AISStream WebSocket")
                
                async for message_json in websocket:
                    try:
                        message = json.loads(message_json)
                        msg_type = message.get("MessageType")
                        
                        if msg_type == "PositionReport":
                            pos_report = message.get("Message", {}).get("PositionReport", {})
                            meta_data = message.get("MetaData", {})
                            
                            lat = pos_report.get("Latitude")
                            lon = pos_report.get("Longitude")
                            
                            if lat is not None and lon is not None:
                                if is_in_strait_of_hormuz(lat, lon):
                                    ship_data = {
                                        "mmsi": meta_data.get("MMSI", pos_report.get("UserID", "Unknown")),
                                        "name": meta_data.get("ShipName", "Unknown Vessel").strip(),
                                        "lat": lat,
                                        "lon": lon,
                                        "sog": pos_report.get("Sog", 0),
                                        "cog": pos_report.get("Cog", 0),
                                        "timestamp": meta_data.get("time_utc", "")
                                    }
                                    await manager.broadcast(ship_data)
                                    
                    except json.JSONDecodeError:
                        print("Error decoding AIS message json")
                    except Exception as e:
                        print(f"Error processing AIS message: {e}")
                        
        except Exception as e:
            print(f"AISStream connection error: {e}. Reconnecting in 5 seconds...")
            await asyncio.sleep(5)
