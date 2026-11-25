import argparse
from pathlib import Path

import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "data" / "raw" / "crop_pest"
OUTPUT_PATH = ROOT / "data" / "processed" / "processed_crop_pest.csv"

CROP_FILE = RAW_DIR / "Crop_recommendation.csv"
PEST_FILE = RAW_DIR / "RICE.csv"


def median_impute(df: pd.DataFrame, numeric_columns: list[str]) -> pd.DataFrame:
    for column in numeric_columns:
        if column in df.columns:
            df[column] = pd.to_numeric(df[column], errors="coerce")

    imputer = SimpleImputer(strategy="median")
    available = [column for column in numeric_columns if column in df.columns]
    if available:
        df[available] = imputer.fit_transform(df[available])
    return df


def balance_with_smote(
    df: pd.DataFrame,
    feature_columns: list[str],
    target_column: str,
) -> pd.DataFrame:
    counts = df[target_column].value_counts()
    if len(counts) < 2 or counts.nunique() == 1:
        return df

    X = df[feature_columns].to_numpy(dtype=float)
    y = df[target_column].astype(str)
    minority_count = int(counts.min())
    k_neighbors = min(5, max(1, minority_count - 1))

    smote = SMOTE(random_state=42, k_neighbors=k_neighbors)
    X_balanced, y_balanced = smote.fit_resample(X, y)

    balanced = pd.DataFrame(X_balanced, columns=feature_columns)
    balanced[target_column] = y_balanced

    metadata_columns = [c for c in df.columns if c not in feature_columns + [target_column]]
    if metadata_columns:
        for column in metadata_columns:
            balanced[column] = df[column].mode().iloc[0] if not df[column].mode().empty else ""
    return balanced


def process_crop_data() -> pd.DataFrame:
    crop = pd.read_csv(CROP_FILE)
    renamed = pd.DataFrame({
        "nitrogen_mgkg": crop["N"],
        "phosphorus_mgkg": crop["P"],
        "potassium_mgkg": crop["K"],
        "temperature_c": crop["temperature"],
        "humidity_pct": crop["humidity"],
        "ph": crop["ph"],
        "rainfall_mm": crop["rainfall"],
        "label": crop["label"].astype(str).str.strip().str.lower(),
        "crop_label": crop["label"].astype(str).str.strip().str.lower(),
        "pest_name": "",
        "source": "Kaggle crop recommendation",
    })

    features = [
        "nitrogen_mgkg", "phosphorus_mgkg", "potassium_mgkg",
        "temperature_c", "humidity_pct", "ph", "rainfall_mm",
    ]
    renamed = median_impute(renamed, features)
    renamed = balance_with_smote(renamed, features, "label")
    return renamed


def process_pest_data() -> pd.DataFrame:
    pest = pd.read_csv(PEST_FILE)
    pest.columns = [column.strip() for column in pest.columns]

    max_temperature = pd.to_numeric(pest.get("MaxT"), errors="coerce")
    min_temperature = pd.to_numeric(pest.get("MinT"), errors="coerce")
    rh1 = pd.to_numeric(pest.get("RH1(%)"), errors="coerce")
    rh2 = pd.to_numeric(pest.get("RH2(%)"), errors="coerce")

    pest_data = pd.DataFrame({
        "temperature_c": (max_temperature + min_temperature) / 2,
        "humidity_pct": (rh1 + rh2) / 2,
        "rainfall_mm": pd.to_numeric(pest.get("RF(mm)"), errors="coerce"),
        "pest_value": pd.to_numeric(pest.get("Pest Value"), errors="coerce"),
        "wind_speed_kmph": pd.to_numeric(pest.get("WS(kmph)"), errors="coerce"),
        "sunshine_hours": pd.to_numeric(pest.get("SSH(hrs)"), errors="coerce"),
        "evaporation_mm": pd.to_numeric(pest.get("EVP(mm)"), errors="coerce"),
        "observation_year": pd.to_numeric(pest.get("Observation Year"), errors="coerce"),
        "standard_week": pd.to_numeric(pest.get("Standard Week"), errors="coerce"),
        "collection_type": pest.get("Collection Type").fillna("unknown").astype(str).str.strip(),
        "pest_name": pest.get("PEST NAME").fillna("unknown").astype(str).str.strip(),
        "location": pest.get("Location").fillna("unknown").astype(str).str.strip(),
        "label": pest.get("PEST NAME").fillna("unknown").astype(str).str.strip(),
        "crop_label": "",
        "source": "Kaggle rice pest and diseases",
    })

    features = [
        "temperature_c", "humidity_pct", "rainfall_mm", "pest_value",
        "wind_speed_kmph", "sunshine_hours", "evaporation_mm",
        "observation_year", "standard_week",
    ]
    pest_data = median_impute(pest_data, features)
    pest_data = balance_with_smote(pest_data, features, "label")
    return pest_data


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Download inputs and produce the standardized, balanced crop/pest dataset."
    )
    parser.add_argument("--smote", action="store_true", help="Apply SMOTE (enabled by default)")
    args = parser.parse_args()

    if not CROP_FILE.exists():
        raise FileNotFoundError(
            f"Missing {CROP_FILE}. Download atharvaingle/crop-recommendation-dataset."
        )
    if not PEST_FILE.exists():
        raise FileNotFoundError(
            f"Missing {PEST_FILE}. Download zsinghrahulk/rice-pest-and-diseases."
        )

    crop = process_crop_data()
    pest = process_pest_data()
    combined = pd.concat([crop, pest], ignore_index=True, sort=False)

    common_columns = [
        "label", "crop_label", "pest_name", "source",
        "nitrogen_mgkg", "phosphorus_mgkg", "potassium_mgkg",
        "temperature_c", "humidity_pct", "ph", "rainfall_mm",
        "pest_value", "wind_speed_kmph", "sunshine_hours",
        "evaporation_mm", "observation_year", "standard_week",
        "collection_type", "location",
    ]
    combined = combined[[column for column in common_columns if column in combined.columns]]
    for column in combined.select_dtypes(include=["object", "string"]).columns:
        combined[column] = combined[column].fillna("not_applicable")
        combined[column] = combined[column].replace(r"^\s*$", "not_applicable", regex=True)
    combined = combined.fillna(0)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    combined.to_csv(OUTPUT_PATH, index=False)

    print(f"Processed crop rows: {len(crop):,}")
    print(f"Processed pest rows: {len(pest):,}")
    print(f"Combined rows: {len(combined):,}")
    print(f"Saved: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
