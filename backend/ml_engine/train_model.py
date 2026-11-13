
import json
from pathlib import Path

import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.utils.class_weight import compute_class_weight

# -----------------------------
# 1. Configuration
# -----------------------------

CSV_PATH = Path("data/processed/dataset_split.csv")
MODEL_DIR = Path("models")

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 5

MODEL_DIR.mkdir(parents=True, exist_ok=True)

print("AGRISHIELD MODEL TRAINING")
print("-----------------------------")

# -----------------------------
# 2. Load dataset CSV
# -----------------------------

df = pd.read_csv(CSV_PATH)

class_names = sorted(df["label"].unique())
class_to_index = {
    name: index for index, name in enumerate(class_names)
}

print("Number of classes:", len(class_names))
print("Classes:", class_names)

# Save class names for backend prediction
with open(MODEL_DIR / "class_names.json", "w") as file:
    json.dump(class_names, file, indent=4)

# -----------------------------
# 3. Separate dataset splits
# -----------------------------

train_df = df[df["split"] == "train"].copy()
val_df = df[df["split"] == "validation"].copy()

train_df["label_id"] = train_df["label"].map(class_to_index)
val_df["label_id"] = val_df["label"].map(class_to_index)

# Calculate class weights to help with imbalance
weights = compute_class_weight(
    class_weight="balanced",
    classes=np.arange(len(class_names)),
    y=train_df["label_id"].values
)

class_weights = {
    i: float(weight) for i, weight in enumerate(weights)
}

# -----------------------------
# 4. Image loading function
# -----------------------------

def load_image(image_path, label):

    image = tf.io.read_file(image_path)

    image = tf.io.decode_image(
        image,
        channels=3,
        expand_animations=False
    )

    image.set_shape([None, None, 3])

    image = tf.image.resize(image, IMAGE_SIZE)

    image = tf.keras.applications.mobilenet_v2.preprocess_input(
        image
    )

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
            buffer_size=len(dataframe),
            seed=42
        )

    dataset = dataset.map(
        load_image,
        num_parallel_calls=tf.data.AUTOTUNE
    )

    dataset = dataset.batch(BATCH_SIZE)

    dataset = dataset.prefetch(tf.data.AUTOTUNE)

    return dataset


train_ds = create_dataset(train_df, training=True)
val_ds = create_dataset(val_df)

# -----------------------------
# 5. Load MobileNetV2
# -----------------------------

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

# Initially freeze the pre-trained layers
base_model.trainable = False

# -----------------------------
# 6. Build classification model
# -----------------------------

inputs = tf.keras.Input(shape=(224, 224, 3))

x = base_model(inputs, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)

x = tf.keras.layers.Dropout(0.3)(x)

outputs = tf.keras.layers.Dense(
    len(class_names),
    activation="softmax"
)(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# -----------------------------
# 7. Train model
# -----------------------------

checkpoint = tf.keras.callbacks.ModelCheckpoint(
    filepath=str(MODEL_DIR / "best_agri_model.keras"),
    monitor="val_accuracy",
    save_best_only=True,
    mode="max"
)

early_stop = tf.keras.callbacks.EarlyStopping(
    monitor="val_loss",
    patience=2,
    restore_best_weights=True
)

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    class_weight=class_weights,
    callbacks=[checkpoint, early_stop]
)

# -----------------------------
# 8. Save final model
# -----------------------------

model.save(MODEL_DIR / "agri_model.keras")

print("-----------------------------")
print("MODEL TRAINING COMPLETED!")
print("Saved model:", MODEL_DIR / "agri_model.keras")
print("Saved class names:", MODEL_DIR / "class_names.json")
