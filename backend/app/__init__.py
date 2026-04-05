import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv()


def create_app(testing=False):
    app = Flask(__name__)

    # ── Config ───────────────────────────────────────────────
    if testing:
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    else:
        app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-fallback-key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600        # 1 hour
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = 2592000    # 30 days
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    # ── Extensions ───────────────────────────────────────────
    from app.extensions import db, jwt, cors, limiter

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    limiter.init_app(app)

    # ── Blueprints ───────────────────────────────────────────
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp
    from app.routes.trips import trips_bp
    from app.routes.analytics import analytics_bp
    from app.routes.insights import insights_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(trips_bp, url_prefix="/api/trips")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(insights_bp, url_prefix="/api/insights")

    # ── Error handlers ───────────────────────────────────────
    from app.utils.errors import register_error_handlers
    register_error_handlers(app)

    # ── JWT callbacks ────────────────────────────────────────
    from app.models.user import User

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user if isinstance(user, int) else user.id

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return db.session.get(User, identity)

    # ── Create tables ────────────────────────────────────────
    with app.app_context():
        from app.models import user, trip, zone  # noqa: F401
        db.create_all()

    # ── Health check ─────────────────────────────────────────
    @app.route("/api/health")
    def health():
        return {"ok": True, "message": "NATPAC Travel API is running 🚀"}

    return app
