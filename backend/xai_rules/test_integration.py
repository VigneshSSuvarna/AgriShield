
import unittest

import test_counterfactual

from backend.xai_rules.truth_table import (
    evaluate_rules,
    generate_truth_table
)

from backend.xai_rules.counterfactual import (
    generate_counterfactuals
)


class TestIntegration(unittest.TestCase):

    def setUp(self):

        sample = test_counterfactual.TestCounterfactual()
        sample.setUp()

        self.data = sample.data
        self.thresholds = sample.thresholds

    def test_truth_table_dimensions(self):

        table = generate_truth_table(
            self.data,
            self.thresholds
        )

        self.assertEqual(len(table), 512)

    def test_single_active_state(self):

        table = generate_truth_table(
            self.data,
            self.thresholds
        )

        active = [
            row for row in table
            if row["is_current_state"]
        ]

        self.assertEqual(len(active), 1)

    def test_missing_flag_active_state(self):

        del self.data["DISEASE_CONFIRMED"]

        table = generate_truth_table(
            self.data,
            self.thresholds
        )

        active = [
            row for row in table
            if row["is_current_state"]
        ]

        self.assertEqual(len(active), 0)

    def test_remediation_in_rule_output(self):

        results = evaluate_rules(
            self.data,
            self.thresholds
        )

        for result in results:

            self.assertIn("remediation", result)
            self.assertIn(
                "suggestions",
                result["remediation"]
            )

    def test_counterfactual_status_consistency(self):

        rules = evaluate_rules(
            self.data,
            self.thresholds
        )

        explanations = generate_counterfactuals(
            self.data,
            self.thresholds
        )

        for rule, explanation in zip(
            rules, explanations
        ):

            self.assertEqual(
                rule["rule"],
                explanation["rule"]
            )

            self.assertEqual(
                rule["status"],
                explanation["status"]
            )

    def test_active_row_matches_evaluation(self):

        table = generate_truth_table(
            self.data,
            self.thresholds
        )

        active = next(
            row for row in table
            if row["is_current_state"]
        )

        results = evaluate_rules(
            self.data,
            self.thresholds
        )

        for result in results:

            self.assertEqual(
                active[result["rule"]],
                result["status"]
            )

    def test_invalid_flag_active_state(self):

        self.data["DISEASE_CONFIRMED"] = "yes"

        table = generate_truth_table(
            self.data,
            self.thresholds
        )

        self.assertFalse(
            any(
                row["is_current_state"]
                for row in table
            )
        )


# Prevent unittest from discovering the imported
# counterfactual test class a second time.



if __name__ == "__main__":
    unittest.main()
