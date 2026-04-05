import bcrypt
from datetime import datetime, timezone
from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(
        db.String(20), nullable=False, default="traveller"
    )  # traveller | scientist
    created_at = db.Column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at = db.Column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    trips = db.relationship("Trip", backref="user", lazy="dynamic", cascade="all, delete-orphan")

    # ── Password helpers ─────────────────────────────────────
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(
            password.encode("utf-8"), self.password_hash.encode("utf-8")
        )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<User {self.email}>"
