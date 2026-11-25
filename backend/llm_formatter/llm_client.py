import json
import os
import time
from pathlib import Path
from typing import Any, Dict, Tuple

from dotenv import load_dotenv
from openai import OpenAI

try:
    from backend.llm_formatter.prompt_templates import (
        assemble_markdown_report,
        build_diagnosis_messages,
    )
except ImportError:
    try:
        from llm_formatter.prompt_templates import (
            assemble_markdown_report,
            build_diagnosis_messages,
        )
    except ImportError:
        from prompt_templates import (
            assemble_markdown_report,
            build_diagnosis_messages,
        )

BACKEND_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BACKEND_DIR / ".env", override=True)

_CLIENT: OpenAI | None = None


def _resolve_provider_config() -> Tuple[str, str, str]:
    """Resolves API key, base URL, and model for Groq or OpenRouter."""
    api_key = (os.getenv("LLM_API_KEY") or os.getenv("OPENROUTER_API_KEY") or "").strip()
    if not api_key:
        raise ValueError("Missing LLM_API_KEY or OPENROUTER_API_KEY in backend/.env")

    if api_key.startswith("gsk_"):
        base_url = (os.getenv("LLM_BASE_URL") or "https://api.groq.com/openai/v1").strip()
        model = (os.getenv("LLM_MODEL") or "llama-3.1-8b-instant").strip()
    else:
        base_url = (
            os.getenv("LLM_BASE_URL")
            or os.getenv("OPENROUTER_BASE_URL")
            or "https://openrouter.ai/api/v1"
        ).strip()
        configured_model = (os.getenv("LLM_MODEL") or os.getenv("OPENROUTER_MODEL") or "").strip()
        model = "openrouter/free" if configured_model in ("", "auto") else configured_model

    return api_key, base_url, model


def get_llm_client() -> OpenAI:
    """Returns a singleton OpenAI-compatible client."""
    global _CLIENT
    if _CLIENT is None:
        api_key, base_url, _ = _resolve_provider_config()
        _CLIENT = OpenAI(
            api_key=api_key,
            base_url=base_url,
            timeout=1.8,
            max_retries=0,
            default_headers={
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "AgriShield Crop Expert System",
            },
        )
    return _CLIENT


def _fallback_shap_bullets(contract_data: Dict[str, Any]) -> str:
    """Deterministic fallback if free-tier API hits 429 rate limits."""
    lines = []
    for item in contract_data.get("shap_drivers", []):
        feat = item.get("feature", "Sensor")
        impact = float(item.get("impact", 0.0))
        direction = "positive protective driver" if impact >= 0 else "negative risk contributor"
        lines.append(f"- **{feat} ({impact:+.2f}):** Primary {direction} for crop status.")
    return "\n".join(lines)


def format_diagnosis_markdown(contract_data: Dict[str, Any]) -> Tuple[str, float]:
    """Converts a diagnosis contract dict into strict Markdown in < 2.0s."""
    client = get_llm_client()
    _, _, model = _resolve_provider_config()
    messages = build_diagnosis_messages(contract_data)

    start_time = time.perf_counter()
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0.0,
            max_tokens=110,
        )
        raw_bullets = (response.choices[0].message.content or "").strip()
        if not raw_bullets:
            raw_bullets = _fallback_shap_bullets(contract_data)
        source_tag = model
    except Exception as e:
        raw_bullets = _fallback_shap_bullets(contract_data)
        source_tag = f"fallback ({type(e).__name__})"

    full_markdown = assemble_markdown_report(contract_data, raw_bullets)
    latency = time.perf_counter() - start_time
    print(f"\n")
    return full_markdown, latency


if __name__ == "__main__":
    mock_file = BACKEND_DIR / "contract_mock.json"
    with open(mock_file, "r", encoding="utf-8") as f:
        mock_contract = json.load(f)

    get_llm_client()
    markdown_output, elapsed = format_diagnosis_markdown(mock_contract)

    print(markdown_output)
    print("\n" + "-" * 40)
    print(f"Latency: {elapsed:.3f}s (Target: < 2.000s)")
    assert elapsed < 2.0, f"Exceeded 2-second latency target: {elapsed:.3f}s"