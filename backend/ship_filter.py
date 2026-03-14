def is_in_strait_of_hormuz(lat: float, lon: float) -> bool:
    """
    Check if the given coordinates are within the Strait of Hormuz 
    and Arabian Sea bounding box.
    Latitude: 23 to 29
    Longitude: 53 to 60
    """
    try:
        lat = float(lat)
        lon = float(lon)
        return 23.0 <= lat <= 29.0 and 53.0 <= lon <= 60.0
    except (ValueError, TypeError):
        return False

def classify_ship(sog: float) -> str:
    """
    Classify ship type based on Speed Over Ground (SOG).
    Classification rules:
    SOG < 2 -> "Anchored"
    2 <= SOG < 10 -> "Fishing"
    10 <= SOG < 20 -> "Tanker"
    20 <= SOG < 30 -> "Cargo"
    SOG >= 30 -> "High-Speed"
    """
    try:
        sog = float(sog)
    except (ValueError, TypeError):
        return "Unknown"
        
    if sog < 2:
        return "Anchored"
    elif 2 <= sog < 10:
        return "Fishing"
    elif 10 <= sog < 20:
        return "Tanker"
    elif 20 <= sog < 30:
        return "Cargo"
    else:
        return "High-Speed"
