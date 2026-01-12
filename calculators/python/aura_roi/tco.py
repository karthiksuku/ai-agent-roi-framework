"""
Total Cost of Ownership (TCO) Calculator for AI Agent Projects

Provides comprehensive cost modeling including:
- Initial investment costs
- Ongoing operational costs
- Hidden/indirect costs
- Cost projections over time
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple
from enum import Enum
import numpy as np


class CostCategory(Enum):
    INITIAL = "initial"
    ONGOING = "ongoing"
    HIDDEN = "hidden"
    OPPORTUNITY = "opportunity"


@dataclass
class InitialCosts:
    """One-time upfront investment costs"""

    # Development
    internal_development_hours: float = 0
    internal_hourly_rate: float = 150
    external_consulting_cost: float = 0

    # Infrastructure
    infrastructure_setup: float = 0
    cloud_credits_initial: float = 0
    hardware_purchase: float = 0

    # Integration
    api_integration_cost: float = 0
    legacy_system_adaptation: float = 0
    data_pipeline_development: float = 0

    # Data Preparation
    data_collection_cost: float = 0
    data_labeling_cost: float = 0
    data_cleaning_cost: float = 0

    # Training & Change Management
    employee_training_cost: float = 0
    change_management_cost: float = 0
    documentation_cost: float = 0

    # Compliance & Security
    security_audit_cost: float = 0
    compliance_certification_cost: float = 0
    legal_review_cost: float = 0

    # Vendor/Platform
    platform_license_upfront: float = 0
    vendor_onboarding_fee: float = 0

    @property
    def development_cost(self) -> float:
        return (self.internal_development_hours * self.internal_hourly_rate) + self.external_consulting_cost

    @property
    def infrastructure_cost(self) -> float:
        return self.infrastructure_setup + self.cloud_credits_initial + self.hardware_purchase

    @property
    def integration_cost(self) -> float:
        return self.api_integration_cost + self.legacy_system_adaptation + self.data_pipeline_development

    @property
    def data_preparation_cost(self) -> float:
        return self.data_collection_cost + self.data_labeling_cost + self.data_cleaning_cost

    @property
    def training_cost(self) -> float:
        return self.employee_training_cost + self.change_management_cost + self.documentation_cost

    @property
    def compliance_cost(self) -> float:
        return self.security_audit_cost + self.compliance_certification_cost + self.legal_review_cost

    @property
    def vendor_cost(self) -> float:
        return self.platform_license_upfront + self.vendor_onboarding_fee

    @property
    def total(self) -> float:
        return (
            self.development_cost +
            self.infrastructure_cost +
            self.integration_cost +
            self.data_preparation_cost +
            self.training_cost +
            self.compliance_cost +
            self.vendor_cost
        )


@dataclass
class OngoingCosts:
    """Recurring monthly operational costs"""

    # Compute & Infrastructure
    llm_inference_cost: float = 0
    cloud_compute_cost: float = 0
    storage_cost: float = 0
    network_egress_cost: float = 0

    # API & Platform
    api_subscription_cost: float = 0
    platform_license_monthly: float = 0
    third_party_api_costs: float = 0

    # Operations
    monitoring_tools_cost: float = 0
    logging_cost: float = 0
    security_tools_cost: float = 0

    # Human Resources
    ai_ops_team_cost: float = 0
    human_oversight_cost: float = 0
    support_team_cost: float = 0

    # Maintenance
    model_retraining_cost: float = 0
    prompt_engineering_cost: float = 0
    bug_fixes_cost: float = 0

    # Compliance
    ongoing_audit_cost: float = 0
    compliance_monitoring_cost: float = 0

    @property
    def compute_cost(self) -> float:
        return self.llm_inference_cost + self.cloud_compute_cost + self.storage_cost + self.network_egress_cost

    @property
    def platform_cost(self) -> float:
        return self.api_subscription_cost + self.platform_license_monthly + self.third_party_api_costs

    @property
    def operations_cost(self) -> float:
        return self.monitoring_tools_cost + self.logging_cost + self.security_tools_cost

    @property
    def hr_cost(self) -> float:
        return self.ai_ops_team_cost + self.human_oversight_cost + self.support_team_cost

    @property
    def maintenance_cost(self) -> float:
        return self.model_retraining_cost + self.prompt_engineering_cost + self.bug_fixes_cost

    @property
    def compliance_cost(self) -> float:
        return self.ongoing_audit_cost + self.compliance_monitoring_cost

    @property
    def total_monthly(self) -> float:
        return (
            self.compute_cost +
            self.platform_cost +
            self.operations_cost +
            self.hr_cost +
            self.maintenance_cost +
            self.compliance_cost
        )


@dataclass
class HiddenCosts:
    """Often overlooked or underestimated costs"""

    # Data Quality
    data_quality_remediation: float = 0
    data_governance_overhead: float = 0

    # Integration Overhead
    api_version_updates: float = 0
    dependency_management: float = 0
    technical_debt_interest: float = 0

    # Performance
    latency_optimization: float = 0
    scaling_engineering: float = 0

    # Risk & Incidents
    incident_response_cost: float = 0
    rollback_cost: float = 0
    reputation_risk_reserve: float = 0

    # Knowledge Management
    documentation_maintenance: float = 0
    knowledge_transfer_cost: float = 0

    @property
    def total_monthly(self) -> float:
        return sum([
            self.data_quality_remediation,
            self.data_governance_overhead,
            self.api_version_updates,
            self.dependency_management,
            self.technical_debt_interest,
            self.latency_optimization,
            self.scaling_engineering,
            self.incident_response_cost,
            self.rollback_cost,
            self.reputation_risk_reserve,
            self.documentation_maintenance,
            self.knowledge_transfer_cost
        ])


@dataclass
class OpportunityCosts:
    """Value of alternatives foregone"""

    developer_time_other_projects: float = 0
    infrastructure_alternative_use: float = 0
    training_time_productivity_loss: float = 0
    transition_period_productivity_dip: float = 0

    @property
    def total(self) -> float:
        return sum([
            self.developer_time_other_projects,
            self.infrastructure_alternative_use,
            self.training_time_productivity_loss,
            self.transition_period_productivity_dip
        ])


@dataclass
class TCOBreakdown:
    """Complete TCO analysis results"""

    initial_costs: InitialCosts
    ongoing_costs: OngoingCosts
    hidden_costs: HiddenCosts
    opportunity_costs: OpportunityCosts

    duration_months: int
    discount_rate: float

    total_initial: float = field(init=False)
    total_ongoing: float = field(init=False)
    total_hidden: float = field(init=False)
    total_opportunity: float = field(init=False)
    total_tco: float = field(init=False)
    npv_tco: float = field(init=False)
    monthly_breakdown: List[Dict] = field(init=False)
    cost_by_category: Dict[str, float] = field(init=False)

    def __post_init__(self):
        self.total_initial = self.initial_costs.total
        self.total_ongoing = self.ongoing_costs.total_monthly * self.duration_months
        self.total_hidden = self.hidden_costs.total_monthly * self.duration_months
        self.total_opportunity = self.opportunity_costs.total

        self.total_tco = (
            self.total_initial +
            self.total_ongoing +
            self.total_hidden +
            self.total_opportunity
        )

        self.npv_tco = self._calculate_npv()
        self.monthly_breakdown = self._generate_monthly_breakdown()
        self.cost_by_category = self._categorize_costs()

    def _calculate_npv(self) -> float:
        """Calculate Net Present Value of all costs"""
        monthly_rate = self.discount_rate / 12

        npv = self.initial_costs.total
        monthly_cost = self.ongoing_costs.total_monthly + self.hidden_costs.total_monthly

        for month in range(1, self.duration_months + 1):
            discounted_cost = monthly_cost / ((1 + monthly_rate) ** month)
            npv += discounted_cost

        npv += self.opportunity_costs.total

        return npv

    def _generate_monthly_breakdown(self) -> List[Dict]:
        """Generate month-by-month cost breakdown"""
        breakdown = []
        cumulative = self.initial_costs.total

        for month in range(self.duration_months):
            monthly_total = self.ongoing_costs.total_monthly + self.hidden_costs.total_monthly
            cumulative += monthly_total

            breakdown.append({
                "month": month + 1,
                "ongoing_costs": self.ongoing_costs.total_monthly,
                "hidden_costs": self.hidden_costs.total_monthly,
                "monthly_total": monthly_total,
                "cumulative_total": cumulative
            })

        return breakdown

    def _categorize_costs(self) -> Dict[str, float]:
        """Categorize costs for reporting"""
        return {
            "Development & Setup": self.initial_costs.development_cost + self.initial_costs.integration_cost,
            "Infrastructure": self.initial_costs.infrastructure_cost + (self.ongoing_costs.compute_cost * self.duration_months),
            "Platform & Licensing": self.initial_costs.vendor_cost + (self.ongoing_costs.platform_cost * self.duration_months),
            "Human Resources": (self.ongoing_costs.hr_cost * self.duration_months) + self.initial_costs.training_cost,
            "Compliance & Security": self.initial_costs.compliance_cost + (self.ongoing_costs.compliance_cost * self.duration_months),
            "Maintenance & Operations": (self.ongoing_costs.maintenance_cost + self.ongoing_costs.operations_cost) * self.duration_months,
            "Hidden Costs": self.total_hidden,
            "Opportunity Costs": self.total_opportunity
        }


class TCOCalculator:
    """
    Comprehensive Total Cost of Ownership calculator for AI Agent projects.

    Usage:
        calculator = TCOCalculator()

        initial = InitialCosts(
            internal_development_hours=500,
            internal_hourly_rate=150,
            infrastructure_setup=50000
        )

        ongoing = OngoingCosts(
            llm_inference_cost=5000,
            platform_license_monthly=2000
        )

        tco = calculator.calculate_tco(
            initial_costs=initial,
            ongoing_costs=ongoing,
            duration_months=36
        )

        print(f"Total TCO: ${tco.total_tco:,.0f}")
    """

    def __init__(self, discount_rate: float = 0.10):
        self.discount_rate = discount_rate

    def calculate_tco(
        self,
        initial_costs: InitialCosts,
        ongoing_costs: OngoingCosts,
        hidden_costs: Optional[HiddenCosts] = None,
        opportunity_costs: Optional[OpportunityCosts] = None,
        duration_months: int = 36
    ) -> TCOBreakdown:
        """Calculate comprehensive Total Cost of Ownership."""
        if hidden_costs is None:
            hidden_costs = self._estimate_hidden_costs(ongoing_costs)

        if opportunity_costs is None:
            opportunity_costs = OpportunityCosts()

        return TCOBreakdown(
            initial_costs=initial_costs,
            ongoing_costs=ongoing_costs,
            hidden_costs=hidden_costs,
            opportunity_costs=opportunity_costs,
            duration_months=duration_months,
            discount_rate=self.discount_rate
        )

    def _estimate_hidden_costs(self, ongoing_costs: OngoingCosts) -> HiddenCosts:
        """Estimate hidden costs based on industry benchmarks"""
        monthly_ongoing = ongoing_costs.total_monthly

        return HiddenCosts(
            data_quality_remediation=monthly_ongoing * 0.05,
            data_governance_overhead=monthly_ongoing * 0.03,
            api_version_updates=monthly_ongoing * 0.02,
            dependency_management=monthly_ongoing * 0.02,
            technical_debt_interest=monthly_ongoing * 0.05,
            incident_response_cost=monthly_ongoing * 0.03,
            documentation_maintenance=monthly_ongoing * 0.02
        )

    def calculate_cost_per_transaction(
        self,
        tco: TCOBreakdown,
        monthly_transaction_volume: int
    ) -> Dict[str, float]:
        """Calculate cost per transaction metrics."""
        total_transactions = monthly_transaction_volume * tco.duration_months

        return {
            "total_cost_per_transaction": tco.total_tco / total_transactions,
            "ongoing_cost_per_transaction": tco.total_ongoing / total_transactions,
            "marginal_cost_per_transaction": tco.ongoing_costs.llm_inference_cost / monthly_transaction_volume,
            "fully_loaded_cost_per_transaction": (
                tco.ongoing_costs.total_monthly + tco.hidden_costs.total_monthly
            ) / monthly_transaction_volume
        }

    def compare_scenarios(
        self,
        scenarios: Dict[str, TCOBreakdown]
    ) -> Dict:
        """Compare multiple TCO scenarios."""
        comparison = {
            "scenarios": {},
            "rankings": {
                "by_total_tco": [],
                "by_npv_tco": [],
                "by_monthly_cost": []
            },
            "recommendation": ""
        }

        for name, tco in scenarios.items():
            comparison["scenarios"][name] = {
                "total_tco": tco.total_tco,
                "npv_tco": tco.npv_tco,
                "monthly_cost": tco.ongoing_costs.total_monthly + tco.hidden_costs.total_monthly,
                "initial_investment": tco.total_initial
            }

        comparison["rankings"]["by_total_tco"] = sorted(
            scenarios.keys(),
            key=lambda x: scenarios[x].total_tco
        )
        comparison["rankings"]["by_npv_tco"] = sorted(
            scenarios.keys(),
            key=lambda x: scenarios[x].npv_tco
        )
        comparison["rankings"]["by_monthly_cost"] = sorted(
            scenarios.keys(),
            key=lambda x: scenarios[x].ongoing_costs.total_monthly
        )

        comparison["recommendation"] = comparison["rankings"]["by_npv_tco"][0]

        return comparison

    def sensitivity_analysis(
        self,
        base_tco: TCOBreakdown,
        variable: str,
        range_pct: Tuple[float, float] = (-0.30, 0.30),
        steps: int = 10
    ) -> List[Dict]:
        """Perform sensitivity analysis on a specific cost variable."""
        results = []

        for pct in np.linspace(range_pct[0], range_pct[1], steps):
            adjusted_tco = base_tco.total_tco * (1 + pct)
            results.append({
                "percentage_change": pct,
                "adjusted_tco": adjusted_tco,
                "delta": adjusted_tco - base_tco.total_tco
            })

        return results

    def generate_tco_report(self, tco: TCOBreakdown) -> Dict:
        """Generate a comprehensive TCO report"""
        return {
            "summary": {
                "total_tco": tco.total_tco,
                "npv_tco": tco.npv_tco,
                "duration_months": tco.duration_months,
                "discount_rate": tco.discount_rate
            },
            "breakdown": {
                "initial_costs": tco.total_initial,
                "ongoing_costs": tco.total_ongoing,
                "hidden_costs": tco.total_hidden,
                "opportunity_costs": tco.total_opportunity
            },
            "cost_by_category": tco.cost_by_category,
            "monthly_breakdown": tco.monthly_breakdown,
            "key_metrics": {
                "average_monthly_cost": (tco.total_ongoing + tco.total_hidden) / tco.duration_months,
                "initial_to_ongoing_ratio": tco.total_initial / tco.total_ongoing if tco.total_ongoing > 0 else 0,
                "hidden_cost_percentage": (tco.total_hidden / tco.total_tco) * 100 if tco.total_tco > 0 else 0
            }
        }
