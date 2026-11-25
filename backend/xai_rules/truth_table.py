
from typing import Any, Dict, List
import itertools

from backend.xai_rules.counterfactual import explain_rule


RULE_MESSAGES = {
    "R1": "Possible nitrogen shortage: review soil/plant test and crop-stage need.",
    "R2": "Possible phosphorus shortage: review soil test and crop-stage need.",
    "R3": "Possible potassium shortage: review soil test and crop-stage need.",
    "R4": "Irrigation condition met: check field conditions before irrigating.",
    "R5": "Possible waterlogging: inspect drainage and avoid extra irrigation pending checks.",
    "R6": "Soil acidity condition met: confirm pH and obtain a local lime recommendation.",
    "R7": "Soil alkalinity condition met: confirm soil condition and seek local advice.",
    "R8": "Possible combined heat and water stress: inspect crop and water availability.",
    "R9": "Weather-based disease-risk condition met: scout the crop; this is not disease confirmation.",
    "R10": "Disease and treatment-availability flags are confirmed: review registered options, label and IPM guidance."
}


FLAG_KEYS = [
    "N_REQUIREMENT_CONFIRMED",
    "P_REQUIREMENT_CONFIRMED",
    "K_REQUIREMENT_CONFIRMED",
    "IRRIGATION_REQUIRED",
    "WATERLOGGING_RISK",
    "ACIDITY_CONFIRMED",
    "ALKALINITY_CONFIRMED",
    "DISEASE_CONFIRMED",
    "REGISTERED_TREATMENT_AVAILABLE"
]


def evaluate_rules(
    sensor_data: Dict[str, Any],
    thresholds: Dict[str, Any]
) -> List[Dict[str, Any]]:

    results = []

    for i in range(1, 11):

        rule_name = f"R{i}"

        explanation = explain_rule(
            rule_name,
            sensor_data,
            thresholds
        )

        status = explanation["status"]

        if status == "TRUE":
            message = RULE_MESSAGES[rule_name]

        elif status == "FALSE":
            message = "Rule condition not met."

        else:
            message = (
                "Required input or threshold "
                "is missing/invalid."
            )

        results.append({
            "rule": rule_name,
            "status": status,
            "message": message,

            "remediation": {
                "required_changes":
                    explanation["required_changes"],

                "unmet_conditions":
                    explanation["unmet_conditions"],

                "unknown_conditions":
                    explanation["unknown_conditions"],

                "suggestions":
                    explanation["suggestions"]
            }
        })

    return results


def generate_truth_table(
    sensor_data: Dict[str, Any],
    thresholds: Dict[str, Any]
) -> List[Dict[str, Any]]:

    valid_current_state = all(
        isinstance(sensor_data.get(key), bool)
        for key in FLAG_KEYS
    )

    current_flags = [
        sensor_data.get(key)
        for key in FLAG_KEYS
    ]

    truth_table_array = []

    for combo in itertools.product(
        [False, True],
        repeat=len(FLAG_KEYS)
    ):

        test_data = dict(sensor_data)

        for key, value in zip(FLAG_KEYS, combo):
            test_data[key] = value

        evaluation = evaluate_rules(
            test_data,
            thresholds
        )

        is_active_state = (
            valid_current_state
            and list(combo) == current_flags
        )

        row = {
            "combination": dict(zip(FLAG_KEYS, combo)),
            "is_current_state": is_active_state
        }

        for result in evaluation:

            row[result["rule"]] = result["status"]

        truth_table_array.append(row)

    return truth_table_array
