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


def normalize_sog(raw_sog: float) -> float:
    """
    Convert AIS raw SOG to real SOG.
    AIS often reports speed in tenths of knots.
    """
    try:
        raw_sog = float(raw_sog)
        return raw_sog / 10.0
    except (ValueError, TypeError):
        return 0.0


def classify_ship(sog: float) -> str:
    """
    Classify ship type based on real Speed Over Ground (SOG).
    Anchored ships are not removed; they are classified normally.
    """
    try:
        sog = float(sog)
    except (ValueError, TypeError):
        return "Unknown"

    if sog < 2:
        return "Anchored"
    elif sog < 10:
        return "Fishing"
    elif sog < 20:
        return "Tanker"
    elif sog < 30:
        return "Cargo"
    else:
        return "High-Speed"