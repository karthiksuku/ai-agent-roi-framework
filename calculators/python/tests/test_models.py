"""Tests for AURA Framework data models."""

import pytest
import json

from aura_roi.models import (
    Task,
    Project,
    CostStructure,
    RiskProfile,
    MaturityConfig,
    ValueBreakdown,
    Industry,
    MaturityStage,
    ThroughputConfig,
    LatencyConfig,
    OptionalityConfig,
)


class TestTask:
    """Tests for Task model."""

    def test_task_creation(self):
        """Test basic task creation."""
        task = Task(
            name="Email Response",
            hours_per_week=40,
            hourly_rate=35.0,
            accuracy=0.92,
            oversight_rate=0.15
        )
        assert task.name == "Email Response"
        assert task.hours_per_week == 40
        assert task.hourly_rate == 35.0
        assert task.accuracy == 0.92
        assert task.oversight_rate == 0.15

    def test_task_default_values(self):
        """Test task default values."""
        task = Task(name="Test", hours_per_week=20, hourly_rate=50)
        assert task.accuracy == 0.90
        assert task.oversight_rate == 0.10

    def test_task_validation_negative_hours(self):
        """Test that negative hours raises error."""
        with pytest.raises(ValueError, match="hours_per_week must be non-negative"):
            Task(name="Test", hours_per_week=-10, hourly_rate=50)

    def test_task_validation_negative_rate(self):
        """Test that negative rate raises error."""
        with pytest.raises(ValueError, match="hourly_rate must be non-negative"):
            Task(name="Test", hours_per_week=40, hourly_rate=-50)

    def test_task_validation_accuracy_out_of_range(self):
        """Test that accuracy out of range raises error."""
        with pytest.raises(ValueError, match="accuracy must be between 0 and 1"):
            Task(name="Test", hours_per_week=40, hourly_rate=50, accuracy=1.5)

    def test_task_validation_oversight_out_of_range(self):
        """Test that oversight out of range raises error."""
        with pytest.raises(ValueError, match="oversight_rate must be between 0 and 1"):
            Task(name="Test", hours_per_week=40, hourly_rate=50, oversight_rate=-0.1)

    def test_task_to_dict(self):
        """Test task serialization to dictionary."""
        task = Task(name="Test", hours_per_week=40, hourly_rate=35)
        d = task.to_dict()
        assert d["name"] == "Test"
        assert d["hours_per_week"] == 40
        assert d["hourly_rate"] == 35

    def test_task_from_dict(self):
        """Test task creation from dictionary."""
        data = {
            "name": "Test",
            "hours_per_week": 40,
            "hourly_rate": 35,
            "accuracy": 0.95
        }
        task = Task.from_dict(data)
        assert task.name == "Test"
        assert task.accuracy == 0.95


class TestCostStructure:
    """Tests for CostStructure model."""

    def test_cost_structure_creation(self):
        """Test cost structure creation."""
        costs = CostStructure(
            initial_development=50000,
            platform_monthly=2000,
            api_cost_per_call=0.01,
            estimated_calls_per_month=100000
        )
        assert costs.initial_development == 50000
        assert costs.platform_monthly == 2000

    def test_total_initial(self):
        """Test total initial cost calculation."""
        costs = CostStructure(
            initial_development=50000,
            training_initial=10000,
            change_management=5000
        )
        assert costs.total_initial == 65000

    def test_total_monthly(self):
        """Test total monthly cost calculation."""
        costs = CostStructure(
            platform_monthly=2000,
            api_cost_per_call=0.01,
            estimated_calls_per_month=100000,
            maintenance_monthly=500,
            training_ongoing_monthly=200
        )
        # 2000 + (0.01 * 100000) + 500 + 200 = 3700
        assert costs.total_monthly == 3700

    def test_total_cost_over_period(self):
        """Test total cost over period calculation."""
        costs = CostStructure(
            initial_development=50000,
            platform_monthly=2000
        )
        # 50000 + (2000 * 12) = 74000
        assert costs.total_cost_over_period(12) == 74000


class TestRiskProfile:
    """Tests for RiskProfile model."""

    def test_risk_profile_creation(self):
        """Test risk profile creation."""
        risk = RiskProfile(
            technical_risk=0.15,
            adoption_risk=0.20,
            regulatory_risk=0.10,
            vendor_risk=0.05
        )
        assert risk.technical_risk == 0.15

    def test_risk_validation(self):
        """Test risk value validation."""
        with pytest.raises(ValueError):
            RiskProfile(technical_risk=1.5)

    def test_composite_risk(self):
        """Test composite risk calculation."""
        risk = RiskProfile(
            technical_risk=0.10,
            adoption_risk=0.10,
            regulatory_risk=0.10,
            vendor_risk=0.10
        )
        # All equal at 0.10 -> composite should be 0.10
        assert risk.composite_risk == pytest.approx(0.10, abs=0.01)

    def test_risk_adjustment_factor(self):
        """Test risk adjustment factor calculation."""
        risk = RiskProfile(
            technical_risk=0.10,
            adoption_risk=0.10,
            regulatory_risk=0.10,
            vendor_risk=0.10
        )
        assert risk.risk_adjustment_factor == pytest.approx(0.90, abs=0.01)


