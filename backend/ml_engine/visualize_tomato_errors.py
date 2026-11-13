
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image

CSV_PATH = "data/processed/tomato_errors.csv"
OUTPUT_PATH = "data/processed/tomato_error_samples.png"

df = pd.read_csv(CSV_PATH)

# Select up to 3 examples from each actual/predicted combination
samples = (
    df.groupby(["label", "predicted_label"], group_keys=False)
      .head(3)
      .reset_index(drop=True)
)

cols = 3
rows = (len(samples) + cols - 1) // cols

fig, axes = plt.subplots(rows, cols, figsize=(15, rows * 4))
axes = axes.flatten()

for i, (_, item) in enumerate(samples.iterrows()):
    image = Image.open(item["image_path"]).convert("RGB")
    axes[i].imshow(image)
    axes[i].set_title(
        f"Actual: {item['label'].replace('Tomato___', '')}\n"
        f"Predicted: {item['predicted_label'].replace('Tomato___', '')}",
        fontsize=9
    )
    axes[i].axis("off")

for i in range(len(samples), len(axes)):
    axes[i].axis("off")

plt.tight_layout()
plt.savefig(OUTPUT_PATH, dpi=120)
print("Saved image sheet:", OUTPUT_PATH)
plt.show()
