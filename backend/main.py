import json
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import SensorInput, DiagnosisOutput
from backend.llm_formatter import format_diagnosis_markdown

app = FastAPI(title="Crop Pest Expert System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to Vercel frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MOCK_CONTRACT_PATH = Path(__file__).resolve().parent / "contract_mock.json"


@app.get("/")
async def health_check():
    return {"status": "online", "phase": "Week 2 LLM Formatter Integrated"}


@app.post("/diagnose", response_model=DiagnosisOutput)
async def get_diagnosis(sensor_data: SensorInput):
    with open(MOCK_CONTRACT_PATH, "r", encoding="utf-8") as file:
        mock_data = json.load(file)

    markdown_report, _ = format_diagnosis_markdown(mock_data)
    mock_data["markdown_metrics"] = markdown_report
    return mock_data