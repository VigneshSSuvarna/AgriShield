
import json
import numpy as np
import tensorflow as tf

# Model settings
MODEL_PATH = "models/best_agri_finetuned.keras"
CLASS_PATH = "models/class_names.json"
IMAGE_SIZE = (224, 224)

# Load trained model
model = tf.keras.models.load_model(MODEL_PATH)

# Load class names
with open(CLASS_PATH, "r") as file:
    class_names = json.load(file)


def predict_disease(image_path):
    # Read image
    image = tf.keras.utils.load_img(
        image_path,
        target_size=IMAGE_SIZE
    )

    # Convert image into array
    image_array = tf.keras.utils.img_to_array(image)

    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)

    # Apply MobileNetV2 preprocessing
    image_array = tf.keras.applications.mobilenet_v2.preprocess_input(
        image_array
    )

    # Predict
    predictions = model.predict(image_array, verbose=0)

    # Get predicted class
    predicted_index = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_index]) * 100

    predicted_class = class_names[predicted_index]

    return {
        "prediction": predicted_class,
        "confidence": round(confidence, 2)
    }


if __name__ == "__main__":
    image_path = input("Enter leaf image path: ")

    result = predict_disease(image_path)

    print("\nAGRISHIELD PREDICTION")
    print("--------------------")
    print("Disease:", result["prediction"])
    print("Confidence:", str(result["confidence"]) + "%")