class TestMaturityConfig:
    """Tests for MaturityConfig model."""

    def test_maturity_config_defaults(self):
        """Test maturity config default values."""
        config = MaturityConfig()
        assert config.pilot_duration_months == 3
        assert config.proven_duration_months == 6
        assert config.pilot_multiplier == 0.3

    def test_get_multiplier_pilot(self):
        """Test multiplier during pilot phase."""
        config = MaturityConfig()
        assert config.get_multiplier_at_month(1) == 0.3
        assert config.get_multiplier_at_month(3) == 0.3

    def test_get_multiplier_proven(self):
        """Test multiplier during proven phase."""
        config = MaturityConfig()
        assert config.get_multiplier_at_month(4) == 0.7
        assert config.get_multiplier_at_month(9) == 0.7

    def test_get_multiplier_scaled(self):
        """Test multiplier during scaled phase."""
        config = MaturityConfig()
        assert config.get_multiplier_at_month(10) == 1.0
        assert config.get_multiplier_at_month(18) == 1.0

    def test_get_multiplier_optimized(self):
        """Test multiplier during optimized phase."""
        config = MaturityConfig()
        multiplier = config.get_multiplier_at_month(24)
        assert multiplier >= 1.3  # Should be at least the base optimized multiplier

    def test_get_stage(self):
        """Test stage determination at different months."""
        config = MaturityConfig()
        assert config.get_stage_at_month(1) == MaturityStage.PILOT
        assert config.get_stage_at_month(5) == MaturityStage.PROVEN
        assert config.get_stage_at_month(12) == MaturityStage.SCALED
        assert config.get_stage_at_month(24) == MaturityStage.OPTIMIZED


class TestProject:
    """Tests for Project model."""

    def test_project_creation(self):
        """Test project creation."""
        project = Project(
            name="Test Project",
            duration_months=24,
            industry=Industry.RETAIL
        )
        assert project.name == "Test Project"
        assert project.duration_months == 24
        assert project.industry == Industry.RETAIL

    def test_add_task(self):
        """Test adding task to project."""
        project = Project(name="Test")
        task = Task(name="Task 1", hours_per_week=40, hourly_rate=35)
        project.add_task(task)
        assert len(project.tasks) == 1
        assert project.tasks[0].name == "Task 1"

    def test_project_to_dict(self):
        """Test project serialization."""
        project = Project(name="Test", duration_months=12)
        project.add_task(Task(name="Task 1", hours_per_week=40, hourly_rate=35))
        d = project.to_dict()
        assert d["name"] == "Test"
        assert d["duration_months"] == 12
        assert len(d["tasks"]) == 1

    def test_project_from_dict(self):
        """Test project creation from dictionary."""
        data = {
            "name": "Test Project",
            "duration_months": 24,
            "industry": "retail",
            "tasks": [
                {"name": "Task 1", "hours_per_week": 40, "hourly_rate": 35}
            ]
        }
        project = Project.from_dict(data)
        assert project.name == "Test Project"
        assert len(project.tasks) == 1

    def test_project_from_json(self):
        """Test project creation from JSON string."""
        json_str = '{"name": "Test", "duration_months": 12, "tasks": []}'
        project = Project.from_json(json_str)
        assert project.name == "Test"


class TestValueBreakdown:
    """Tests for ValueBreakdown model."""

    def test_value_breakdown_total(self):
        """Test value breakdown total calculation."""
        breakdown = ValueBreakdown(
            dla=10000,
            ta=5000,
            dqp=3000,
            lv=2000,
            olv=1000
        )
        assert breakdown.total == 21000

    def test_value_breakdown_to_dict(self):
        """Test value breakdown serialization."""
        breakdown = ValueBreakdown(dla=10000)
        d = breakdown.to_dict()
        assert d["dla"] == 10000
        assert "total" in d


class TestThroughputConfig:
    """Tests for ThroughputConfig model."""

    def test_throughput_config_creation(self):
        """Test throughput config creation."""
        config = ThroughputConfig(
            old_capacity=100,
            new_capacity=200,
            value_per_unit=50
        )
        assert config.old_capacity == 100
        assert config.new_capacity == 200

    def test_throughput_config_validation(self):
        """Test throughput config validation."""
        with pytest.raises(ValueError):
            ThroughputConfig(
                old_capacity=-100,
                new_capacity=200,
                value_per_unit=50
            )


class TestLatencyConfig:
    """Tests for LatencyConfig model."""

    def test_latency_config_creation(self):
        """Test latency config creation."""
        config = LatencyConfig(
            transactions_per_month=1000,
            old_time_hours=2,
            new_time_hours=0.5,
            value_per_hour_saved=25
        )
        assert config.transactions_per_month == 1000
        assert config.old_time_hours == 2

    def test_latency_config_time_validation(self):
        """Test that new time cannot exceed old time."""
        with pytest.raises(ValueError):
            LatencyConfig(
                transactions_per_month=1000,
                old_time_hours=1,
                new_time_hours=2,
                value_per_hour_saved=25
            )


class TestOptionalityConfig:
    """Tests for OptionalityConfig model."""

    def test_optionality_config_creation(self):
        """Test optionality config creation."""
        config = OptionalityConfig(
            process_insights_value=50000,
            data_asset_value=30000,
            probability_factor=0.6
        )
        assert config.process_insights_value == 50000
        assert config.probability_factor == 0.6

    def test_optionality_config_validation(self):
        """Test probability factor validation."""
        with pytest.raises(ValueError):
            OptionalityConfig(probability_factor=1.5)
