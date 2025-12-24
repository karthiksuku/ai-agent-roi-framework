"""Tests for AURA Framework scenarios and industry presets."""

import pytest
import json
from pathlib import Path

from aura_roi.models import Project, Task, Industry
from aura_roi.calculator import AURACalculator
from aura_roi.industry_presets import IndustryPresets, get_industry_preset


class TestIndustryPresets:
    """Tests for industry presets."""

    def test_get_all_industries(self):
        """Test that all industries have presets."""
        industries = IndustryPresets.list_industries()
        assert len(industries) >= 9  # At least 9 industries

        for industry_name in industries:
            preset = get_industry_preset(industry_name)
            assert preset is not None
            assert preset.name is not None
            assert preset.typical_hourly_rate > 0

    def test_healthcare_preset(self):
        """Test healthcare industry preset."""
        preset = IndustryPresets.get(Industry.HEALTHCARE)

        assert preset.name == "Healthcare"
        assert preset.typical_hourly_rate >= 50  # Healthcare has higher rates
        assert preset.risk_profile.regulatory_risk > 0.15  # High regulatory risk

    def test_retail_preset(self):
        """Test retail industry preset."""
        preset = IndustryPresets.get(Industry.RETAIL)

        assert preset.name == "Retail"
        assert preset.typical_hourly_rate < 40  # Lower rates in retail
        assert preset.maturity_config.learning_rate >= 0.025  # Fast learning

    def test_financial_services_preset(self):
        """Test financial services preset."""
        preset = IndustryPresets.get(Industry.FINANCIAL_SERVICES)

        assert preset.typical_accuracy >= 0.93  # High accuracy required
        assert preset.risk_profile.regulatory_risk > 0.20  # High regulatory

    def test_get_typical_costs(self):
        """Test getting typical costs for industry."""
        costs = IndustryPresets.get_typical_costs(Industry.RETAIL, "medium")

        assert costs.initial_development > 0
        assert costs.platform_monthly > 0
        assert costs.api_cost_per_call > 0

    def test_get_typical_costs_scaling(self):
        """Test cost scaling by project size."""
        small_costs = IndustryPresets.get_typical_costs(Industry.RETAIL, "small")
        medium_costs = IndustryPresets.get_typical_costs(Industry.RETAIL, "medium")
        large_costs = IndustryPresets.get_typical_costs(Industry.RETAIL, "large")

        assert small_costs.initial_development < medium_costs.initial_development
        assert medium_costs.initial_development < large_costs.initial_development

    def test_get_industry_preset_by_name(self):
        """Test getting preset by string name."""
        preset = get_industry_preset("healthcare")
        assert preset is not None
        assert preset.industry == Industry.HEALTHCARE

        preset = get_industry_preset("FINANCIAL_SERVICES")
        assert preset is not None

        preset = get_industry_preset("invalid")
        assert preset is None


class TestRealisticScenarios:
    """Tests for realistic scenarios."""

    def test_customer_service_scenario(self):
        """Test customer service AI agent scenario."""
        # A typical customer service AI agent scenario
        project = Project(
            name="Customer Service Agent",
            duration_months=24,
            industry=Industry.RETAIL
        )

        # Add common customer service tasks
        project.add_task(Task(
            name="Email Inquiries",
            hours_per_week=60,
            hourly_rate=28,
            accuracy=0.92,
            oversight_rate=0.12
        ))
        project.add_task(Task(
            name="Order Status",
            hours_per_week=40,
            hourly_rate=25,
            accuracy=0.95,
            oversight_rate=0.08
        ))
        project.add_task(Task(
            name="Returns Processing",
            hours_per_week=30,
            hourly_rate=28,
            accuracy=0.88,
            oversight_rate=0.15
        ))

        preset = IndustryPresets.get(Industry.RETAIL)
        project.costs = IndustryPresets.get_typical_costs(Industry.RETAIL, "medium")
        project.risk_profile = preset.risk_profile
        project.maturity_config = preset.maturity_config

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # Sanity checks for a reasonable scenario
        assert results.roi_percentage > 100  # Should be positive ROI
        assert results.payback_months is not None
        assert results.payback_months < 18  # Reasonable payback
        assert results.total_gross_value > results.total_cost

    def test_document_processing_scenario(self):
        """Test document processing AI agent scenario."""
        project = Project(
            name="Invoice Processing Agent",
            duration_months=24,
            industry=Industry.FINANCIAL_SERVICES
        )

        project.add_task(Task(
            name="Invoice Data Extraction",
            hours_per_week=80,
            hourly_rate=45,
            accuracy=0.94,
            oversight_rate=0.10,
            volume_per_week=500,
            error_cost=200,
            baseline_error_rate=0.08
        ))

        preset = IndustryPresets.get(Industry.FINANCIAL_SERVICES)
        project.costs = IndustryPresets.get_typical_costs(
            Industry.FINANCIAL_SERVICES, "medium"
        )
        project.risk_profile = preset.risk_profile

        calculator = AURACalculator(project)
        results = calculator.calculate()

        assert results.roi_percentage > 0
        assert results.value_breakdown.dla > 0
        assert results.value_breakdown.dqp > 0  # Should have DQP from error reduction

    def test_healthcare_triage_scenario(self):
        """Test healthcare triage AI agent scenario."""
        project = Project(
            name="Patient Triage Assistant",
            duration_months=36,  # Longer timeline for healthcare
            industry=Industry.HEALTHCARE
        )

        project.add_task(Task(
            name="Symptom Assessment",
            hours_per_week=60,
            hourly_rate=55,
            accuracy=0.88,
            oversight_rate=0.25  # High oversight for patient safety
        ))
        project.add_task(Task(
            name="Appointment Scheduling",
            hours_per_week=40,
            hourly_rate=35,
            accuracy=0.95,
            oversight_rate=0.10
        ))

        preset = IndustryPresets.get(Industry.HEALTHCARE)
        project.costs = IndustryPresets.get_typical_costs(Industry.HEALTHCARE, "medium")
        project.risk_profile = preset.risk_profile
        project.maturity_config = preset.maturity_config

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # Healthcare has higher risk adjustment
        assert results.risk_profile.composite_risk > 0.15
        assert results.total_risk_adjusted_value < results.total_gross_value * 0.90


