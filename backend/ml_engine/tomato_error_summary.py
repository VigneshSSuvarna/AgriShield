
import pandas as pd

df = pd.read_csv("data/processed/tomato_errors.csv")

print("\nACTUAL LABEL vs PREDICTED LABEL")
summary = (
    df.groupby(["label", "predicted_label"])
      .size()
      .reset_index(name="count")
      .sort_values("count", ascending=False)
)

print(summary.to_string(index=False))

print("\nERRORS BY ACTUAL CLASS")
print(df["label"].value_counts().to_string())

print("\nERRORS BY PREDICTED CLASS")
print(df["predicted_label"].value_counts().to_string())
