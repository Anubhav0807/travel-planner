from datetime import datetime, timezone
from app.extensions import db


# ── Valid enums ──────────────────────────────────────────────
TRAVEL_MODES = [
    "walk", "bicycle", "two_wheeler", "auto_rickshaw",
    "car", "taxi", "bus", "metro", "train", "other"
]

TRIP_PURPOSES = [
    "work", "education", "shopping", "recreation",
    "medical", "social", "religious", "personal_business", "other"
]

FREQUENCIES = [
    "daily", "weekly", "monthly", "occasionally", "one_time"
]


class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True)
    trip_number = db.Column(db.Integer, nullable=False)

    # Origin
    origin_lat = db.Column(db.Float, nullable=False)
    origin_lng = db.Column(db.Float, nullable=False)
    origin_address = db.Column(db.String(500), nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)

    # Destination
    dest_lat = db.Column(db.Float, nullable=False)
    dest_lng = db.Column(db.Float, nullable=False)
    dest_address = db.Column(db.String(500), nullable=True)
    end_time = db.Column(db.DateTime, nullable=False)

    # Trip details
    mode = db.Column(db.String(30), nullable=False)
    distance = db.Column(db.Float, nullable=False)  # in km
    purpose = db.Column(db.String(30), nullable=False)
    companions = db.Column(db.Integer, nullable=False, default=0)
    frequency = db.Column(db.String(20), nullable=False, default="one_time")
    cost = db.Column(db.Float, nullable=False, default=0.0)  # in INR

    # Metadata
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Client-side ID for offline sync
    client_id = db.Column(db.String(100), nullable=True, unique=True)

    def to_dict(self):
        return {
            "id": self.id,
            "trip_number": self.trip_number,
            "origin": {
                "lat": self.origin_lat,
                "lng": self.origin_lng,
                "address": self.origin_address,
            },
            "destination": {
                "lat": self.dest_lat,
                "lng": self.dest_lng,
                "address": self.dest_address,
            },
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "mode": self.mode,
            "distance": round(self.distance, 2),
            "purpose": self.purpose,
            "companions": self.companions,
            "frequency": self.frequency,
            "cost": round(self.cost, 2),
            "user_id": self.user_id,
            "client_id": self.client_id,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<Trip {self.id} by User {self.user_id}>"
