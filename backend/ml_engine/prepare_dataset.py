
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split

# Original color dataset location
DATASET_PATH = Path("data/raw/plantvillage dataset/color")

# CSV output location
OUTPUT_PATH = Path("data/processed/dataset_split.csv")

# Nine selected classes
SELECTED_CLASSES = [
    "Tomato___healthy",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Potato___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Corn_(maize)___healthy",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight"
]

records = []

print("AGRISHIELD DATASET PREPARATION")
print("--------------------------------")

# Collect image paths
for class_name in SELECTED_CLASSES:

    class_folder = DATASET_PATH / class_name

    if not class_folder.exists():
        print("Missing folder:", class_name)
        continue

    images = [
        file for file in class_folder.iterdir()
        if file.suffix.lower() in [".jpg", ".jpeg", ".png"]
    ]

    print(class_name, ":", len(images), "images")

    for image_path in images:
        records.append({
            "image_path": image_path.as_posix(),
            "label": class_name
        })

# Create dataframe
df = pd.DataFrame(records)

if df.empty:
    raise ValueError("No images found. Check the dataset path.")

# Split: 70% training, 15% validation, 15% testing
train_df, temp_df = train_test_split(
    df,
    test_size=0.30,
    random_state=42,
    stratify=df["label"]
)

val_df, test_df = train_test_split(
    temp_df,
    test_size=0.50,
    random_state=42,
    stratify=temp_df["label"]
)

train_df["split"] = "train"
val_df["split"] = "validation"
test_df["split"] = "test"

# Combine all splits
final_df = pd.concat(
    [train_df, val_df, test_df],
    ignore_index=True
)

# Save CSV
OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
final_df.to_csv(OUTPUT_PATH, index=False)

print("--------------------------------")
print("Total images:", len(final_df))
print("Training images:", len(train_df))
print("Validation images:", len(val_df))
print("Testing images:", len(test_df))
print("Number of classes:", final_df["label"].nunique())
print("CSV saved to:", OUTPUT_PATH)
print("--------------------------------")
print("Dataset preparation completed!")
