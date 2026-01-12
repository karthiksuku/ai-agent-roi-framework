"""
Baseline Capture Module for AURA Framework

Purpose: Capture pre-AI performance metrics and generate measurement plans
for accurate before/after ROI comparison.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from enum import Enum
import json


class MetricType(Enum):
    TIME = "time"
    COST = "cost"
    QUALITY = "quality"
    VOLUME = "volume"
    SATISFACTION = "satisfaction"
    COMPLIANCE = "compliance"


@dataclass
class BaselineMetric:
    """Individual baseline metric"""
    name: str
    metric_type: MetricType
    value: float
    unit: str
    measurement_period: str
    confidence_level: float
    sample_size: int
    measurement_date: datetime
    notes: Optional[str] = None


@dataclass
class ProcessBaseline:
    """Complete baseline for a business process"""
    process_name: str
    process_description: str
    metrics: List[BaselineMetric]

    # Time metrics
    avg_handling_time_minutes: float
    handling_time_std_dev: float

    # Volume metrics
    daily_volume: int
    peak_volume: int
    volume_growth_rate: float

    # Quality metrics
    error_rate: float
    rework_rate: float
    first_pass_yield: float

    # Cost metrics
    cost_per_transaction: float
    fully_loaded_hourly_rate: float
    fte_count: float

    # Satisfaction metrics
    customer_satisfaction_score: Optional[float] = None
    employee_satisfaction_score: Optional[float] = None
    net_promoter_score: Optional[float] = None

    # Compliance metrics
    compliance_rate: Optional[float] = None
    audit_findings_count: Optional[int] = None

    # Metadata
    measurement_start_date: datetime = field(default_factory=datetime.now)
    measurement_end_date: Optional[datetime] = None
    data_sources: List[str] = field(default_factory=list)
    assumptions: List[str] = field(default_factory=list)


@dataclass
class MeasurementPlan:
    """Structured plan for post-implementation measurement"""
    process_name: str
    metrics_to_track: List[str]
    measurement_frequency: str
    measurement_duration_months: int
    responsible_party: str
    data_collection_method: str
    success_criteria: Dict[str, Dict[str, float]]
    checkpoints: List[Tuple[int, str]]


@dataclass
class VarianceReport:
    """Comparison of actual vs projected performance"""
    process_name: str
    measurement_period: Tuple[datetime, datetime]

    projected_metrics: Dict[str, float]
    actual_metrics: Dict[str, float]
    variance: Dict[str, float]
    variance_percentage: Dict[str, float]

    overperforming_areas: List[str]
    underperforming_areas: List[str]
    root_cause_analysis: Dict[str, str]
    recommendations: List[str]

    revised_roi_estimate: float
    confidence_adjustment: float


class BaselineCapture:
    """
    Capture and manage pre-AI performance baselines.

    Usage:
        baseline = BaselineCapture("My Project")
        baseline.capture_process_baseline(
            process_name="Invoice Processing",
            process_description="End-to-end invoice handling",
            avg_handling_time_minutes=15.5,
            handling_time_std_dev=5.2,
            daily_volume=500,
            peak_volume=750,
            error_rate=0.08,
            rework_rate=0.05,
            cost_per_transaction=12.50,
            fully_loaded_hourly_rate=75.0,
            fte_count=5.0
        )
        plan = baseline.generate_measurement_plan("Invoice Processing")
    """

    def __init__(self, project_name: str):
        self.project_name = project_name
        self.baselines: Dict[str, ProcessBaseline] = {}
        self.measurement_plans: Dict[str, MeasurementPlan] = {}
        self.created_at = datetime.now()

    def capture_process_baseline(
        self,
        process_name: str,
        process_description: str,
        avg_handling_time_minutes: float,
        handling_time_std_dev: float,
        daily_volume: int,
        peak_volume: int,
        error_rate: float,
        rework_rate: float,
        cost_per_transaction: float,
        fully_loaded_hourly_rate: float,
        fte_count: float,
        volume_growth_rate: float = 0.05,
        customer_satisfaction_score: Optional[float] = None,
        employee_satisfaction_score: Optional[float] = None,
        net_promoter_score: Optional[float] = None,
        compliance_rate: Optional[float] = None,
        audit_findings_count: Optional[int] = None,
        data_sources: Optional[List[str]] = None,
        assumptions: Optional[List[str]] = None,
        measurement_period_days: int = 30
    ) -> ProcessBaseline:
        """Capture comprehensive baseline metrics for a process."""
        baseline = ProcessBaseline(
            process_name=process_name,
            process_description=process_description,
            metrics=[],
            avg_handling_time_minutes=avg_handling_time_minutes,
            handling_time_std_dev=handling_time_std_dev,
            daily_volume=daily_volume,
            peak_volume=peak_volume,
            volume_growth_rate=volume_growth_rate,
            error_rate=error_rate,
            rework_rate=rework_rate,
            first_pass_yield=1.0 - error_rate - rework_rate,
            cost_per_transaction=cost_per_transaction,
            fully_loaded_hourly_rate=fully_loaded_hourly_rate,
            fte_count=fte_count,
            customer_satisfaction_score=customer_satisfaction_score,
            employee_satisfaction_score=employee_satisfaction_score,
            net_promoter_score=net_promoter_score,
            compliance_rate=compliance_rate,
            audit_findings_count=audit_findings_count,
            data_sources=data_sources or [],
            assumptions=assumptions or [],
            measurement_end_date=datetime.now(),
            measurement_start_date=datetime.now() - timedelta(days=measurement_period_days)
        )

        self.baselines[process_name] = baseline
        return baseline

    def generate_measurement_plan(
        self,
        process_name: str,
        measurement_frequency: str = "weekly",
        measurement_duration_months: int = 12,
        responsible_party: str = "AI Program Office",
        success_thresholds: Optional[Dict[str, float]] = None
    ) -> MeasurementPlan:
        """Generate a structured measurement plan for post-implementation tracking."""
        if process_name not in self.baselines:
            raise ValueError(f"No baseline found for process: {process_name}")

        default_thresholds = {
            "handling_time_reduction": {"threshold": 0.20, "target": 0.40},
            "error_rate_reduction": {"threshold": 0.30, "target": 0.50},
            "cost_reduction": {"threshold": 0.15, "target": 0.30},
            "volume_increase": {"threshold": 0.10, "target": 0.25},
            "satisfaction_improvement": {"threshold": 0.05, "target": 0.15}
        }

        plan = MeasurementPlan(
            process_name=process_name,
            metrics_to_track=[
                "avg_handling_time_minutes",
                "error_rate",
                "rework_rate",
                "cost_per_transaction",
                "daily_volume",
                "customer_satisfaction_score"
            ],
            measurement_frequency=measurement_frequency,
            measurement_duration_months=measurement_duration_months,
            responsible_party=responsible_party,
            data_collection_method="Automated system logs + monthly surveys",
            success_criteria=success_thresholds or default_thresholds,
            checkpoints=[
                (1, "Initial deployment validation"),
                (3, "Pilot phase complete - go/no-go decision"),
                (6, "Scaled deployment milestone"),
                (9, "Optimization phase begins"),
                (12, "Full year ROI assessment")
            ]
        )

        self.measurement_plans[process_name] = plan
        return plan

    def compare_actual_vs_projected(
        self,
        process_name: str,
        actual_metrics: Dict[str, float],
        projected_roi: float,
        measurement_period_start: datetime,
        measurement_period_end: datetime
    ) -> VarianceReport:
        """Compare actual post-implementation metrics against projections."""
        if process_name not in self.baselines:
            raise ValueError(f"No baseline found for process: {process_name}")

        baseline = self.baselines[process_name]

        projected_metrics = {
            "avg_handling_time_minutes": baseline.avg_handling_time_minutes * 0.60,
            "error_rate": baseline.error_rate * 0.50,
            "cost_per_transaction": baseline.cost_per_transaction * 0.70,
            "daily_volume": baseline.daily_volume * 1.20,
        }

        variance = {}
        variance_percentage = {}
        overperforming = []
        underperforming = []

        for metric, projected in projected_metrics.items():
            if metric in actual_metrics:
                actual = actual_metrics[metric]
                var = actual - projected
                var_pct = (var / projected) * 100 if projected != 0 else 0

                variance[metric] = var
                variance_percentage[metric] = var_pct

                if metric in ["avg_handling_time_minutes", "error_rate", "cost_per_transaction"]:
                    if actual < projected:
                        overperforming.append(metric)
                    else:
                        underperforming.append(metric)
                else:
                    if actual > projected:
                        overperforming.append(metric)
                    else:
                        underperforming.append(metric)

        actual_improvement_ratio = self._calculate_improvement_ratio(
            baseline, actual_metrics, projected_metrics
        )
        revised_roi = projected_roi * actual_improvement_ratio

        return VarianceReport(
            process_name=process_name,
            measurement_period=(measurement_period_start, measurement_period_end),
            projected_metrics=projected_metrics,
            actual_metrics=actual_metrics,
            variance=variance,
            variance_percentage=variance_percentage,
            overperforming_areas=overperforming,
            underperforming_areas=underperforming,
            root_cause_analysis=self._analyze_root_causes(underperforming),
            recommendations=self._generate_recommendations(underperforming, variance_percentage),
            revised_roi_estimate=revised_roi,
            confidence_adjustment=actual_improvement_ratio
        )

    def _calculate_improvement_ratio(
        self,
        baseline: ProcessBaseline,
        actual: Dict[str, float],
        projected: Dict[str, float]
    ) -> float:
        """Calculate overall improvement ratio for ROI adjustment"""
        ratios = []
        for metric in projected:
            if metric in actual:
                baseline_val = getattr(baseline, metric, None)
                if baseline_val and projected[metric] != baseline_val:
                    projected_improvement = abs(baseline_val - projected[metric])
                    actual_improvement = abs(baseline_val - actual[metric])
                    if projected_improvement > 0:
                        ratios.append(actual_improvement / projected_improvement)

        return sum(ratios) / len(ratios) if ratios else 1.0

    def _analyze_root_causes(self, underperforming: List[str]) -> Dict[str, str]:
        """Provide potential root cause analysis for underperforming areas"""
        root_causes = {
            "avg_handling_time_minutes": "Potential causes: Complex edge cases, integration latency, user training gaps",
            "error_rate": "Potential causes: Model accuracy issues, data quality problems, process exceptions",
            "cost_per_transaction": "Potential causes: Higher than expected compute costs, human oversight requirements",
            "daily_volume": "Potential causes: Adoption resistance, capacity constraints, trust issues"
        }
        return {metric: root_causes.get(metric, "Requires investigation") for metric in underperforming}

    def _generate_recommendations(
        self,
        underperforming: List[str],
        variance_percentage: Dict[str, float]
    ) -> List[str]:
        """Generate actionable recommendations based on variance analysis"""
        recommendations = []

        for metric in underperforming:
            var_pct = variance_percentage.get(metric, 0)

            if metric == "avg_handling_time_minutes":
                if var_pct > 20:
                    recommendations.append("Review agent prompts for efficiency; consider caching common responses")
                recommendations.append("Analyze handling time distribution to identify outlier cases")

            elif metric == "error_rate":
                if var_pct > 30:
                    recommendations.append("Implement additional validation layers; increase human review threshold")
                recommendations.append("Conduct error pattern analysis to identify systematic issues")

            elif metric == "cost_per_transaction":
                recommendations.append("Optimize model selection based on task complexity")
                recommendations.append("Review compute resource allocation and scaling policies")

        return recommendations

    def export_baseline(self, process_name: str, format: str = "json") -> str:
        """Export baseline data in specified format"""
        if process_name not in self.baselines:
            raise ValueError(f"No baseline found for process: {process_name}")

        baseline = self.baselines[process_name]

        if format == "json":
            data = {
                "process_name": baseline.process_name,
                "process_description": baseline.process_description,
                "avg_handling_time_minutes": baseline.avg_handling_time_minutes,
                "handling_time_std_dev": baseline.handling_time_std_dev,
                "daily_volume": baseline.daily_volume,
                "peak_volume": baseline.peak_volume,
                "volume_growth_rate": baseline.volume_growth_rate,
                "error_rate": baseline.error_rate,
                "rework_rate": baseline.rework_rate,
                "first_pass_yield": baseline.first_pass_yield,
                "cost_per_transaction": baseline.cost_per_transaction,
                "fully_loaded_hourly_rate": baseline.fully_loaded_hourly_rate,
                "fte_count": baseline.fte_count,
                "customer_satisfaction_score": baseline.customer_satisfaction_score,
                "employee_satisfaction_score": baseline.employee_satisfaction_score,
                "net_promoter_score": baseline.net_promoter_score,
                "compliance_rate": baseline.compliance_rate,
                "audit_findings_count": baseline.audit_findings_count,
                "data_sources": baseline.data_sources,
                "assumptions": baseline.assumptions,
                "measurement_start_date": baseline.measurement_start_date.isoformat() if baseline.measurement_start_date else None,
                "measurement_end_date": baseline.measurement_end_date.isoformat() if baseline.measurement_end_date else None
            }
            return json.dumps(data, indent=2)
        else:
            raise ValueError(f"Unsupported format: {format}")

    def get_baseline_summary(self, process_name: str) -> Dict:
        """Get a summary of baseline metrics for reporting"""
        if process_name not in self.baselines:
            raise ValueError(f"No baseline found for process: {process_name}")

        baseline = self.baselines[process_name]

        return {
            "process_name": baseline.process_name,
            "key_metrics": {
                "avg_handling_time": f"{baseline.avg_handling_time_minutes:.1f} minutes",
                "daily_volume": f"{baseline.daily_volume:,} transactions",
                "error_rate": f"{baseline.error_rate * 100:.1f}%",
                "cost_per_transaction": f"${baseline.cost_per_transaction:.2f}",
                "fte_count": baseline.fte_count
            },
            "annual_cost": baseline.cost_per_transaction * baseline.daily_volume * 250,
            "annual_volume": baseline.daily_volume * 250,
            "quality_score": baseline.first_pass_yield * 100
        }
