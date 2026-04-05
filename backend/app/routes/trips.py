from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from app.schemas.trip_schema import validate_trip_create, validate_trip_update, validate_batch_sync
from app.services.trip_service import (
    create_trip, batch_sync_trips, get_user_trips,
    get_trip_by_id, update_trip, delete_trip, get_all_trips,
)
from app.utils.decorators import scientist_required

trips_bp = Blueprint("trips", __name__)


@trips_bp.route("", methods=["POST"])
@jwt_required()
def create():
    """Create a new trip."""
    data = request.get_json() or {}
    errors = validate_trip_create(data)
    if errors:
        return jsonify({"ok": False, "message": "Please check your trip details.", "errors": errors}), 400

    try:
        trip = create_trip(get_jwt_identity(), data)
    except ValueError as e:
        return jsonify({"ok": False, "message": str(e)}), 422

    return jsonify({
        "ok": True,
        "message": f"Trip #{trip.trip_number} recorded successfully! 📍",
        "data": trip.to_dict(),
    }), 201


@trips_bp.route("/batch", methods=["POST"])
@jwt_required()
def batch_sync():
    """Batch sync trips from offline mobile app."""
    data = request.get_json() or {}
    errors = validate_batch_sync(data)
    if errors:
        return jsonify({"ok": False, "message": "Invalid batch data.", "errors": errors}), 400

    created, skipped = batch_sync_trips(get_jwt_identity(), data["trips"])

    return jsonify({
        "ok": True,
        "message": f"Synced {len(created)} trip(s). {len(skipped)} duplicate(s) skipped.",
        "data": {"created": created, "skipped": skipped},
    }), 201


@trips_bp.route("", methods=["GET"])
@jwt_required()
def list_trips():
    """Get paginated trip list. Scientists see all trips, travellers see their own."""
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 20, type=int)
    per_page = min(per_page, 100)

    if current_user.role == "scientist":
        mode = request.args.get("mode")
        purpose = request.args.get("purpose")
        result = get_all_trips(page, per_page, mode, purpose)
    else:
        result = get_user_trips(get_jwt_identity(), page, per_page)

    start = (result["page"] - 1) * result["per_page"] + 1
    end = start + len(result["trips"]) - 1

    return jsonify({
        "ok": True,
        "message": f"Showing trips {start}–{end} of {result['total']}." if result["total"] else "No trips found yet. Start recording!",
        "data": result,
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["GET"])
@jwt_required()
def get_one(trip_id):
    """Get a single trip."""
    user_id = None if current_user.role == "scientist" else get_jwt_identity()
    trip = get_trip_by_id(trip_id, user_id)
    if not trip:
        return jsonify({"ok": False, "message": "Trip not found."}), 404

    return jsonify({"ok": True, "data": trip.to_dict()}), 200


@trips_bp.route("/<int:trip_id>", methods=["PUT"])
@jwt_required()
def update_one(trip_id):
    """Update a trip."""
    trip = get_trip_by_id(trip_id, get_jwt_identity())
    if not trip:
        return jsonify({"ok": False, "message": "Trip not found."}), 404

    data = request.get_json() or {}
    errors = validate_trip_update(data)
    if errors:
        return jsonify({"ok": False, "message": "Please check your input.", "errors": errors}), 400

    trip = update_trip(trip, data)
    return jsonify({
        "ok": True,
        "message": "Trip updated successfully! ✏️",
        "data": trip.to_dict(),
    }), 200


@trips_bp.route("/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_one(trip_id):
    """Delete a trip."""
    trip = get_trip_by_id(trip_id, get_jwt_identity())
    if not trip:
        return jsonify({"ok": False, "message": "Trip not found."}), 404

    delete_trip(trip)
    return jsonify({"ok": True, "message": "Trip deleted. 🗑️"}), 200
