from sqlalchemy import func, extract
from app.extensions import db
from app.models.trip import Trip, TRAVEL_MODES
from app.models.user import User
from app.models.zone import Zone


def get_summary():
    """Dashboard KPIs."""
    total_trips = Trip.query.count()
    total_users = User.query.filter_by(role="traveller").count()
    avg_distance = db.session.query(func.avg(Trip.distance)).scalar() or 0
    total_distance = db.session.query(func.sum(Trip.distance)).scalar() or 0
    avg_cost = db.session.query(func.avg(Trip.cost)).scalar() or 0

    return {
        "total_trips": total_trips,
        "total_users": total_users,
        "avg_distance_km": round(float(avg_distance), 2),
        "total_distance_km": round(float(total_distance), 2),
        "avg_cost_inr": round(float(avg_cost), 2),
    }


def get_modal_split():
    """Breakdown of trips by transport mode."""
    results = (
        db.session.query(Trip.mode, func.count(Trip.id))
        .group_by(Trip.mode)
        .all()
    )
    total = sum(count for _, count in results)
    return [
        {
            "mode": mode,
            "count": count,
            "percentage": round((count / total) * 100, 1) if total else 0,
        }
        for mode, count in results
    ]


def get_temporal_distribution():
    """Hourly distribution of trip start times."""
    results = (
        db.session.query(
            extract("hour", Trip.start_time).label("hour"),
            func.count(Trip.id),
        )
        .group_by("hour")
        .order_by("hour")
        .all()
    )

    # Fill all 24 hours
    hour_map = {int(hour): count for hour, count in results}
    return [
        {"hour": h, "count": hour_map.get(h, 0)}
        for h in range(24)
    ]


def get_od_matrix(limit=20):
    """Top origin-destination pairs."""
    results = (
        db.session.query(
            Trip.origin_address,
            Trip.dest_address,
            func.count(Trip.id).label("trip_count"),
            func.avg(Trip.distance).label("avg_distance"),
        )
        .filter(Trip.origin_address.isnot(None), Trip.dest_address.isnot(None))
        .group_by(Trip.origin_address, Trip.dest_address)
        .order_by(func.count(Trip.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "origin": row.origin_address,
            "destination": row.dest_address,
            "trip_count": row.trip_count,
            "avg_distance_km": round(float(row.avg_distance), 2),
        }
        for row in results
    ]


def get_purpose_distribution():
    """Breakdown of trips by purpose."""
    results = (
        db.session.query(Trip.purpose, func.count(Trip.id))
        .group_by(Trip.purpose)
        .all()
    )
    total = sum(count for _, count in results)
    return [
        {
            "purpose": purpose,
            "count": count,
            "percentage": round((count / total) * 100, 1) if total else 0,
        }
        for purpose, count in results
    ]
