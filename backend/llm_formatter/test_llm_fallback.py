"""Unit tests for fault-tolerant LLM fallback. Run: python -m unittest -v backend/llm_formatter/test_llm_fallback.py"""

import json
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

from openai import APITimeoutError, RateLimitError
from backend.llm_formatter import llm_client

MOCK_PATH = Path(__file__).resolve().parent.parent / "contract_mock.json"


class TestLLMFallback(unittest.TestCase):
    def setUp(self):
        with open(MOCK_PATH, "r", encoding="utf-8") as f:
            self.mock_contract = json.load(f)
        llm_client._CLIENT = None  # Reset singleton before each test

    def _assert_valid_markdown(self, md: str, latency: float):
        self.assertIn("### Diagnosis Summary", md)
        self.assertIn("### Agronomic Action Matrix", md)
        self.assertIn("| Agronomic Rule | Status |", md)
        self.assertIn("### Key Sensor Drivers (SHAP)", md)
        self.assertIn("- **Moisture (+0.45):**", md)
        self.assertLess(latency, 0.5)

    @patch.dict("os.environ", {"LLM_API_KEY": "", "OPENROUTER_API_KEY": ""}, clear=False)
    def test_missing_api_key_triggers_fallback(self):
        md, latency = llm_client.format_diagnosis_markdown(self.mock_contract)
        self._assert_valid_markdown(md, latency)

    @patch("backend.llm_formatter.llm_client.get_llm_client")
    @patch("backend.llm_formatter.llm_client._resolve_provider_config", return_value=("key", "url", "model"))
    def test_timeout_triggers_fallback(self, _mock_cfg, mock_get_client):
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = APITimeoutError(request=MagicMock())
        mock_get_client.return_value = mock_client

        md, latency = llm_client.format_diagnosis_markdown(self.mock_contract)
        self._assert_valid_markdown(md, latency)

    @patch("backend.llm_formatter.llm_client.get_llm_client")
    @patch("backend.llm_formatter.llm_client._resolve_provider_config", return_value=("key", "url", "model"))
    def test_rate_limit_429_triggers_fallback(self, _mock_cfg, mock_get_client):
        mock_client = MagicMock()
        mock_response = MagicMock()
        mock_response.status_code = 429
        mock_client.chat.completions.create.side_effect = RateLimitError(
            message="Rate limit exceeded", response=mock_response, body=None
        )
        mock_get_client.return_value = mock_client

        md, latency = llm_client.format_diagnosis_markdown(self.mock_contract)
        self._assert_valid_markdown(md, latency)


if __name__ == "__main__":
    unittest.main()