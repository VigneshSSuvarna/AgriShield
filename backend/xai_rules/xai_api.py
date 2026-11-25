
import json
import tempfile
import os

from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from .xai_service import XAIService


# Load XAI service once during server startup
@asynccontextmanager
async def lifespan(app: FastAPI):

    app.state.xai_service = XAIService()

    yield


app = FastAPI(
    title="AgriShield XAI API",
    version="1.0.0",
    description="Grad-CAM and Boolean Rules Integration",
    lifespan=lifespan
)


@app.get("/")
def home():

    return {
        "message": "AgriShield XAI API is running",
        "status": "ready"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "xai_service": "initialized"
    }


@app.post("/xai/diagnose")
def diagnose(
    image: UploadFile = File(...),
    sensor_data: str = Form(...),
    thresholds: str = Form(...)
):

    temp_path = None

    try:

        # Convert JSON strings into dictionaries
        try:
            sensors = json.loads(sensor_data)
            limits = json.loads(thresholds)

        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid JSON input"
            )

        if not isinstance(sensors, dict) or not isinstance(limits, dict):
            raise HTTPException(
                status_code=400,
                detail="Sensor data and thresholds must be JSON objects"
            )

        # Require valid Boolean confirmation flags
        flags = [
            "N_REQUIREMENT_CONFIRMED",
            "P_REQUIREMENT_CONFIRMED",
            "K_REQUIREMENT_CONFIRMED",
            "IRRIGATION_REQUIRED",
            "WATERLOGGING_RISK",
            "ACIDITY_CONFIRMED",
            "ALKALINITY_CONFIRMED",
            "DISEASE_CONFIRMED",
            "REGISTERED_TREATMENT_AVAILABLE"
        ]

        for flag in flags:
            if not isinstance(sensors.get(flag), bool):
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing or invalid Boolean flag: {flag}"
                )

        # Validate image extension
        extension = os.path.splitext(
            image.filename or ""
        )[1].lower()

        if extension not in [".jpg", ".jpeg", ".png"]:
            raise HTTPException(
                status_code=400,
                detail="Only JPG, JPEG and PNG images are supported"
            )

        # Limit image size to 10 MB
        content = image.file.read(10 * 1024 * 1024 + 1)

        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="Image exceeds 10 MB"
            )

        # Save uploaded image temporarily
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_file.write(content)
            temp_path = temp_file.name

        # Run combined XAI diagnosis
        result = app.state.xai_service.diagnose(
            temp_path,
            sensors,
            limits
        )

        return result

    except HTTPException:
        raise

    except Exception as error:

        print("Diagnosis error:", error)

        raise HTTPException(
            status_code=500,
            detail="XAI diagnosis failed"
        )

    finally:

        image.file.close()

        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
