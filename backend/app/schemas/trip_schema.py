"""Simple validation helpers for trip data."""
from datetime import datetime
from app.models.trip import TRAVEL_MODES, TRIP_PURPOSES, FREQUENCIES


def _parse_datetime(value):
    """Parse ISO datetime string, return datetime or None."""
    if isinstance(value, datetime):
        return value
    if not value:
        return None
    try:
        # Handle various ISO formats
        value = str(value).replace("Z", "+00:00")
        return datetime.fromisoformat(value)
    except (ValueError, TypeError):
        return None


def validate_trip_create(data):
    errors = {}

    # Required float fields: coordinates
    for field in ["origin_lat", "origin_lng", "dest_lat", "dest_lng"]:
        val = data.get(field)
        if val is None:
            errors[field] = f"{field} is required."
        else:
            try:
                data[field] = float(val)
            except (ValueError, TypeError):
                errors[field] = f"{field} must be a number."

    # Required datetime fields
    for field in ["start_time", "end_time"]:
        val = data.get(field)
        parsed = _parse_datetime(val)
        if parsed is None:
            errors[field] = f"{field} is required and must be a valid ISO datetime."
        else:
            data[field] = parsed

    # Mode
    mode = data.get("mode")
    if not mode or mode not in TRAVEL_MODES:
        errors["mode"] = f"mode must be one of: {', '.join(TRAVEL_MODES)}"

    # Purpose
    purpose = data.get("purpose")
    if not purpose or purpose not in TRIP_PURPOSES:
        errors["purpose"] = f"purpose must be one of: {', '.join(TRIP_PURPOSES)}"

    # Distance
    distance = data.get("distance")
    if distance is not None:
        try:
            data["distance"] = float(distance)
            if data["distance"] < 0:
                errors["distance"] = "distance must be >= 0."
        except (ValueError, TypeError):
            errors["distance"] = "distance must be a number."
    else:
        data["distance"] = 0  # will be auto-calculated

    # Optional numeric fields
    companions = data.get("companions", 0)
    try:
        data["companions"] = int(companions)
    except (ValueError, TypeError):
        errors["companions"] = "companions must be an integer."

    cost = data.get("cost", 0.0)
    try:
        data["cost"] = float(cost)
    except (ValueError, TypeError):
        errors["cost"] = "cost must be a number."

    # Frequency
    frequency = data.get("frequency", "one_time")
    if frequency not in FREQUENCIES:
        errors["frequency"] = f"frequency must be one of: {', '.join(FREQUENCIES)}"
    data["frequency"] = frequency

    return errors


def validate_trip_update(data):
    errors = {}

    if "mode" in data and data["mode"] not in TRAVEL_MODES:
        errors["mode"] = f"mode must be one of: {', '.join(TRAVEL_MODES)}"

    if "purpose" in data and data["purpose"] not in TRIP_PURPOSES:
        errors["purpose"] = f"purpose must be one of: {', '.join(TRIP_PURPOSES)}"

    if "frequency" in data and data["frequency"] not in FREQUENCIES:
        errors["frequency"] = f"frequency must be one of: {', '.join(FREQUENCIES)}"

    for field in ["start_time", "end_time"]:
        if field in data:
            parsed = _parse_datetime(data[field])
            if parsed is None:
                errors[field] = f"{field} must be a valid ISO datetime."
            else:
                data[field] = parsed

    for field in ["origin_lat", "origin_lng", "dest_lat", "dest_lng", "distance", "cost"]:
        if field in data:
            try:
                data[field] = float(data[field])
            except (ValueError, TypeError):
                errors[field] = f"{field} must be a number."

    if "companions" in data:
        try:
            data["companions"] = int(data["companions"])
        except (ValueError, TypeError):
            errors["companions"] = "companions must be an integer."

    return errors


def validate_batch_sync(data):
    if not data or not isinstance(data.get("trips"), list):
        return {"trips": "A list of trips is required."}
    if len(data["trips"]) < 1:
        return {"trips": "At least one trip is required."}
    if len(data["trips"]) > 50:
        return {"trips": "Maximum 50 trips per batch."}
    return {}
