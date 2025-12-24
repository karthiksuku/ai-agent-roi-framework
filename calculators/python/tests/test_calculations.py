"""Tests for AURA Framework calculations."""

import pytest

from aura_roi.models import (
    Task,
    Project,
    CostStructure,
    RiskProfile,
    MaturityConfig,
    ThroughputConfig,
    LatencyConfig,
    OptionalityConfig,
    Industry,
)
from aura_roi.calculator import AURACalculator


class TestDLACalculation:
    """Tests for Direct Labour Arbitrage calculations."""

    def test_basic_dla(self):
        """Test basic DLA calculation."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task 1",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=1.0,  # 100% accuracy
            oversight_rate=0.0  # No oversight
        ))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # 40 hours/week * 4.33 weeks/month * $50 = $8,660/month
        assert breakdown.dla == pytest.approx(8660, rel=0.01)

    def test_dla_with_accuracy(self):
        """Test DLA with accuracy factor."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task 1",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=0.90,  # 90% accuracy
            oversight_rate=0.0
        ))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Base DLA * 0.90 = $8,660 * 0.90 = $7,794
        assert breakdown.dla == pytest.approx(7794, rel=0.01)

    def test_dla_with_oversight(self):
        """Test DLA with oversight factor."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task 1",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=1.0,
            oversight_rate=0.20  # 20% oversight
        ))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Base DLA * (1 - 0.20) = $8,660 * 0.80 = $6,928
        assert breakdown.dla == pytest.approx(6928, rel=0.01)

    def test_dla_multiple_tasks(self):
        """Test DLA with multiple tasks."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(name="Task 1", hours_per_week=20, hourly_rate=50))
        project.add_task(Task(name="Task 2", hours_per_week=20, hourly_rate=40))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Task 1: 20 * 4.33 * 50 * 0.90 * 0.90 = ~3,506
        # Task 2: 20 * 4.33 * 40 * 0.90 * 0.90 = ~2,805
        # Total: ~6,311
        assert breakdown.dla > 0


class TestTACalculation:
    """Tests for Throughput Amplification calculations."""

    def test_ta_calculation(self):
        """Test basic TA calculation."""
        project = Project(name="Test", duration_months=12)
        project.throughput_config = ThroughputConfig(
            old_capacity=100,
            new_capacity=200,
            value_per_unit=50,
            utilization_rate=0.80
        )

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # (200 - 100) * 50 * 0.80 = 4,000
        assert breakdown.ta == pytest.approx(4000, rel=0.01)

    def test_ta_no_config(self):
        """Test TA with no config returns zero."""
        project = Project(name="Test", duration_months=12)
        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()
        assert breakdown.ta == 0

    def test_ta_no_increase(self):
        """Test TA with no capacity increase returns zero."""
        project = Project(name="Test", duration_months=12)
        project.throughput_config = ThroughputConfig(
            old_capacity=100,
            new_capacity=100,  # Same capacity
            value_per_unit=50
        )
        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()
        assert breakdown.ta == 0


class TestDQPCalculation:
    """Tests for Decision Quality Premium calculations."""

    def test_dqp_calculation(self):
        """Test DQP calculation."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Decision Task",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=0.95,  # AI is 95% accurate
            volume_per_week=100,
            error_cost=500,
            baseline_error_rate=0.15  # Humans make 15% errors
        ))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Error reduction: 0.15 - 0.05 = 0.10
        # Decisions: 100/week * 4.33 = 433/month
        # DQP: 433 * 0.10 * 500 = 21,650
        assert breakdown.dqp > 0

    def test_dqp_no_error_data(self):
        """Test DQP with no error data returns zero."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=50
            # No error_cost or baseline_error_rate
        ))

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()
        assert breakdown.dqp == 0


class TestLVCalculation:
    """Tests for Latency Value calculations."""

    def test_lv_calculation(self):
        """Test basic LV calculation."""
        project = Project(name="Test", duration_months=12)
        project.latency_config = LatencyConfig(
            transactions_per_month=1000,
            old_time_hours=2,
            new_time_hours=0.5,
            value_per_hour_saved=25,
            time_sensitivity_factor=1.0
        )

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Time saved: 2 - 0.5 = 1.5 hours
        # LV: 1000 * 1.5 * 25 * 1.0 = 37,500
        assert breakdown.lv == pytest.approx(37500, rel=0.01)

    def test_lv_no_config(self):
        """Test LV with no config returns zero."""
        project = Project(name="Test", duration_months=12)
        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()
        assert breakdown.lv == 0


class TestOLVCalculation:
    """Tests for Optionality & Learning Value calculations."""

    def test_olv_calculation(self):
        """Test OLV calculation."""
        project = Project(name="Test", duration_months=12)
        project.optionality_config = OptionalityConfig(
            process_insights_value=60000,  # Annual
            data_asset_value=24000,
            capability_options_value=12000,
            probability_factor=0.5
        )

        calculator = AURACalculator(project)
        breakdown = calculator._calculate_value_breakdown()

        # Total annual: 96,000
        # Monthly: 96,000 / 12 = 8,000
        # With probability: 8,000 * 0.5 = 4,000
        assert breakdown.olv == pytest.approx(4000, rel=0.01)


