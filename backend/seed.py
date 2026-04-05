"""Seed the database with sample users and trips for development."""
import sys
import io

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

from datetime import datetime, timezone, timedelta
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.trip import Trip
from app.models.zone import Zone

app = create_app()


def seed():
    with app.app_context():
        print("[*] Seeding database...")

        # -- Users --
        traveller = User.query.filter_by(email="traveller@example.com").first()
        if not traveller:
            traveller = User(name="Priya Sharma", email="traveller@example.com", phone="9876543210", role="traveller")
            traveller.set_password("travel123!")
            db.session.add(traveller)
            print("  [+] Created traveller: traveller@example.com / travel123!")

        scientist = User.query.filter_by(email="scientist@natpac.gov.in").first()
        if not scientist:
            scientist = User(name="Dr. Rajesh Kumar", email="scientist@natpac.gov.in", phone="9123456780", role="scientist")
            scientist.set_password("science123!")
            db.session.add(scientist)
            print("  [+] Created scientist: scientist@natpac.gov.in / science123!")

        db.session.commit()

        # -- Zones --
        zones_data = [
            {"name": "Thiruvananthapuram Central", "min_lat": 8.47, "max_lat": 8.52, "min_lng": 76.92, "max_lng": 76.97},
            {"name": "Kochi Metro Area", "min_lat": 9.93, "max_lat": 10.05, "min_lng": 76.22, "max_lng": 76.35},
            {"name": "Kozhikode City", "min_lat": 11.22, "max_lat": 11.30, "min_lng": 75.75, "max_lng": 75.82},
        ]
        for z in zones_data:
            if not Zone.query.filter_by(name=z["name"]).first():
                db.session.add(Zone(**z))
                print(f"  [+] Created zone: {z['name']}")
        db.session.commit()

        # -- Trips --
        if Trip.query.filter_by(user_id=traveller.id).count() == 0:
            now = datetime.now(timezone.utc)
            trips = [
                {"trip_number": 1, "origin_lat": 8.5241, "origin_lng": 76.9366, "origin_address": "Thiruvananthapuram Central Station", "dest_lat": 8.5074, "dest_lng": 76.9730, "dest_address": "Technopark, TVM", "start_time": now - timedelta(days=7, hours=2), "end_time": now - timedelta(days=7, hours=1, minutes=30), "mode": "bus", "distance": 12.5, "purpose": "work", "companions": 0, "frequency": "daily", "cost": 25.0},
                {"trip_number": 2, "origin_lat": 8.5074, "origin_lng": 76.9730, "origin_address": "Technopark, TVM", "dest_lat": 8.5241, "dest_lng": 76.9366, "dest_address": "Thiruvananthapuram Central Station", "start_time": now - timedelta(days=6, hours=2), "end_time": now - timedelta(days=6, hours=1, minutes=25), "mode": "bus", "distance": 12.5, "purpose": "work", "companions": 1, "frequency": "daily", "cost": 25.0},
                {"trip_number": 3, "origin_lat": 8.5241, "origin_lng": 76.9366, "origin_address": "TVM Central", "dest_lat": 8.4875, "dest_lng": 76.9525, "dest_address": "Kovalam Beach", "start_time": now - timedelta(days=5, hours=3), "end_time": now - timedelta(days=5, hours=2, minutes=20), "mode": "auto_rickshaw", "distance": 8.2, "purpose": "recreation", "companions": 3, "frequency": "weekly", "cost": 180.0},
                {"trip_number": 4, "origin_lat": 9.9816, "origin_lng": 76.2999, "origin_address": "Ernakulam Junction", "dest_lat": 10.0261, "dest_lng": 76.3086, "dest_address": "Lulu Mall, Kochi", "start_time": now - timedelta(days=3, hours=1), "end_time": now - timedelta(days=3, minutes=40), "mode": "metro", "distance": 5.4, "purpose": "shopping", "companions": 2, "frequency": "monthly", "cost": 40.0},
                {"trip_number": 5, "origin_lat": 10.0261, "origin_lng": 76.3086, "origin_address": "Lulu Mall, Kochi", "dest_lat": 9.9816, "dest_lng": 76.2999, "dest_address": "Ernakulam Junction", "start_time": now - timedelta(days=2, hours=4), "end_time": now - timedelta(days=2, hours=3, minutes=35), "mode": "metro", "distance": 5.4, "purpose": "shopping", "companions": 2, "frequency": "monthly", "cost": 40.0},
                {"trip_number": 6, "origin_lat": 8.5241, "origin_lng": 76.9366, "origin_address": "TVM Central", "dest_lat": 8.5550, "dest_lng": 76.8814, "dest_address": "Medical College, TVM", "start_time": now - timedelta(days=2, hours=2), "end_time": now - timedelta(days=2, hours=1, minutes=40), "mode": "car", "distance": 7.8, "purpose": "medical", "companions": 1, "frequency": "occasionally", "cost": 0.0},
                {"trip_number": 7, "origin_lat": 11.2588, "origin_lng": 75.7804, "origin_address": "Kozhikode Beach", "dest_lat": 11.2483, "dest_lng": 75.8340, "dest_address": "NIT Calicut", "start_time": now - timedelta(days=1, hours=6), "end_time": now - timedelta(days=1, hours=5, minutes=15), "mode": "two_wheeler", "distance": 22.0, "purpose": "education", "companions": 0, "frequency": "daily", "cost": 50.0},
                {"trip_number": 8, "origin_lat": 8.5241, "origin_lng": 76.9366, "origin_address": "TVM Central", "dest_lat": 8.5008, "dest_lng": 76.9528, "dest_address": "Attukal Temple", "start_time": now - timedelta(hours=10), "end_time": now - timedelta(hours=9, minutes=45), "mode": "walk", "distance": 1.8, "purpose": "religious", "companions": 2, "frequency": "weekly", "cost": 0.0},
                {"trip_number": 9, "origin_lat": 8.5241, "origin_lng": 76.9366, "origin_address": "TVM Central", "dest_lat": 8.5074, "dest_lng": 76.9730, "dest_address": "Technopark, TVM", "start_time": now - timedelta(hours=5), "end_time": now - timedelta(hours=4, minutes=25), "mode": "taxi", "distance": 12.5, "purpose": "work", "companions": 0, "frequency": "occasionally", "cost": 320.0},
                {"trip_number": 10, "origin_lat": 8.5074, "origin_lng": 76.9730, "origin_address": "Technopark, TVM", "dest_lat": 8.5241, "dest_lng": 76.9366, "dest_address": "TVM Central", "start_time": now - timedelta(hours=1), "end_time": now - timedelta(minutes=25), "mode": "bus", "distance": 12.5, "purpose": "work", "companions": 0, "frequency": "daily", "cost": 25.0},
            ]
            for t in trips:
                db.session.add(Trip(user_id=traveller.id, **t))
            db.session.commit()
            print(f"  [+] Created {len(trips)} sample trips")

        print("\n[OK] Seeding complete!")


if __name__ == "__main__":
    seed()
