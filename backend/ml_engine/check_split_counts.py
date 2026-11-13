
import pandas as pd

df = pd.read_csv("data/processed/dataset_split.csv")

print("\nCLASS DISTRIBUTION BY DATASET SPLIT\n")

summary = pd.crosstab(
    df["label"],
    df["split"]
)

print(summary.to_string())

print("\nTOTAL IMAGES IN EACH SPLIT\n")
print(df["split"].value_counts())

print("\nTOMATO CLASS TOTALS\n")
tomato = df[df["label"].str.startswith("Tomato")]
print(tomato.groupby(["label", "split"]).size().to_string())
