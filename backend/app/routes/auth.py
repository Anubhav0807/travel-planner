from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.schemas.user_schema import validate_register, validate_login
from app.services.auth_service import register_user, login_user, refresh_access_token

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user."""
    data = request.get_json() or {}
    errors = validate_register(data)
    if errors:
        return jsonify({"ok": False, "message": "Please check your input.", "errors": errors}), 400

    try:
        user, tokens = register_user(data)
    except ValueError as e:
        return jsonify({"ok": False, "message": str(e)}), 409

    return jsonify({
        "ok": True,
        "message": f"Welcome aboard, {user['name']}! 🎉 Your account is ready.",
        "data": {"user": user, **tokens},
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """Log in an existing user."""
    data = request.get_json() or {}
    errors = validate_login(data)
    if errors:
        return jsonify({"ok": False, "message": "Please check your input.", "errors": errors}), 400

    try:
        user, tokens = login_user(data["email"], data["password"])
    except ValueError as e:
        return jsonify({"ok": False, "message": str(e)}), 401

    return jsonify({
        "ok": True,
        "message": f"Welcome back, {user['name']}! 👋",
        "data": {"user": user, **tokens},
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    """Refresh an access token."""
    user_id = get_jwt_identity()
    new_token = refresh_access_token(user_id)
    return jsonify({
        "ok": True,
        "message": "Token refreshed successfully.",
        "data": {"access_token": new_token},
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    """Log out (client should discard tokens)."""
    return jsonify({
        "ok": True,
        "message": "You've been logged out. See you next time! 👋",
    }), 200
