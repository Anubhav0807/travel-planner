from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from app.extensions import db
from app.models.user import User


def role_required(role):
    """Decorator that restricts access to users with a specific role."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = db.session.get(User, user_id)
            if not user:
                return jsonify({
                    "ok": False,
                    "message": "User not found.",
                }), 404
            if user.role != role:
                return jsonify({
                    "ok": False,
                    "message": f"This action requires the '{role}' role.",
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def scientist_required(fn):
    """Shortcut decorator for scientist-only endpoints."""
    return role_required("scientist")(fn)
