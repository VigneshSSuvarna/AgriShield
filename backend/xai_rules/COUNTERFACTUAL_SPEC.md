
# AgriShield - Week 5
## Counterfactual Explanation and Remediation Logic

### Objective
Explain why Boolean rules are not activated and identify
the conditions required for hypothetical rule activation.

### Implemented Features
- Counterfactual explanations for all 10 Boolean rules.
- Identification of unmet conditions.
- Identification of missing or invalid inputs.
- Numeric threshold validation.
- Boolean confirmation flag validation.
- Shared rule definitions.
- Remediation information in rule evaluation results.
- Integration with the standalone XAI API.

### Mathematical Logic
Each rule consists of a conjunction of conditions.

A rule is TRUE when all conditions are satisfied.
A rule is FALSE when at least one condition is false.
A rule is UNKNOWN when no condition is false but
one or more conditions cannot be evaluated.

The counterfactual engine identifies all false conditions
and separately reports unknown conditions.

### Files
- counterfactual.py
- truth_table.py
- test_counterfactual.py
- test_integration.py

### Testing Results
| Test Suite | Passed |
|---|---|
| Boolean Engine | 8/8 |
| Counterfactual Engine | 14/14 |
| Integration Tests | 7/7 |
| Total | 29/29 |

Test success rate: 100%
Test execution time: 0.088 seconds

### Pipeline Verification
- Prediction: Tomato Late Blight
- Model confidence: 99.99%
- TRUE rules: 6
- FALSE rules: 4
- UNKNOWN rules: 0
- Truth table rows: 512
- Combined execution time: 1.884 seconds

### API Verification
Endpoint: POST /xai/diagnose
HTTP status: 200 OK
Remediation fields: 10
Heatmap dimensions: 7 x 7

### Limitations
- Thresholds are illustrative and require agricultural
  validation.
- Counterfactual explanations describe hypothetical
  activation conditions, not farming instructions.
- Boolean flags require independent verification.
- Model confidence does not establish disease confirmation.
- Production API integration requires team coordination.
- Full truth table responses may increase network overhead.
- Grad-CAM is an adaptation of the original SHAP-based
  project roadmap and requires team approval.

### Conclusion
The Week 5 counterfactual explanation module has been
implemented and tested within the standalone XAI pipeline.
