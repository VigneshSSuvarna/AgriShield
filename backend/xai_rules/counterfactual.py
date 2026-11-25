
import math
import operator


# Numeric comparison operators
OPERATORS = {
    "<": operator.lt,
    ">": operator.gt,
    ">=": operator.ge,
    "<=": operator.le
}


# Conditions matching the existing Boolean rules
RULE_CONDITIONS = {
    "R1": [
        ("N", "<", "N_CRITICAL"),
        ("N_REQUIREMENT_CONFIRMED", "flag", True)
    ],
    "R2": [
        ("P", "<", "P_CRITICAL"),
        ("P_REQUIREMENT_CONFIRMED", "flag", True)
    ],
    "R3": [
        ("K", "<", "K_CRITICAL"),
        ("K_REQUIREMENT_CONFIRMED", "flag", True)
    ],
    "R4": [
        ("water_depletion", ">=", "RAW_THRESHOLD"),
        ("IRRIGATION_REQUIRED", "flag", True)
    ],
    "R5": [
        ("Moisture", ">=", "M_WATERLOGGING"),
        ("WATERLOGGING_RISK", "flag", True)
    ],
    "R6": [
        ("Soil_pH", "<", "PH_MIN_CROP"),
        ("ACIDITY_CONFIRMED", "flag", True)
    ],
    "R7": [
        ("Soil_pH", ">", "PH_MAX_CROP"),
        ("ALKALINITY_CONFIRMED", "flag", True)
    ],
    "R8": [
        ("Temp", ">", "T_MAX_CROP"),
        ("Moisture", "<", "M_STRESS_CROP")
    ],
    "R9": [
        ("Humidity", ">", "H_DISEASE_THRESHOLD"),
        ("Temp", ">=", "T_MIN_PATHOGEN"),
        ("Temp", "<=", "T_MAX_PATHOGEN")
    ],
    "R10": [
        ("DISEASE_CONFIRMED", "flag", True),
        ("REGISTERED_TREATMENT_AVAILABLE", "flag", True)
    ]
}


def valid_number(value):

    if value is None or isinstance(value, bool):
        raise ValueError("Invalid numeric input")

    number = float(value)

    if not math.isfinite(number):
        raise ValueError("Non-finite numeric input")

    return number


def check_condition(condition, sensor_data, thresholds):

    feature, operation, target = condition

    current_value = sensor_data.get(feature)

    # Boolean confirmation condition
    if operation == "flag":

        if not isinstance(current_value, bool):
            return {
                "feature": feature,
                "status": "UNKNOWN",
                "required": True,
                "message": f"Verify the missing or invalid flag: {feature}"
            }

        satisfied = current_value is target

        return {
            "feature": feature,
            "current_value": current_value,
            "required": target,
            "status": "TRUE" if satisfied else "FALSE",
            "message": (
                "Condition satisfied."
                if satisfied
                else f"{feature} must be independently verified as TRUE."
            )
        }

    # Numeric threshold condition
    try:

        current = valid_number(current_value)
        required = valid_number(thresholds.get(target))

    except (ValueError, TypeError, OverflowError):

        return {
            "feature": feature,
            "status": "UNKNOWN",
            "threshold": target,
            "message": f"Verify numeric inputs: {feature} and {target}"
        }

    satisfied = OPERATORS[operation](current, required)

    return {
        "feature": feature,
        "current_value": current,
        "operator": operation,
        "threshold": target,
        "required_value": required,
        "status": "TRUE" if satisfied else "FALSE",
        "message": (
            "Condition satisfied."
            if satisfied
            else f"Rule activation requires {feature} {operation} {required}."
        )
    }


def explain_rule(rule_name, sensor_data, thresholds):

    if rule_name not in RULE_CONDITIONS:
        raise ValueError(f"Unknown rule: {rule_name}")

    conditions = [
        check_condition(condition, sensor_data, thresholds)
        for condition in RULE_CONDITIONS[rule_name]
    ]

    unmet = [
        condition for condition in conditions
        if condition["status"] == "FALSE"
    ]

    unknown = [
        condition for condition in conditions
        if condition["status"] == "UNKNOWN"
    ]

    if unmet:
        status = "FALSE"

    elif unknown:
        status = "UNKNOWN"

    else:
        status = "TRUE"

    suggestions = [
        condition["message"]
        for condition in unmet + unknown
    ]

    return {
        "rule": rule_name,
        "status": status,
        "conditions": conditions,
        "unmet_conditions": unmet,
        "unknown_conditions": unknown,
        "required_changes": len(unmet),
        "suggestions": suggestions
    }


def generate_counterfactuals(sensor_data, thresholds):

    return [
        explain_rule(rule, sensor_data, thresholds)
        for rule in RULE_CONDITIONS
    ]


if __name__ == "__main__":

    sensor_data = {
        "N": 40,
        "P": 15,
        "K": 18,
        "Soil_pH": 5.0,
        "Temp": 36,
        "Humidity": 85,
        "Moisture": 15,
        "water_depletion": 0.60,

        "N_REQUIREMENT_CONFIRMED": False,
        "P_REQUIREMENT_CONFIRMED": True,
        "K_REQUIREMENT_CONFIRMED": True,
        "IRRIGATION_REQUIRED": True,
        "WATERLOGGING_RISK": False,
        "ACIDITY_CONFIRMED": True,
        "ALKALINITY_CONFIRMED": False,
        "DISEASE_CONFIRMED": True,
        "REGISTERED_TREATMENT_AVAILABLE": False
    }

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

    results = generate_counterfactuals(
        sensor_data,
        thresholds
    )

    print("\nAGRISHIELD COUNTERFACTUAL EXPLANATION")
    print("--------------------------------------")

    for result in results:

        print("\nRule:", result["rule"])
        print("Status:", result["status"])
        print("Unmet conditions:", result["required_changes"])

        if result["suggestions"]:

            for suggestion in result["suggestions"]:
                print("-", suggestion)

        else:
            print("All conditions satisfied.")

    print("\nTotal rules explained:", len(results))
