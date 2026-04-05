import os
import json
import google.generativeai as genai
from app.services.analytics_service import (
    get_summary,
    get_modal_split,
    get_purpose_distribution,
)

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
GEMINI_MODEL = "gemini-2.5-flash"

def generate_insights(prompt=None):
    """Generate AI-powered planning insights using travel data and Gemini."""
    # Gather data context
    summary = get_summary()
    modal_split = get_modal_split()
    purpose_dist = get_purpose_distribution()

    data_context = f"""
Travel Data Summary:
- Total trips recorded: {summary['total_trips']}
- Total travellers: {summary['total_users']}
- Average trip distance: {summary['avg_distance_km']} km
- Total distance covered: {summary['total_distance_km']} km
- Average trip cost: ₹{summary['avg_cost_inr']}

Modal Split (transport modes):
{json.dumps(modal_split, indent=2)}

Trip Purpose Distribution:
{json.dumps(purpose_dist, indent=2)}
"""

    system_prompt = """You are an expert urban transportation planner working for NATPAC 
(National Transportation Planning and Research Centre) in India. Analyze the travel data 
provided and generate actionable planning recommendations.

Focus on:
1. Key patterns and trends in the data
2. Infrastructure improvement suggestions
3. Public transport optimization opportunities
4. Sustainability recommendations
5. Safety and accessibility improvements

Be specific, data-driven, and practical in your recommendations.
Format your response with clear sections and bullet points."""

    user_prompt = data_context
    if prompt:
        user_prompt += f"\n\nAdditional focus area requested by scientist:\n{prompt}"

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(
            f"{system_prompt}\n\n{user_prompt}",
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
            ),
        )
        return {
            "insights": response.text,
            "data_summary": summary,
            "model": GEMINI_MODEL,
        }
    except Exception as e:
        raise RuntimeError(f"Failed to generate insights: {str(e)}")
