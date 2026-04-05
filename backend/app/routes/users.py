from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, current_user
from app.extensions import db
from app.schemas.user_schema import validate_profile_update

users_bp = Blueprint("users", __name__)


@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    """Get current user's profile."""
    return jsonify({
        "ok": True,
        "data": current_user.to_dict(),
    }), 200


@users_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update current user's profile."""
    data = request.get_json() or {}
    errors = validate_profile_update(data)
    if errors:
        return jsonify({"ok": False, "message": "Please check your input.", "errors": errors}), 400

    if "name" in data:
        current_user.name = data["name"]
    if "phone" in data:
        current_user.phone = data["phone"]

    db.session.commit()

    return jsonify({
        "ok": True,
        "message": "Profile updated successfully! ✅",
        "data": current_user.to_dict(),
    }), 200


@users_bp.route("/me", methods=["DELETE"])
@jwt_required()
def delete_account():
    """Delete account and all data (DSAR compliance)."""
    trip_count = current_user.trips.count()
    db.session.delete(current_user)
    db.session.commit()

    return jsonify({
        "ok": True,
        "message": f"Your account and {trip_count} trip record(s) have been permanently deleted. "
                   "We're sorry to see you go. 💙",
    }), 200
