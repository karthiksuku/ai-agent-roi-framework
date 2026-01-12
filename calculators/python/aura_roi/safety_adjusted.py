"""
Safety-Adjusted ROI Calculator

Incorporates operational safety signals to provide risk-adjusted ROI projections.
Based on industry best practices for AI observability and governance.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional
from enum import Enum


class SafetySignalSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class SafetySignals:
    """Operational safety metrics for AI systems"""

    # Accuracy & Reliability
    hallucination_rate: float = 0.0
    accuracy_rate: float = 0.95
    consistency_rate: float = 0.90

    # Safety Interventions
    guardrail_intervention_rate: float = 0.0
    content_filter_trigger_rate: float = 0.0

    # Human Oversight
    human_override_rate: float = 0.0
    escalation_rate: float = 0.0
    approval_rejection_rate: float = 0.0

    # Security & Privacy
    data_leak_incidents: int = 0
    pii_detection_failures: int = 0
    unauthorized_access_attempts: int = 0

    # Model Health
    model_drift_retraining_count: int = 0
    latency_sla_breaches: int = 0
    availability_percentage: float = 99.9

    # User Trust
    user_feedback_negative_rate: float = 0.0
    user_correction_rate: float = 0.0

    def calculate_composite_safety_score(self) -> float:
        """
        Calculate overall safety score (0.0 to 1.0, higher is safer).
        """
        weights = {
            "hallucination": 0.20,
            "accuracy": 0.15,
            "guardrails": 0.10,
            "human_override": 0.15,
            "data_leaks": 0.15,
            "model_drift": 0.10,
            "availability": 0.10,
            "user_trust": 0.05
        }

        scores = {
            "hallucination": 1 - min(self.hallucination_rate * 5, 1),
            "accuracy": self.accuracy_rate,
            "guardrails": 1 - min(self.guardrail_intervention_rate * 2, 1),
            "human_override": 1 - min(self.human_override_rate * 2, 1),
            "data_leaks": 1 if self.data_leak_incidents == 0 else max(0, 1 - self.data_leak_incidents * 0.2),
            "model_drift": 1 if self.model_drift_retraining_count <= 2 else max(0, 1 - (self.model_drift_retraining_count - 2) * 0.1),
            "availability": self.availability_percentage / 100,
            "user_trust": 1 - self.user_feedback_negative_rate
        }

        composite = sum(weights[k] * scores[k] for k in weights)
        return max(0, min(1, composite))


@dataclass
class SafetyThresholds:
    """Acceptable thresholds for safety signals"""

    max_hallucination_rate: float = 0.05
    min_accuracy_rate: float = 0.90
    max_guardrail_intervention_rate: float = 0.10
    max_human_override_rate: float = 0.15
    max_data_leak_incidents: int = 0
    max_model_retraining_per_year: int = 4
    min_availability: float = 99.5
    max_negative_feedback_rate: float = 0.10


@dataclass
class SafetyAdjustedResult:
    """Results of safety-adjusted ROI calculation"""

    gross_benefit: float
    total_cost: float
    safety_signals: SafetySignals
    safety_score: float
    safety_discount: float

    risk_adjusted_benefit: float = field(init=False)
    risk_adjusted_roi: float = field(init=False)
    unadjusted_roi: float = field(init=False)
    roi_impact: float = field(init=False)

    threshold_violations: List[str] = field(default_factory=list)
    risk_level: str = field(default="")
    recommendations: List[str] = field(default_factory=list)

    def __post_init__(self):
        self.unadjusted_roi = ((self.gross_benefit - self.total_cost) / self.total_cost) * 100 if self.total_cost > 0 else 0
        self.risk_adjusted_benefit = self.gross_benefit * self.safety_discount
        self.risk_adjusted_roi = ((self.risk_adjusted_benefit - self.total_cost) / self.total_cost) * 100 if self.total_cost > 0 else 0
        self.roi_impact = self.risk_adjusted_roi - self.unadjusted_roi


class SafetyAdjustedROI:
    """
    Calculate risk-adjusted ROI incorporating operational safety signals.

    Usage:
        calculator = SafetyAdjustedROI()

        signals = SafetySignals(
            hallucination_rate=0.03,
            accuracy_rate=0.94,
            human_override_rate=0.08
        )

        result = calculator.calculate(
            gross_benefit=500000,
            total_cost=150000,
            safety_signals=signals
        )

        print(f"Risk-Adjusted ROI: {result.risk_adjusted_roi:.1f}%")
    """

    def __init__(self, thresholds: Optional[SafetyThresholds] = None):
        self.thresholds = thresholds or SafetyThresholds()

    def calculate(
        self,
        gross_benefit: float,
        total_cost: float,
        safety_signals: SafetySignals,
        custom_weights: Optional[Dict[str, float]] = None
    ) -> SafetyAdjustedResult:
        """
        Calculate safety-adjusted ROI.

        Risk-Adjusted ROI = (Gross Benefit x Safety Discount - Total Cost) / Total Cost x 100
        """
        safety_score = safety_signals.calculate_composite_safety_score()
        safety_discount = self._calculate_safety_discount(safety_score)
        violations = self._check_threshold_violations(safety_signals)
        risk_level = self._determine_risk_level(safety_score, violations)
        recommendations = self._generate_recommendations(safety_signals, violations)

        result = SafetyAdjustedResult(
            gross_benefit=gross_benefit,
            total_cost=total_cost,
            safety_signals=safety_signals,
            safety_score=safety_score,
            safety_discount=safety_discount,
            threshold_violations=violations,
            risk_level=risk_level,
            recommendations=recommendations
        )

        return result

    def _calculate_safety_discount(self, safety_score: float) -> float:
        """Convert safety score to a discount factor."""
        if safety_score >= 0.9:
            return 1.0 - (1 - safety_score) * 0.5
        elif safety_score >= 0.7:
            return 0.95 - (0.9 - safety_score) * 1.5
        elif safety_score >= 0.5:
            return 0.65 - (0.7 - safety_score) * 1.25
        else:
            return max(0.1, safety_score * 1.2)

    def _check_threshold_violations(self, signals: SafetySignals) -> List[str]:
        """Check which safety thresholds are violated"""
        violations = []

        if signals.hallucination_rate > self.thresholds.max_hallucination_rate:
            violations.append(f"Hallucination rate ({signals.hallucination_rate:.1%}) exceeds threshold ({self.thresholds.max_hallucination_rate:.1%})")

        if signals.accuracy_rate < self.thresholds.min_accuracy_rate:
            violations.append(f"Accuracy rate ({signals.accuracy_rate:.1%}) below threshold ({self.thresholds.min_accuracy_rate:.1%})")

        if signals.guardrail_intervention_rate > self.thresholds.max_guardrail_intervention_rate:
            violations.append(f"Guardrail intervention rate ({signals.guardrail_intervention_rate:.1%}) exceeds threshold")

        if signals.human_override_rate > self.thresholds.max_human_override_rate:
            violations.append(f"Human override rate ({signals.human_override_rate:.1%}) exceeds threshold")

        if signals.data_leak_incidents > self.thresholds.max_data_leak_incidents:
            violations.append(f"Data leak incidents ({signals.data_leak_incidents}) detected")

        if signals.availability_percentage < self.thresholds.min_availability:
            violations.append(f"Availability ({signals.availability_percentage:.1%}) below threshold")

        if signals.user_feedback_negative_rate > self.thresholds.max_negative_feedback_rate:
            violations.append(f"Negative feedback rate ({signals.user_feedback_negative_rate:.1%}) exceeds threshold")

        return violations

    def _determine_risk_level(self, safety_score: float, violations: List[str]) -> str:
        """Determine overall risk level"""
        critical_keywords = ["data leak", "unauthorized"]
        has_critical = any(any(kw in v.lower() for kw in critical_keywords) for v in violations)

        if has_critical or safety_score < 0.5:
            return "CRITICAL"
        elif safety_score < 0.7 or len(violations) >= 3:
            return "HIGH"
        elif safety_score < 0.85 or len(violations) >= 1:
            return "MEDIUM"
        else:
            return "LOW"

    def _generate_recommendations(
        self,
        signals: SafetySignals,
        violations: List[str]
    ) -> List[str]:
        """Generate recommendations based on safety analysis"""
        recommendations = []

        if signals.hallucination_rate > 0.03:
            recommendations.append("Implement fact-checking layer or RAG system to reduce hallucinations")

        if signals.accuracy_rate < 0.92:
            recommendations.append("Review training data quality and consider model fine-tuning")

        if signals.human_override_rate > 0.10:
            recommendations.append("Analyze override patterns to identify systematic issues")

        if signals.data_leak_incidents > 0:
            recommendations.append("URGENT: Conduct security audit and implement additional data protection measures")

        if signals.availability_percentage < 99.5:
            recommendations.append("Review infrastructure reliability and implement redundancy")

        if signals.user_feedback_negative_rate > 0.05:
            recommendations.append("Conduct user research to understand pain points and improve experience")

        if signals.model_drift_retraining_count > 2:
            recommendations.append("Implement continuous monitoring and automated drift detection")

        if not recommendations:
            recommendations.append("Safety metrics are within acceptable ranges. Continue monitoring.")

        return recommendations

    def calculate_risk_adjusted_npv(
        self,
        monthly_benefits: List[float],
        monthly_costs: List[float],
        safety_signals: SafetySignals,
        discount_rate: float = 0.10
    ) -> Dict:
        """Calculate risk-adjusted NPV incorporating safety signals"""
        safety_score = safety_signals.calculate_composite_safety_score()
        safety_discount = self._calculate_safety_discount(safety_score)

        monthly_rate = discount_rate / 12

        unadjusted_npv = 0
        adjusted_npv = 0

        for month, (benefit, cost) in enumerate(zip(monthly_benefits, monthly_costs)):
            discount_factor = 1 / ((1 + monthly_rate) ** (month + 1))

            net_cash_flow = benefit - cost
            unadjusted_npv += net_cash_flow * discount_factor

            adjusted_benefit = benefit * safety_discount
            adjusted_net_cash_flow = adjusted_benefit - cost
            adjusted_npv += adjusted_net_cash_flow * discount_factor

        return {
            "unadjusted_npv": unadjusted_npv,
            "risk_adjusted_npv": adjusted_npv,
            "safety_score": safety_score,
            "safety_discount": safety_discount,
            "npv_impact": adjusted_npv - unadjusted_npv,
            "npv_impact_percentage": ((adjusted_npv - unadjusted_npv) / abs(unadjusted_npv)) * 100 if unadjusted_npv != 0 else 0
        }

    def generate_safety_report(self, result: SafetyAdjustedResult) -> Dict:
        """Generate a comprehensive safety assessment report"""
        return {
            "summary": {
                "safety_score": result.safety_score,
                "safety_discount": result.safety_discount,
                "risk_level": result.risk_level,
                "violation_count": len(result.threshold_violations)
            },
            "financial_impact": {
                "unadjusted_roi": result.unadjusted_roi,
                "risk_adjusted_roi": result.risk_adjusted_roi,
                "roi_reduction": result.roi_impact,
                "benefit_reduction": result.gross_benefit - result.risk_adjusted_benefit
            },
            "signals": {
                "hallucination_rate": result.safety_signals.hallucination_rate,
                "accuracy_rate": result.safety_signals.accuracy_rate,
                "human_override_rate": result.safety_signals.human_override_rate,
                "data_leak_incidents": result.safety_signals.data_leak_incidents,
                "availability": result.safety_signals.availability_percentage
            },
            "violations": result.threshold_violations,
            "recommendations": result.recommendations,
            "next_steps": self._generate_next_steps(result)
        }

    def _generate_next_steps(self, result: SafetyAdjustedResult) -> List[str]:
        """Generate prioritized next steps based on risk level"""
        if result.risk_level == "CRITICAL":
            return [
                "1. Immediately pause production deployment",
                "2. Conduct emergency security and safety review",
                "3. Implement mandatory human oversight for all decisions",
                "4. Schedule executive briefing on risk mitigation"
            ]
        elif result.risk_level == "HIGH":
            return [
                "1. Increase human oversight threshold",
                "2. Implement additional guardrails",
                "3. Schedule weekly safety review meetings",
                "4. Develop remediation plan within 30 days"
            ]
        elif result.risk_level == "MEDIUM":
            return [
                "1. Continue monitoring key metrics",
                "2. Address identified violations within 60 days",
                "3. Schedule monthly safety reviews",
                "4. Document and track improvement progress"
            ]
        else:
            return [
                "1. Maintain current monitoring practices",
                "2. Review metrics quarterly",
                "3. Continue optimization efforts",
                "4. Document best practices for other projects"
            ]
