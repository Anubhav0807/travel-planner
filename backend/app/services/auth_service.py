from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.models.user import User


def register_user(data):
    """Register a new user. Returns (user_dict, tokens) or raises ValueError."""
    if User.query.filter_by(email=data["email"]).first():
        raise ValueError("Looks like that email is already taken. Try logging in instead?")

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data.get("phone"),
        role=data.get("role", "traveller"),
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    tokens = _create_tokens(user.id)
    return user.to_dict(), tokens


def login_user(email, password):
    """Authenticate a user. Returns (user_dict, tokens) or raises ValueError."""
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        raise ValueError("Invalid email or password. Please try again.")

    tokens = _create_tokens(user.id)
    return user.to_dict(), tokens


def refresh_access_token(user_id):
    """Create a new access token from a refresh token."""
    return create_access_token(identity=str(user_id))


def _create_tokens(user_id):
    return {
        "access_token": create_access_token(identity=str(user_id)),
        "refresh_token": create_refresh_token(identity=str(user_id)),
    }
