import os

DATASET_PATH = "data/raw/plantvillage dataset/color"

print("AGRISHIELD DATASET INSPECTION")
print("--------------------------------")

for folder in sorted(os.listdir(DATASET_PATH)):
    folder_path = os.path.join(DATASET_PATH, folder)

    if os.path.isdir(folder_path):
        images = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png"))
        ]

        print(f"{folder}: {len(images)} images")

print("--------------------------------")
print("Dataset inspection completed!")