class TestScenarioComparison:
    """Tests comparing different scenarios."""

    def test_industry_comparison(self):
        """Compare same project across industries."""
        results_by_industry = {}

        for industry in [Industry.RETAIL, Industry.HEALTHCARE, Industry.FINANCIAL_SERVICES]:
            project = Project(
                name=f"Test {industry.value}",
                duration_months=24,
                industry=industry
            )

            preset = IndustryPresets.get(industry)
            project.add_task(Task(
                name="Generic Task",
                hours_per_week=40,
                hourly_rate=preset.typical_hourly_rate,
                accuracy=preset.typical_accuracy,
                oversight_rate=preset.typical_oversight_rate
            ))
            project.costs = IndustryPresets.get_typical_costs(industry, "medium")
            project.risk_profile = preset.risk_profile
            project.maturity_config = preset.maturity_config

            calculator = AURACalculator(project)
            results = calculator.calculate()
            results_by_industry[industry] = results

        # Retail should have faster payback (lower costs, faster learning)
        # Healthcare should have lower risk-adjusted ROI (higher oversight/risk)
        retail_roi = results_by_industry[Industry.RETAIL].roi_percentage
        healthcare_roi = results_by_industry[Industry.HEALTHCARE].roi_percentage

        # Retail typically has better adjusted returns due to lower complexity
        assert retail_roi > healthcare_roi * 0.5  # At least somewhat comparable

    def test_scale_comparison(self):
        """Compare different project scales."""
        results_by_scale = {}

        for scale in ["small", "medium", "large"]:
            project = Project(
                name=f"Test {scale}",
                duration_months=24,
                industry=Industry.RETAIL
            )

            # Scale affects hours
            hours_multiplier = {"small": 0.5, "medium": 1.0, "large": 2.0}[scale]

            project.add_task(Task(
                name="Task",
                hours_per_week=40 * hours_multiplier,
                hourly_rate=28,
                accuracy=0.92
            ))
            project.costs = IndustryPresets.get_typical_costs(Industry.RETAIL, scale)

            calculator = AURACalculator(project)
            results = calculator.calculate()
            results_by_scale[scale] = results

        # Larger projects should have higher absolute value
        assert (results_by_scale["large"].total_gross_value >
                results_by_scale["medium"].total_gross_value)
        assert (results_by_scale["medium"].total_gross_value >
                results_by_scale["small"].total_gross_value)


class TestWhatIfAnalysis:
    """Tests for what-if analysis."""

    def test_what_if_scenarios(self):
        """Test what-if analysis with multiple scenarios."""
        project = Project(name="Base", duration_months=24)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=0.90
        ))
        project.costs.initial_development = 50000
        project.costs.platform_monthly = 2000

        calculator = AURACalculator(project)

        scenarios = [
            {"name": "Optimistic", "modifications": {"accuracy": 1.1, "cost": 0.8}},
            {"name": "Pessimistic", "modifications": {"accuracy": 0.9, "cost": 1.2}},
            {"name": "High Adoption", "modifications": {"accuracy": 1.05}},
        ]

        results = calculator.what_if_analysis(scenarios)

        assert len(results) == 3
        assert results[0][0] == "Optimistic"
        assert results[1][0] == "Pessimistic"

        # Optimistic should have better ROI than pessimistic
        assert results[0][1].roi_percentage > results[1][1].roi_percentage