class TestFullCalculation:
    """Tests for complete ROI calculation."""

    def test_complete_calculation(self):
        """Test complete ROI calculation flow."""
        project = Project(
            name="Customer Service Agent",
            duration_months=24,
            industry=Industry.RETAIL
        )
        project.add_task(Task(
            name="Email Response",
            hours_per_week=40,
            hourly_rate=35,
            accuracy=0.92,
            oversight_rate=0.10
        ))
        project.costs = CostStructure(
            initial_development=50000,
            platform_monthly=2000
        )
        project.risk_profile = RiskProfile(
            technical_risk=0.10,
            adoption_risk=0.15
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        assert results.project_name == "Customer Service Agent"
        assert results.duration_months == 24
        assert results.total_gross_value > 0
        assert results.total_risk_adjusted_value < results.total_gross_value
        assert results.total_cost > 0

    def test_roi_calculation(self):
        """Test ROI percentage calculation."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=100,  # High rate for clear positive ROI
            accuracy=0.95
        ))
        project.costs = CostStructure(
            initial_development=10000,
            platform_monthly=500
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # ROI = (Value - Cost) / Cost * 100
        expected_roi = (
            (results.total_risk_adjusted_value - results.total_cost) /
            results.total_cost * 100
        )
        assert results.roi_percentage == pytest.approx(expected_roi, rel=0.01)

    def test_payback_period(self):
        """Test payback period calculation."""
        project = Project(name="Test", duration_months=24)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=100
        ))
        project.costs = CostStructure(
            initial_development=20000,
            platform_monthly=1000
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # Should have a payback period
        assert results.payback_months is not None
        assert results.payback_months > 0
        assert results.payback_months <= 24

    def test_npv_calculation(self):
        """Test NPV calculation."""
        project = Project(name="Test", duration_months=12, discount_rate=0.10)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=50
        ))
        project.costs = CostStructure(
            initial_development=10000,
            platform_monthly=500
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # NPV should be calculated
        assert isinstance(results.net_present_value, float)


class TestMaturityProjections:
    """Tests for maturity-based projections."""

    def test_monthly_projections_count(self):
        """Test that projections match duration."""
        project = Project(name="Test", duration_months=24)
        project.add_task(Task(name="Task", hours_per_week=40, hourly_rate=50))

        calculator = AURACalculator(project)
        results = calculator.calculate()

        assert len(results.monthly_projections) == 24

    def test_maturity_multipliers_applied(self):
        """Test that maturity multipliers are applied correctly."""
        project = Project(name="Test", duration_months=24)
        project.add_task(Task(name="Task", hours_per_week=40, hourly_rate=50))
        project.maturity_config = MaturityConfig(
            pilot_duration_months=3,
            pilot_multiplier=0.3,
            proven_multiplier=0.7
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # First month should use pilot multiplier
        assert results.monthly_projections[0].maturity_multiplier == 0.3

        # Month 4 should use proven multiplier
        assert results.monthly_projections[3].maturity_multiplier == 0.7

    def test_cumulative_net_value(self):
        """Test cumulative net value calculation."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(name="Task", hours_per_week=40, hourly_rate=50))
        project.costs = CostStructure(
            initial_development=10000,
            platform_monthly=500
        )

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # First month cumulative should include initial investment (negative)
        assert results.monthly_projections[0].cumulative_net_value < 0

        # Last month should reflect all accumulated value
        final_cumulative = results.monthly_projections[-1].cumulative_net_value
        total_net = sum(p.net_value for p in results.monthly_projections)
        initial_investment = -project.costs.total_initial
        assert final_cumulative == pytest.approx(total_net + initial_investment, rel=0.01)


class TestSensitivityAnalysis:
    """Tests for sensitivity analysis."""

    def test_sensitivity_analysis(self):
        """Test sensitivity analysis with accuracy parameter."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(
            name="Task",
            hours_per_week=40,
            hourly_rate=50,
            accuracy=0.90
        ))
        project.costs = CostStructure(
            initial_development=10000,
            platform_monthly=500
        )

        calculator = AURACalculator(project)
        variations = [0.8, 0.9, 1.0, 1.1, 1.2]
        results = calculator.sensitivity_analysis("accuracy", variations)

        assert len(results) == 5

        # Higher accuracy should generally lead to better ROI
        npvs = [r[1].net_present_value for r in results]
        # NPV should increase with accuracy multiplier (up to 1.0 accuracy cap)
        assert npvs[0] < npvs[2]  # 0.8x < 1.0x


class TestEdgeCases:
    """Tests for edge cases."""

    def test_zero_cost_project(self):
        """Test project with zero costs."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(name="Task", hours_per_week=40, hourly_rate=50))
        project.costs = CostStructure()  # All zeros

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # Should handle zero costs gracefully
        assert results.total_cost == 0
        # ROI would be infinite, but we handle it
        assert results.roi_percentage == 0 or results.roi_percentage > 0

    def test_no_tasks_project(self):
        """Test project with no tasks."""
        project = Project(name="Test", duration_months=12)
        project.costs = CostStructure(initial_development=10000)

        calculator = AURACalculator(project)
        results = calculator.calculate()

        # Should have zero value but still calculate
        assert results.value_breakdown.total == 0
        assert results.total_cost > 0
        assert results.roi_percentage < 0  # Negative ROI with no value

    def test_project_validation(self):
        """Test project validation."""
        with pytest.raises(ValueError):
            project = Project(name="", duration_months=12)
            AURACalculator(project)

        with pytest.raises(ValueError):
            project = Project(name="Test", duration_months=0)
            AURACalculator(project)
