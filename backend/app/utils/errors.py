from flask import jsonify


def register_error_handlers(app):
    """Register friendly JSON error handlers."""

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({
            "ok": False,
            "message": str(e.description) if hasattr(e, "description") else "Bad request. Please check your input.",
            "error": "bad_request",
        }), 400

    @app.errorhandler(401)
    def unauthorized(e):
        return jsonify({
            "ok": False,
            "message": "You need to log in to access this resource.",
            "error": "unauthorized",
        }), 401

    @app.errorhandler(403)
    def forbidden(e):
        return jsonify({
            "ok": False,
            "message": "You don't have permission to do that.",
            "error": "forbidden",
        }), 403

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({
            "ok": False,
            "message": "We couldn't find what you were looking for.",
            "error": "not_found",
        }), 404

    @app.errorhandler(422)
    def unprocessable(e):
        return jsonify({
            "ok": False,
            "message": str(e.description) if hasattr(e, "description") else "Could not process your request.",
            "error": "unprocessable_entity",
        }), 422

    @app.errorhandler(429)
    def rate_limited(e):
        return jsonify({
            "ok": False,
            "message": "Slow down! You're making requests too fast. Please wait a moment.",
            "error": "rate_limited",
        }), 429

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({
            "ok": False,
            "message": "Something went wrong on our end. We're looking into it!",
            "error": "internal_error",
        }), 500
