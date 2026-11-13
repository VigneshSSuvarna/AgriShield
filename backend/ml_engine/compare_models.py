
import json
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

CSV_PATH = "data/processed/dataset_split.csv"

MODEL_PATHS = {
    "Original baseline": "models/agri_model.keras",
    "Fine-tuned": "models/best_agri_finetuned.keras"
}

# Load class names and test data
with open("models/class_names.json") as f:
    class_names = json.load(f)

df = pd.read_csv(CSV_PATH)
df = df[df["split"] == "test"].copy()

class_to_index = {
    name: i for i, name in enumerate(class_names)
}

df["label_id"] = df["label"].map(class_to_index)

# Same preprocessing as training and evaluation
def load_image(path):
    image = tf.io.read_file(path)
    image = tf.io.decode_image(
        image, channels=3, expand_animations=False
    )
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, (224, 224))
    image = tf.keras.applications.mobilenet_v2.preprocess_input(
        image
    )
    return image

test_ds = tf.data.Dataset.from_tensor_slices(
    df["image_path"].values
)

test_ds = test_ds.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
).batch(32).prefetch(tf.data.AUTOTUNE)

y_true = df["label_id"].values

# Compare both models
for model_name, model_path in MODEL_PATHS.items():

    print("\n" + "=" * 55)
    print(model_name)
    print("=" * 55)

    model = tf.keras.models.load_model(model_path)

    probabilities = model.predict(test_ds, verbose=1)
    y_pred = np.argmax(probabilities, axis=1)

    accuracy = accuracy_score(y_true, y_pred)

    print(f"\nTest Accuracy: {accuracy * 100:.2f}%")

    print("\nCLASSIFICATION REPORT")
    print(classification_report(
        y_true,
        y_pred,
        labels=np.arange(len(class_names)),
        target_names=class_names,
        zero_division=0
    ))

    print("\nCONFUSION MATRIX")
    print(confusion_matrix(
        y_true,
        y_pred,
        labels=np.arange(len(class_names))
    ))
