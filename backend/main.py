import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import SensorInput, DiagnosisOutput

app = FastAPI(title="Crop Pest Expert System API")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/diagnose", response_model=DiagnosisOutput)
async def get_diagnosis(sensor_data: SensorInput):
    # Load and return the mock JSON contract for Phase 1 parallel development
    with open("contract_mock.json", "r") as file:
        mock_data = json.load(file)
    return mock_data