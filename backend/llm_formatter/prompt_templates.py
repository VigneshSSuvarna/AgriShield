import json
from typing import Any, Dict, List

AGRISHIELD_SYSTEM_PROMPT = """Return ONLY 3 concise Markdown bullet points explaining the sensor drivers (no intro/outro, no code fences):
- **<feature> (<impact>):** <4-6 word agronomic interpretation>"""


def build_diagnosis_messages(contract_data: Dict[str, Any]) -> List[Dict[str, str]]:
    payload = {
        "prediction": contract_data.get("prediction"),
        "shap_drivers": contract_data.get("shap_drivers"),
    }
    return [
        {"role": "system", "content": AGRISHIELD_SYSTEM_PROMPT},
        {"role": "user", "content": json.dumps(payload, separators=(",", ":"))},
    ]


def assemble_markdown_report(contract_data: Dict[str, Any], llm_driver_bullets: str) -> str:
    """Combines deterministic GFM tables/metrics with LLM-generated agronomic synthesis."""
    prediction = contract_data.get("prediction", "Unknown")
    probs: Dict[str, float] = contract_data.get("probabilities", {})
    flags: List[Dict[str, str]] = contract_data.get("truth_table_flags", [])

    top_conf = max(probs.values(), default=0.0) * 100
    prob_lines = "\n".join(
        f"  - **{label}:** {score * 100:.0f}%" for label, score in probs.items()
    )
    table_rows = "\n".join(
        f"| {item.get('rule', '')} | {item.get('status', '')} |" for item in flags
    )

    return (
        f"### Diagnosis Summary\n"
        f"- **Primary Prediction:** {prediction} ({top_conf:.0f}% confidence)\n"
        f"- **Risk Breakdown:**\n"
        f"{prob_lines}\n\n"
        f"### Agronomic Action Matrix\n"
        f"| Agronomic Rule | Status |\n"
        f"| :--- | :--- |\n"
        f"{table_rows}\n\n"
        f"### Key Sensor Drivers (SHAP)\n"
        f"{llm_driver_bullets.strip()}"
    )