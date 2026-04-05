from app.extensions import db


class Zone(db.Model):
    """Traffic Analysis Zone for OD matrix computations."""
    __tablename__ = "zones"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False, unique=True)
    min_lat = db.Column(db.Float, nullable=False)
    max_lat = db.Column(db.Float, nullable=False)
    min_lng = db.Column(db.Float, nullable=False)
    max_lng = db.Column(db.Float, nullable=False)

    def contains(self, lat, lng):
        return (
            self.min_lat <= lat <= self.max_lat
            and self.min_lng <= lng <= self.max_lng
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "bounds": {
                "min_lat": self.min_lat,
                "max_lat": self.max_lat,
                "min_lng": self.min_lng,
                "max_lng": self.max_lng,
            },
        }

    def __repr__(self):
        return f"<Zone {self.name}>"
