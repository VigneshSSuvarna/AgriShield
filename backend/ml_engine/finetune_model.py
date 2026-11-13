
import json
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.utils.class_weight import compute_class_weight

# Configuration
CSV_PATH = Path("data/processed/dataset_split.csv")
MODEL_PATH = Path("models/agri_model.keras")
MODEL_DIR = Path("models")

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 8
LEARNING_RATE = 0.00001

print("AGRISHIELD FINE-TUNING")
print("-----------------------------")

# Load dataset
df = pd.read_csv(CSV_PATH)

with open(MODEL_DIR / "class_names.json") as f:
    class_names = json.load(f)

class_to_index = {
    name: i for i, name in enumerate(class_names)
}

train_df = df[df["split"] == "train"].copy()
val_df = df[df["split"] == "validation"].copy()

train_df["label_id"] = train_df["label"].map(class_to_index)
val_df["label_id"] = val_df["label"].map(class_to_index)

# Calculate class weights
weights = compute_class_weight(
    class_weight="balanced",
    classes=np.arange(len(class_names)),
    y=train_df["label_id"].values
)

class_weights = {
    i: float(weight) for i, weight in enumerate(weights)
}

# Image loading
def load_image(image_path, label):
    image = tf.io.read_file(image_path)
    image = tf.io.decode_image(
        image, channels=3, expand_animations=False
    )
    image.set_shape([None, None, 3])
    image = tf.image.resize(image, IMAGE_SIZE)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    return image, label


def create_dataset(dataframe, training=False):
    dataset = tf.data.Dataset.from_tensor_slices(
        (
            dataframe["image_path"].values,
            dataframe["label_id"].values
        )
    )

    if training:
        dataset = dataset.shuffle(
            len(dataframe), seed=42
        )

    dataset = dataset.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )

    return dataset.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)


train_ds = create_dataset(train_df, training=True)
val_ds = create_dataset(val_df)

# Load original baseline model
model = tf.keras.models.load_model(MODEL_PATH)

# Access MobileNetV2 feature extractor
base_model = model.get_layer("mobilenetv2_1.00_224")

# Freeze all layers first
base_model.trainable = True

for layer in base_model.layers:
    layer.trainable = False

# Unfreeze only the upper layers
for layer in base_model.layers[134:]:
    layer.trainable = True

# Keep Batch Normalization layers frozen
for layer in base_model.layers:
    if isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = False

print("Total MobileNetV2 layers:", len(base_model.layers))
print("Trainable MobileNetV2 layers:",
      sum(layer.trainable for layer in base_model.layers))

# Compile with a low learning rate
model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=LEARNING_RATE
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

# Save best fine-tuned checkpoint separately
checkpoint = tf.keras.callbacks.ModelCheckpoint(
    filepath=str(MODEL_DIR / "best_agri_finetuned.keras"),
    monitor="val_accuracy",
    save_best_only=True,
    mode="max"
)

early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True
)

# Fine-tune
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=[checkpoint, early_stop]
)

# Save final experimental model
model.save(MODEL_DIR / "agri_finetuned.keras")

print("-----------------------------")
print("FINE-TUNING COMPLETED!")
print("Saved: models/agri_finetuned.keras")
print("Best checkpoint: models/best_agri_finetuned.keras")
