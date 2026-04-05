from flask import Blueprint, request, jsonify
from app.utils.decorators import scientist_required
from app.services.gemini_service import generate_insights

insights_bp = Blueprint("insights", __name__)


@insights_bp.route("/generate", methods=["POST"])
@scientist_required
def generate():
    """Generate AI planning insights using Gemini."""
    body = request.get_json(silent=True) or {}
    prompt = body.get("prompt")

    try:
        result = generate_insights(prompt)
    except RuntimeError as e:
        return jsonify({"ok": False, "message": str(e)}), 503

    return jsonify({
        "ok": True,
        "message": "Insights generated successfully! 🤖",
        "data": result,
    }), 200
