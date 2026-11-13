
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.ml_engine.predict import predict_disease
import tempfile
import os

app = FastAPI(title="AgriShield API")

# Allow frontend development server to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "AgriShield API is running!"
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image file."
        )

    image_data = await file.read()

    if len(image_data) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image must be smaller than 10 MB."
        )

    if not image_data:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".jpg"
        ) as temp_file:
            temp_file.write(image_data)
            temp_path = temp_file.name

        result = predict_disease(temp_path)

        return {
            "success": True,
            "prediction": result["prediction"],
            "confidence": result["confidence"]
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Prediction failed. Please check the image."
        )

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
