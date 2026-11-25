
import json
import time
from pathlib import Path

import numpy as np
import tensorflow as tf

PROJECT_ROOT = Path(__file__).resolve().parents[2]

MODEL_PATH = PROJECT_ROOT / "models" / "best_agri_finetuned.keras"
CLASS_PATH = PROJECT_ROOT / "models" / "class_names.json"

IMAGE_SIZE = (224, 224)
LAST_CONV_LAYER = "Conv_1"


class GradCAMService:

    def __init__(self):

        start = time.perf_counter()

        print("Initializing Grad-CAM service...")

        # Load model only once per service instance
        self.model = tf.keras.models.load_model(
            MODEL_PATH,
            compile=False
        )

        # Load class names only once
        with open(CLASS_PATH, "r", encoding="utf-8") as file:
            self.class_names = json.load(file)

        # Access MobileNetV2 backbone
        backbone = self.model.get_layer(
            "mobilenetv2_1.00_224"
        )

        # Build feature extractor only once
        self.feature_model = tf.keras.Model(
            inputs=backbone.inputs,
            outputs=[
                backbone.get_layer(LAST_CONV_LAYER).output,
                backbone.output
            ]
        )

        self.initialization_time = round(
            time.perf_counter() - start, 3
        )

        print("Grad-CAM service initialized.")
        print("Initialization time:",
              self.initialization_time, "seconds")

    def generate(self, image_path):

        start = time.perf_counter()

        image = tf.keras.utils.load_img(
            image_path,
            target_size=IMAGE_SIZE
        )

        image_array = tf.keras.utils.img_to_array(image)

        image_array = np.expand_dims(
            image_array, axis=0
        )

        image_array = (
            tf.keras.applications.mobilenet_v2
            .preprocess_input(image_array)
        )

        with tf.GradientTape() as tape:

            conv_outputs, features = self.feature_model(
                [image_array],
                training=False
            )

            x = features

            for layer in self.model.layers[2:]:
                x = layer(x, training=False)

            predictions = x

            predicted_index = int(
                tf.argmax(predictions[0]).numpy()
            )

            class_score = predictions[:, predicted_index]

        gradients = tape.gradient(
            class_score,
            conv_outputs
        )

        if gradients is None:
            raise RuntimeError(
                "Grad-CAM gradients not connected"
            )

        weights = tf.reduce_mean(
            gradients, axis=(0, 1, 2)
        )

        heatmap = tf.reduce_sum(
            conv_outputs[0] * weights,
            axis=-1
        )

        heatmap = tf.maximum(heatmap, 0)

        heatmap = tf.math.divide_no_nan(
            heatmap,
            tf.reduce_max(heatmap)
        )

        heatmap = heatmap.numpy()

        if not np.isfinite(heatmap).all():
            raise RuntimeError("Invalid heatmap values")

        confidence = float(
            predictions[0][predicted_index]
        ) * 100

        return {
            "prediction": self.class_names[predicted_index],
            "confidence": round(confidence, 2),
            "heatmap": heatmap.tolist(),
            "heatmap_shape": list(heatmap.shape),
            "heatmap_nonzero": bool(np.any(heatmap > 0)),
            "execution_time": round(
                time.perf_counter() - start, 3
            )
        }


if __name__ == "__main__":

    service = GradCAMService()

    while True:

        image_path = input(
            "\nEnter leaf image path (or exit): "
        ).strip().strip('"')

        if image_path.lower() == "exit":
            break

        try:
            result = service.generate(image_path)

            print("\nAGRISHIELD OPTIMIZED XAI")
            print("------------------------")
            print("Disease:", result["prediction"])
            print("Confidence:", result["confidence"], "%")
            print("Heatmap shape:", result["heatmap_shape"])
            print("Nonzero heatmap:", result["heatmap_nonzero"])
            print("Execution time:",
                  result["execution_time"], "seconds")

        except Exception as error:
            print("Error:", error)
