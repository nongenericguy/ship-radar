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
