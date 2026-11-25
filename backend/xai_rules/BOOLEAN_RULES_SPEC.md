# AgriShield – Boolean Rules Specification

## 1. Introduction

The Boolean Rules Engine evaluates agricultural sensor readings and confirmation flags to identify potential crop health risks and validate farming decisions.

The module uses symbolic logic to provide transparent and explainable recommendations.

## 2. Objectives

- Define 10 agronomic Boolean rules.
- Identify potential nutrient deficiencies.
- Evaluate irrigation and soil conditions.
- Identify environmental stress and disease risks.
- Generate explainable farming recommendations.
- Generate a complete truth table of confirmation flag combinations.

## 3. Boolean Operators

| Operator | Meaning |
|---|---|
| AND (∧) | Both conditions must be true. |
| OR (∨) | At least one condition must be true. |
| NOT (¬) | Reverses the Boolean condition. |
| TRUE | Rule conditions are satisfied. |
| FALSE | Rule conditions are not satisfied. |
| UNKNOWN | Required information is missing or invalid. |

## 4. Agronomic Boolean Rules

| Rule | Condition P | Condition Q | Recommendation R |
|---|---|---|---|
| R1 | N < N_CRITICAL | Nitrogen requirement confirmed | Review nitrogen requirement. |
| R2 | P < P_CRITICAL | Phosphorus requirement confirmed | Review phosphorus requirement. |
| R3 | K < K_CRITICAL | Potassium requirement confirmed | Review potassium requirement. |
| R4 | Water depletion ≥ RAW_THRESHOLD | Irrigation required | Check field conditions before irrigation. |
| R5 | Moisture ≥ M_WATERLOGGING | Waterlogging risk confirmed | Inspect drainage and avoid additional irrigation pending checks. |
| R6 | Soil pH < PH_MIN_CROP | Acidity confirmed | Review soil acidity and seek lime recommendations. |
| R7 | Soil pH > PH_MAX_CROP | Alkalinity confirmed | Seek appropriate soil management advice. |
| R8 | Temperature > T_MAX_CROP | Moisture < M_STRESS_CROP | Inspect combined heat and water stress. |
| R9 | Humidity > H_DISEASE_THRESHOLD | Temperature within pathogen risk range | Scout crops for possible disease. |
| R10 | Disease confirmed | Registered treatment available | Review registered treatment and IPM guidance. |

Each rule follows the logical structure:

R = P ∧ Q

A rule activates only when both required conditions are satisfied.

## 5. Threshold Configuration

| Threshold | Example value |
|---|---:|
| N_CRITICAL | 30 |
| P_CRITICAL | 20 |
| K_CRITICAL | 25 |
| RAW_THRESHOLD | 0.50 |
| M_WATERLOGGING | 80 |
| PH_MIN_CROP | 5.5 |
| PH_MAX_CROP | 7.0 |
| T_MAX_CROP | 34 |
| M_STRESS_CROP | 20 |
| H_DISEASE_THRESHOLD | 80 |
| T_MIN_PATHOGEN | 20 |
| T_MAX_PATHOGEN | 30 |

These values are illustrative software testing thresholds, not universally validated agricultural recommendations.

Actual thresholds and measurement units must be established using crop-specific requirements, soil conditions, growth stages, pathogen characteristics and verified agronomic references.

## 6. Boolean Confirmation Variables

The system uses nine Boolean confirmation flags:

1. N_REQUIREMENT_CONFIRMED
2. P_REQUIREMENT_CONFIRMED
3. K_REQUIREMENT_CONFIRMED
4. IRRIGATION_REQUIRED
5. WATERLOGGING_RISK
6. ACIDITY_CONFIRMED
7. ALKALINITY_CONFIRMED
8. DISEASE_CONFIRMED
9. REGISTERED_TREATMENT_AVAILABLE

## 7. Truth Table Generation

Number of Boolean variables: n = 9

Total possible combinations:

2ⁿ = 2⁹ = 512

The system generates 512 combinations of confirmation flags while holding the supplied sensor readings and thresholds constant.

Each combination contains the evaluation results of R1–R10.

The current input