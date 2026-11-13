
import pandas as pd
import numpy as np
from sklearn.utils.class_weight import compute_class_weight

df = pd.read_csv("data/processed/dataset_split.csv")

class_names = sorted(df["label"].unique())

train_df = df[df["split"] == "train"].copy()

class_to_index = {name: i for i, name in enumerate(class_names)}
train_df["label_id"] = train_df["label"].map(class_to_index)

weights = compute_class_weight(
    class_weight="balanced",
    classes=np.arange(len(class_names)),
    y=train_df["label_id"].values
)

summary = pd.crosstab(df["label"], df["split"])

print("\nALL NINE CLASSES")
print(summary.to_string())

print("\nCLASS WEIGHTS")
for i, name in enumerate(class_names):
    print(f"{name}: {weights[i]:.4f}")

print("\nTOTAL CLASSES:", len(class_names))
