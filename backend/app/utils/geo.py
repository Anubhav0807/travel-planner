import math

# India bounding box (approximate)
INDIA_BBOX = {
    "min_lat": 6.0,
    "max_lat": 38.0,
    "min_lng": 68.0,
    "max_lng": 98.0,
}


def haversine(lat1, lng1, lat2, lng2):
    """Calculate distance in km between two lat/lng points."""
    R = 6371  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)
    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lng / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


def is_within_india(lat, lng):
    """Check whether a coordinate falls within India's bounding box."""
    return (
        INDIA_BBOX["min_lat"] <= lat <= INDIA_BBOX["max_lat"]
        and INDIA_BBOX["min_lng"] <= lng <= INDIA_BBOX["max_lng"]
    )


def validate_coordinates(lat, lng, label="Point"):
    """Return an error string if coordinates are invalid, else None."""
    if not (-90 <= lat <= 90 and -180 <= lng <= 180):
        return f"{label} ({lat}, {lng}) has invalid coordinates."
    if not is_within_india(lat, lng):
        return (
            f"{label} ({lat}°, {lng}°) appears to be outside India. "
            f"Expected: {INDIA_BBOX['min_lat']}°N–{INDIA_BBOX['max_lat']}°N, "
            f"{INDIA_BBOX['min_lng']}°E–{INDIA_BBOX['max_lng']}°E."
        )
    return None
