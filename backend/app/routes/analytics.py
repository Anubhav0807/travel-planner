from flask import Blueprint, jsonify
from app.utils.decorators import scientist_required
from app.services.analytics_service import (
    get_summary, get_modal_split, get_temporal_distribution,
    get_od_matrix, get_purpose_distribution,
)

analytics_bp = Blueprint("analytics", __name__)


@analytics_bp.route("/summary", methods=["GET"])
@scientist_required
def summary():
    """Dashboard KPI summary."""
    data = get_summary()
    return jsonify({"ok": True, "data": data}), 200


@analytics_bp.route("/modal-split", methods=["GET"])
@scientist_required
def modal_split():
    """Transport mode breakdown."""
    data = get_modal_split()
    return jsonify({"ok": True, "data": data}), 200


@analytics_bp.route("/temporal", methods=["GET"])
@scientist_required
def temporal():
    """Hourly trip distribution."""
    data = get_temporal_distribution()
    return jsonify({"ok": True, "data": data}), 200


@analytics_bp.route("/od-matrix", methods=["GET"])
@scientist_required
def od_matrix():
    """Top origin-destination pairs."""
    data = get_od_matrix()
    return jsonify({"ok": True, "data": data}), 200


@analytics_bp.route("/purpose", methods=["GET"])
@scientist_required
def purpose():
    """Trip purpose breakdown."""
    data = get_purpose_distribution()
    return jsonify({"ok": True, "data": data}), 200
