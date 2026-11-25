
import unittest
import copy

from backend.xai_rules.counterfactual import (
    explain_rule,
    generate_counterfactuals
)


class TestCounterfactual(unittest.TestCase):

    def setUp(self):

        self.data = {
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
            "DISEASE_CONFIRMED": True,
            "REGISTERED_TREATMENT_AVAILABLE": False
        }

        self.thresholds = {
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

    def explain(self, rule):

        return explain_rule(
            rule,
            self.data,
            self.thresholds
        )

    # Test 1
    def test_all_ten_rules(self):

        results = generate_counterfactuals(
            self.data,
            self.thresholds
        )

        self.assertEqual(len(results), 10)

    # Test 2
    def test_satisfied_rule(self):

        result = self.explain("R1")

        self.assertEqual(result["status"], "TRUE")
        self.assertEqual(result["required_changes"], 0)

    # Test 3
    def test_single_unmet_flag(self):

        result = self.explain("R10")

        self.assertEqual(result["status"], "FALSE")
        self.assertEqual(result["required_changes"], 1)

        self.assertEqual(
            result["unmet_conditions"][0]["feature"],
            "REGISTERED_TREATMENT_AVAILABLE"
        )

    # Test 4
    def test_multiple_unmet_conditions(self):

        self.data["N"] = 40
        self.data["N_REQUIREMENT_CONFIRMED"] = False

        result = self.explain("R1")

        self.assertEqual(result["status"], "FALSE")
        self.assertEqual(result["required_changes"], 2)

    # Test 5
    def test_missing_sensor_value(self):

        del self.data["N"]

        result = self.explain("R1")

        self.assertEqual(result["status"], "UNKNOWN")
        self.assertEqual(
            len(result["unknown_conditions"]), 1
        )

    # Test 6
    def test_missing_threshold(self):

        del self.thresholds["N_CRITICAL"]

        result = self.explain("R1")

        self.assertEqual(result["status"], "UNKNOWN")

    # Test 7
    def test_invalid_boolean_flag(self):

        self.data["N_REQUIREMENT_CONFIRMED"] = "yes"

        result = self.explain("R1")

        self.assertEqual(result["status"], "UNKNOWN")

    # Test 8
    def test_invalid_numeric_value(self):

        self.data["N"] = "invalid"

        result = self.explain("R1")

        self.assertEqual(result["status"], "UNKNOWN")

    # Test 9
    def test_strict_threshold_boundary(self):

        self.data["N"] = 30

        result = self.explain("R1")

        self.assertEqual(result["status"], "FALSE")

    # Test 10
    def test_inclusive_threshold_boundary(self):

        self.data["water_depletion"] = 0.50

        result = self.explain("R4")

        self.assertEqual(result["status"], "TRUE")

    # Test 11
    def test_non_finite_input(self):

        self.data["N"] = float("nan")

        result = self.explain("R1")

        self.assertEqual(result["status"], "UNKNOWN")

    # Test 12
    def test_input_data_not_modified(self):

        original_data = copy.deepcopy(self.data)
        original_thresholds = copy.deepcopy(self.thresholds)

        generate_counterfactuals(
            self.data,
            self.thresholds
        )

        self.assertEqual(self.data, original_data)
        self.assertEqual(
            self.thresholds, original_thresholds
        )

    # Test 13
    def test_false_and_unknown_conditions(self):

        self.data["N"] = 40
        del self.data["N_REQUIREMENT_CONFIRMED"]

        result = self.explain("R1")

        self.assertEqual(result["status"], "FALSE")
        self.assertEqual(len(result["unmet_conditions"]), 1)
        self.assertEqual(len(result["unknown_conditions"]), 1)

    # Test 14
    def test_temperature_range(self):

        self.data["Temp"] = 30

        result = self.explain("R9")

        self.assertEqual(result["status"], "TRUE")


if __name__ == "__main__":
    unittest.main()
