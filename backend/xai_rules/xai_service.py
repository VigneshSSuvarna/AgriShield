
import json
import time

from .gradcam_service import GradCAMService
from .truth_table import evaluate_rules, generate_truth_table


class XAIService:

    def __init__(self):

        print("Initializing AgriShield XAI Service...")

        self.gradcam = GradCAMService()

        print("XAI Service ready.")

    def diagnose(self, image_path, sensor_data, thresholds):

        start = time.perf_counter()

        # Image prediction and explanation
        image_result = self.gradcam.generate(image_path)

        # Evaluate all 10 Boolean rules
        rule_results = evaluate_rules(
            sensor_data,
            thresholds
        )

        # Generate all 512 truth table combinations
        truth_table = generate_truth_table(
            sensor_data,
            thresholds
        )

        # Count rule statuses
        summary = {
            "total_rules": len(rule_results),
            "true": sum(
                r["status"] == "TRUE" for r in rule_results
            ),
            "false": sum(
                r["status"] == "FALSE" for r in rule_results
            ),
            "unknown": sum(
                r["status"] == "UNKNOWN" for r in rule_results
            )
        }

        # Collect active recommendations
        recommendations = [
            r["message"]
            for r in rule_results
            if r["status"] == "TRUE"
        ]

        # Combined JSON-compatible result
        return {
            "image_analysis": image_result,
            "truth_table_flags": rule_results,
            "rule_summary": summary,
            "recommendations": recommendations,
            "truth_table": truth_table,
            "total_truth_table_rows": len(truth_table),
            "execution_time": round(
                time.perf_counter() - start, 3
            )
        }


if __name__ == "__main__":

    # Example sensor readings for software testing
    sensor_data = {
        "N": 20,
        "P": 15,
        "K": 18,
        "Soil_pH": 5.0,
        "Temp": 36,
        "Humidity": 85,
        "Moisture": 15,
        "water_depletion": 0.60,

        "N_REQUIREMENT_CONFIRMED": True,
        "P_REQUIREMENT_CONFIRMED": True,
        "K_REQUIREMENT_CONFIRMED": True,
        "IRRIGATION_REQUIRED": True,
        "WATERLOGGING_RISK": False,
        "ACIDITY_CONFIRMED": True,
        "ALKALINITY_CONFIRMED": False,
        "DISEASE_CONFIRMED": False,
        "REGISTERED_TREATMENT_AVAILABLE": False
    }

    # Illustrative thresholds for testing only
    thresholds = {
        "N_CRITICAL": 30,
        "P_CRITICAL": 20,
        "K_CRITICAL": 25,
        "RAW_THRESHOLD": 0.50,
        "M_WATERLOGGING": 80,
        "PH_MIN_CROP": 5.5,
        "PH_MAX_CROP": 7.0,
        "T_MAX_CROP": 34,
        "M_STRESS_CROP": 20,
        "H_DISEASE_THRESHOLD": 80,
        "T_MIN_PATHOGEN": 20,
        "T_MAX_PATHOGEN": 30
    }

    service = XAIService()

    image_path = input(
        "\nEnter leaf image path: "
    ).strip().strip('"')

    result = service.diagnose(
        image_path,
        sensor_data,
        thresholds
    )

    print("\nAGRISHIELD COMBINED XAI RESULT")
    print("--------------------------------")

    print("Prediction:",
          result["image_analysis"]["prediction"])

    print("Confidence:",
          result["image_analysis"]["confidence"], "%")

    print("\nBOOLEAN RULE RESULTS")

    for rule in result["truth_table_flags"]:
        print(rule["rule"], ":", rule["status"])

    print("\nRULE SUMMARY")
    print(json.dumps(result["rule_summary"], indent=4))

    print("\nRECOMMENDATIONS")

    for recommendation in result["recommendations"]:
        print("-", recommendation)

    print("\nTruth table rows:",
          result["total_truth_table_rows"])

    print("Execution time:",
          result["execution_time"], "seconds")

    # Save complete diagnostic result
    with open("xai_result.json", "w", encoding="utf-8") as file:
        json.dump(result, file, indent=4, allow_nan=False)

    print("\nComplete result saved to xai_result.json")
