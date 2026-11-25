
import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
from PIL import Image

MODEL_PATH = "models/best_agri_finetuned.keras"
CLASS_PATH = "models/class_names.json"
IMAGE_SIZE = (224, 224)
LAST_CONV_LAYER = "Conv_1"


def load_model():
    return tf.keras.models.load_model(
        MODEL_PATH, compile=False
    )


def generate_gradcam(model, image_path):

    # Same preprocessing as predict.py
    image = tf.keras.utils.load_img(
        image_path, target_size=IMAGE_SIZE
    )

    image_array = tf.keras.utils.img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)

    image_array = (
        tf.keras.applications.mobilenet_v2.preprocess_input(
            image_array
        )
    )

    # Access MobileNetV2 backbone
    backbone = model.get_layer("mobilenetv2_1.00_224")

    feature_model = tf.keras.Model(
        inputs=backbone.inputs,
        outputs=[
            backbone.get_layer(LAST_CONV_LAYER).output,
            backbone.output
        ]
    )

    # Calculate gradients through classifier
    with tf.GradientTape() as tape:

        conv_outputs, features = feature_model(
    [image_array], training=False
)
        x = features

        for layer in model.layers[2:]:
            x = layer(x, training=False)

        predictions = x

        predicted_index = int(
            tf.argmax(predictions[0]).numpy()
        )

        class_score = predictions[:, predicted_index]

    gradients = tape.gradient(
        class_score, conv_outputs
    )

    if gradients is None:
        raise RuntimeError("Grad-CAM gradients not connected")

    weights = tf.reduce_mean(
        gradients, axis=(0, 1, 2)
    )

    heatmap = tf.reduce_sum(
        conv_outputs[0] * weights, axis=-1
    )

    heatmap = tf.maximum(heatmap, 0)

    heatmap = tf.math.divide_no_nan(
        heatmap, tf.reduce_max(heatmap)
    )

    with open(CLASS_PATH, "r") as file:
        class_names = json.load(file)

    disease = class_names[predicted_index]

    confidence = float(
        predictions[0][predicted_index]
    ) * 100

    return heatmap.numpy(), disease, confidence


def save_heatmap(heatmap, image_path, output_path):

    original = Image.open(image_path).convert("RGB")
    original = original.resize(IMAGE_SIZE)

    resized_heatmap = tf.image.resize(
        heatmap[..., np.newaxis],
        IMAGE_SIZE
    ).numpy().squeeze()

    plt.figure(figsize=(10, 5))

    plt.subplot(1, 2, 1)
    plt.imshow(original)
    plt.title("Original Leaf")
    plt.axis("off")

    plt.subplot(1, 2, 2)
    plt.imshow(original)
    plt.imshow(
        resized_heatmap,
        cmap="jet",
        alpha=0.45,
        vmin=0,
        vmax=1
    )
    plt.title("Grad-CAM Explanation")
    plt.axis("off")

    plt.tight_layout()
    plt.savefig(output_path, dpi=150)
    plt.close()

    print("Heatmap saved:", output_path)


if __name__ == "__main__":

    image_path = input("Enter leaf image path: ").strip().strip('"')
    print("Loading AgriShield model...")

    model = load_model()

    print("Generating Grad-CAM...")

    heatmap, disease, confidence = generate_gradcam(
        model, image_path
    )

    print("\nAGRISHIELD XAI RESULT")
    print("----------------------")
    print("Disease:", disease)
    print("Confidence:", round(confidence, 2), "%")

    save_heatmap(
        heatmap,
        image_path,
        "gradcam_result.png"
    )
