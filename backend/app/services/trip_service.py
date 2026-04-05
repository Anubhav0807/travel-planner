from app.extensions import db
from app.models.trip import Trip
from app.utils.geo import validate_coordinates, haversine


def create_trip(user_id, data):
    """Create a single trip record."""
    # Validate coordinates
    origin_err = validate_coordinates(data["origin_lat"], data["origin_lng"], "Origin")
    if origin_err:
        raise ValueError(origin_err)
    dest_err = validate_coordinates(data["dest_lat"], data["dest_lng"], "Destination")
    if dest_err:
        raise ValueError(dest_err)

    # Auto-calculate distance if not provided or zero
    if not data.get("distance"):
        data["distance"] = haversine(
            data["origin_lat"], data["origin_lng"],
            data["dest_lat"], data["dest_lng"],
        )

    # Auto-assign trip number
    last_trip = (
        Trip.query.filter_by(user_id=user_id)
        .order_by(Trip.trip_number.desc())
        .first()
    )
    trip_number = (last_trip.trip_number + 1) if last_trip else 1

    trip = Trip(
        trip_number=trip_number,
        user_id=user_id,
        origin_lat=data["origin_lat"],
        origin_lng=data["origin_lng"],
        origin_address=data.get("origin_address"),
        start_time=data["start_time"],
        dest_lat=data["dest_lat"],
        dest_lng=data["dest_lng"],
        dest_address=data.get("dest_address"),
        end_time=data["end_time"],
        mode=data["mode"],
        distance=data["distance"],
        purpose=data["purpose"],
        companions=data.get("companions", 0),
        frequency=data.get("frequency", "one_time"),
        cost=data.get("cost", 0.0),
        client_id=data.get("client_id"),
    )

    db.session.add(trip)
    db.session.commit()
    return trip


def batch_sync_trips(user_id, trips_data):
    """Sync a batch of trips from the mobile app (offline support)."""
    created = []
    skipped = []

    for data in trips_data:
        # Skip if client_id already exists
        if data.get("client_id"):
            existing = Trip.query.filter_by(client_id=data["client_id"]).first()
            if existing:
                skipped.append(data["client_id"])
                continue

        try:
            trip = create_trip(user_id, data)
            created.append(trip.to_dict())
        except ValueError:
            skipped.append(data.get("client_id", "unknown"))

    return created, skipped


def get_user_trips(user_id, page=1, per_page=20):
    """Get paginated trip history for a user."""
    pagination = (
        Trip.query.filter_by(user_id=user_id)
        .order_by(Trip.start_time.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return {
        "trips": [t.to_dict() for t in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
    }


def get_trip_by_id(trip_id, user_id=None):
    """Get a specific trip, optionally scoped to a user."""
    query = Trip.query.filter_by(id=trip_id)
    if user_id:
        query = query.filter_by(user_id=user_id)
    return query.first()


def update_trip(trip, data):
    """Update an existing trip's fields."""
    for key, value in data.items():
        if hasattr(trip, key):
            setattr(trip, key, value)
    db.session.commit()
    return trip


def delete_trip(trip):
    """Delete a trip record."""
    db.session.delete(trip)
    db.session.commit()


def get_all_trips(page=1, per_page=20, mode=None, purpose=None):
    """Get all trips (scientists). Supports optional filters."""
    query = Trip.query

    if mode:
        query = query.filter(Trip.mode == mode)
    if purpose:
        query = query.filter(Trip.purpose == purpose)

    pagination = query.order_by(Trip.start_time.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return {
        "trips": [t.to_dict() for t in pagination.items],
        "total": pagination.total,
        "page": pagination.page,
        "per_page": pagination.per_page,
        "pages": pagination.pages,
    }
