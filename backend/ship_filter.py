def is_in_strait_of_hormuz(lat: float, lon: float) -> bool:
    """
    Extended maritime monitoring region.

    Latitude: 10 to 35
    Longitude: 40 to 80
    Covers Persian Gulf, Strait of Hormuz,
    Arabian Sea, and western India routes.
    """
    try:
        lat = float(lat)
        lon = float(lon)
        return 10.0 <= lat <= 35.0 and 40.0 <= lon <= 80.0
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
