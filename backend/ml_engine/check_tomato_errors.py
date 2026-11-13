
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.metrics import classification_report

CSV_PATH = "data/processed/dataset_split.csv"
MODEL_PATH = "models/agri_model.keras"

df = pd.read_csv(CSV_PATH)
df = df[df["split"] == "test"].copy()

with open("models/class_names.json") as f:
    names = json.load(f)

class_to_index = {name: i for i, name in enumerate(names)}

df["label_id"] = df["label"].map(class_to_index)

def load_image(path):
    image = tf.io.read_file(path)
    image = tf.io.decode_image(
        image, channels=3, expand_animations=False
    )
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, (224, 224))
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image

model = tf.keras.models.load_model(MODEL_PATH)

dataset = tf.data.Dataset.from_tensor_slices(
    df["image_path"].values
)

dataset = dataset.map(
    load_image,
    num_parallel_calls=tf.data.AUTOTUNE
).batch(32)

predictions = model.predict(dataset, verbose=1)
df["predicted_id"] = np.argmax(predictions, axis=1)
df["confidence"] = np.max(predictions, axis=1) * 100

df["predicted_label"] = df["predicted_id"].map(
    lambda i: names[i]
)

tomato = df[df["label"].str.startswith("Tomato")]

errors = tomato[
    tomato["label"] != tomato["predicted_label"]
]

print("\nTOMATO TEST RESULTS")
print("Total:", len(tomato))
print("Incorrect:", len(errors))
print("\nMISCLASSIFIED IMAGES")

print(errors[
    ["image_path", "label", "predicted_label", "confidence"]
].to_string(index=False))

errors.to_csv(
    "data/processed/tomato_errors.csv",
    index=False
)

print("\nSaved: data/processed/tomato_errors.csv")
