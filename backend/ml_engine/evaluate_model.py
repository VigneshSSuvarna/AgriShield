
import json
import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.metrics import (
    classification_report,
    confusion_matrix
)

CSV_PATH = "data/processed/dataset_split.csv"
MODEL_PATH = "models/best_agri_model.keras"
CLASS_PATH = "models/class_names.json"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

# Load model and class names
model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASS_PATH, "r") as file:
    class_names = json.load(file)

# Load only untouched test images
df = pd.read_csv(CSV_PATH)
test_df = df[df["split"] == "test"].copy()

class_to_index = {
    name: index for index, name in enumerate(class_names)
}

y_true = test_df["label"].map(class_to_index).values

def load_image(path, label):
    image = tf.io.read_file(path)
    image = tf.io.decode_image(
        image, channels=3, expand_animations=False
    )
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, IMAGE_SIZE)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image, label

dataset = tf.data.Dataset.from_tensor_slices(
    (test_df["image_path"].values, y_true)
)

dataset = dataset.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
)

dataset = dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# Evaluate
loss, accuracy = model.evaluate(dataset, verbose=1)

print("\nAGRISHIELD TEST RESULTS")
print("-----------------------------")
print(f"Test Accuracy: {accuracy * 100:.2f}%")
print(f"Test Loss: {loss:.4f}")

# Generate predictions
predictions = model.predict(dataset, verbose=1)
y_pred = np.argmax(predictions, axis=1)

print("\nCLASSIFICATION REPORT")
print(classification_report(
    y_true,
    y_pred,
    labels=list(range(len(class_names))),
    target_names=class_names,
    zero_division=0
))

print("\nCONFUSION MATRIX")
print(confusion_matrix(y_true, y_pred))

print("\nTesting completed!")
