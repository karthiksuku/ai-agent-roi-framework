"""
Data models for the AURA Framework.

This module defines all the data structures used in ROI calculations,
including tasks, projects, costs, risks, and results.
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum
import json


class Industry(Enum):
    """Supported industry categories."""
    HEALTHCARE = "healthcare"
    GOVERNMENT = "government"
    MANUFACTURING = "manufacturing"
    RETAIL = "retail"
    FINANCIAL_SERVICES = "financial_services"
    TECHNOLOGY = "technology"
    EDUCATION = "education"
    UTILITIES = "utilities"
    PROFESSIONAL_SERVICES = "professional_services"
    OTHER = "other"


class MaturityStage(Enum):
    """AI agent maturity stages."""
    PILOT = "pilot"
    PROVEN = "proven"
    SCALED = "scaled"
    OPTIMIZED = "optimized"


@dataclass
class Task:
    """
    Represents a task that an AI agent will perform.

    This is the fundamental unit of work for calculating Direct Labour Arbitrage.

    Attributes:
        name: Descriptive name for the task
        hours_per_week: Number of hours spent on this task per week
        hourly_rate: Loaded hourly cost (salary + benefits + overhead)
        accuracy: Agent accuracy rate (0.0 to 1.0)
        oversight_rate: Percentage of tasks requiring human review (0.0 to 1.0)
        volume_per_week: Number of task instances per week (optional, for TA/LV)
        time_per_task_minutes: Time per task instance in minutes (optional)
        error_cost: Cost per error when task is done incorrectly (optional, for DQP)
        baseline_error_rate: Human error rate without AI (optional, for DQP)

    Example:
        >>> task = Task(
        ...     name="Email Response",
        ...     hours_per_week=40,
        ...     hourly_rate=35.0,
        ...     accuracy=0.92,
        ...     oversight_rate=0.15
        ... )
    """
    name: str
    hours_per_week: float
    hourly_rate: float
    accuracy: float = 0.90
    oversight_rate: float = 0.10
    volume_per_week: Optional[int] = None
    time_per_task_minutes: Optional[float] = None
    error_cost: Optional[float] = None
    baseline_error_rate: Optional[float] = None

    def __post_init__(self) -> None:
        """Validate task parameters."""
        if self.hours_per_week < 0:
            raise ValueError("hours_per_week must be non-negative")
        if self.hourly_rate < 0:
            raise ValueError("hourly_rate must be non-negative")
        if not 0 <= self.accuracy <= 1:
            raise ValueError("accuracy must be between 0 and 1")
        if not 0 <= self.oversight_rate <= 1:
            raise ValueError("oversight_rate must be between 0 and 1")

    def to_dict(self) -> Dict[str, Any]:
        """Convert task to dictionary."""
        return {
            "name": self.name,
            "hours_per_week": self.hours_per_week,
            "hourly_rate": self.hourly_rate,
            "accuracy": self.accuracy,
            "oversight_rate": self.oversight_rate,
            "volume_per_week": self.volume_per_week,
            "time_per_task_minutes": self.time_per_task_minutes,
            "error_cost": self.error_cost,
            "baseline_error_rate": self.baseline_error_rate,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Task":
        """Create task from dictionary."""
        return cls(**data)


@dataclass
class ThroughputConfig:
    """
    Configuration for Throughput Amplification (TA) calculations.

    Attributes:
        old_capacity: Previous capacity (units per time period)
        new_capacity: New capacity with AI agent
        value_per_unit: Economic value per unit processed
        utilization_rate: Expected utilization of new capacity (0.0 to 1.0)
        capacity_unit: Description of capacity unit (e.g., "transactions/day")
    """
    old_capacity: float
    new_capacity: float
    value_per_unit: float
    utilization_rate: float = 0.85
    capacity_unit: str = "units"

    def __post_init__(self) -> None:
        if self.old_capacity < 0 or self.new_capacity < 0:
            raise ValueError("Capacity values must be non-negative")
        if not 0 <= self.utilization_rate <= 1:
            raise ValueError("utilization_rate must be between 0 and 1")


@dataclass
class LatencyConfig:
    """
    Configuration for Latency Value (LV) calculations.

    Attributes:
        transactions_per_month: Number of transactions affected
        old_time_hours: Previous processing time in hours
        new_time_hours: New processing time with AI
        value_per_hour_saved: Economic value of each hour saved
        time_sensitivity_factor: Multiplier for time-critical processes
    """
    transactions_per_month: float
    old_time_hours: float
    new_time_hours: float
    value_per_hour_saved: float
    time_sensitivity_factor: float = 1.0

    def __post_init__(self) -> None:
        if self.old_time_hours < 0 or self.new_time_hours < 0:
            raise ValueError("Time values must be non-negative")
        if self.new_time_hours > self.old_time_hours:
            raise ValueError("new_time_hours should be less than old_time_hours")


@dataclass
class OptionalityConfig:
    """
    Configuration for Optionality & Learning Value (OLV) calculations.

    Attributes:
        process_insights_value: Value of process optimization insights
        data_asset_value: Value of data collected and analyzed
        capability_options_value: Strategic value of new capabilities enabled
        probability_factor: Likelihood of realizing optionality value (0.0 to 1.0)
    """
    process_insights_value: float = 0.0
    data_asset_value: float = 0.0
    capability_options_value: float = 0.0
    probability_factor: float = 0.5

    def __post_init__(self) -> None:
        if not 0 <= self.probability_factor <= 1:
            raise ValueError("probability_factor must be between 0 and 1")


@dataclass
class CostStructure:
    """
    Complete cost structure for an AI agent project.

    Attributes:
        initial_development: One-time development/implementation cost
        platform_monthly: Monthly platform/infrastructure cost
        api_cost_per_call: Cost per API call (for usage-based pricing)
        estimated_calls_per_month: Estimated API calls per month
        maintenance_monthly: Monthly maintenance and support cost
        training_initial: Initial training cost
        training_ongoing_monthly: Ongoing training cost per month
        change_management: Change management and adoption costs

    Example:
        >>> costs = CostStructure(
        ...     initial_development=50000,
        ...     platform_monthly=2000,
        ...     api_cost_per_call=0.01,
        ...     estimated_calls_per_month=100000
        ... )
    """
    initial_development: float = 0.0
    platform_monthly: float = 0.0
    api_cost_per_call: float = 0.0
    estimated_calls_per_month: float = 0.0
    maintenance_monthly: float = 0.0
    training_initial: float = 0.0
    training_ongoing_monthly: float = 0.0
    change_management: float = 0.0

    @property
    def total_initial(self) -> float:
        """Calculate total initial (one-time) costs."""
        return (
            self.initial_development +
            self.training_initial +
            self.change_management
        )

    @property
    def total_monthly(self) -> float:
        """Calculate total monthly recurring costs."""
        api_monthly = self.api_cost_per_call * self.estimated_calls_per_month
        return (
            self.platform_monthly +
            api_monthly +
            self.maintenance_monthly +
            self.training_ongoing_monthly
        )

    def total_cost_over_period(self, months: int) -> float:
        """Calculate total cost over a given period."""
        return self.total_initial + (self.total_monthly * months)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "initial_development": self.initial_development,
            "platform_monthly": self.platform_monthly,
            "api_cost_per_call": self.api_cost_per_call,
            "estimated_calls_per_month": self.estimated_calls_per_month,
            "maintenance_monthly": self.maintenance_monthly,
            "training_initial": self.training_initial,
            "training_ongoing_monthly": self.training_ongoing_monthly,
            "change_management": self.change_management,
        }


@dataclass
class RiskProfile:
    """
    Risk assessment for the AI agent project.

    Each risk is scored from 0.0 (no risk) to 1.0 (maximum risk).

    Attributes:
        technical_risk: Model degradation, hallucinations, integration failures
        adoption_risk: User resistance, training gaps, change management
        regulatory_risk: Compliance changes, explainability requirements
        vendor_risk: Platform changes, pricing shifts, API deprecation

    Example:
        >>> risk = RiskProfile(
        ...     technical_risk=0.15,
        ...     adoption_risk=0.20,
        ...     regulatory_risk=0.10,
        ...     vendor_risk=0.05
        ... )
    """
    technical_risk: float = 0.10
    adoption_risk: float = 0.15
    regulatory_risk: float = 0.05
    vendor_risk: float = 0.05

    def __post_init__(self) -> None:
        """Validate risk values."""
        for name in ["technical_risk", "adoption_risk", "regulatory_risk", "vendor_risk"]:
            value = getattr(self, name)
            if not 0 <= value <= 1:
                raise ValueError(f"{name} must be between 0 and 1")

    @property
    def composite_risk(self) -> float:
        """
        Calculate composite risk score.

        Uses a weighted average with technical and adoption risks
        weighted more heavily as they're typically more impactful.
        """
        weights = {
            "technical_risk": 0.35,
            "adoption_risk": 0.35,
            "regulatory_risk": 0.15,
            "vendor_risk": 0.15,
        }
        return sum(
            getattr(self, name) * weight
            for name, weight in weights.items()
        )

    @property
    def risk_adjustment_factor(self) -> float:
        """
        Calculate the risk adjustment factor.

        Returns a multiplier (0.0 to 1.0) to apply to gross value.
        """
        return 1 - self.composite_risk

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "technical_risk": self.technical_risk,
            "adoption_risk": self.adoption_risk,
            "regulatory_risk": self.regulatory_risk,
            "vendor_risk": self.vendor_risk,
            "composite_risk": self.composite_risk,
            "risk_adjustment_factor": self.risk_adjustment_factor,
        }


@dataclass
class MaturityConfig:
    """
    Configuration for the maturity model.

    Attributes:
        pilot_duration_months: Duration of pilot phase
        proven_duration_months: Duration of proven phase
        scaled_duration_months: Duration of scaled phase
        learning_rate: Monthly learning/improvement rate
        pilot_multiplier: Value multiplier during pilot
        proven_multiplier: Value multiplier during proven phase
        scaled_multiplier: Value multiplier during scaled phase
        optimized_multiplier: Value multiplier during optimized phase
        adoption_curve_steepness: How quickly adoption ramps up (sigmoid steepness)
    """
    pilot_duration_months: int = 3
    proven_duration_months: int = 6
    scaled_duration_months: int = 9
    learning_rate: float = 0.02
    pilot_multiplier: float = 0.3
    proven_multiplier: float = 0.7
    scaled_multiplier: float = 1.0
    optimized_multiplier: float = 1.3
    adoption_curve_steepness: float = 0.5

    def get_multiplier_at_month(self, month: int) -> float:
        """
        Get the maturity multiplier for a specific month.

        Args:
            month: The month number (1-indexed)

        Returns:
            The multiplier to apply to base value
        """
        if month <= self.pilot_duration_months:
            return self.pilot_multiplier
        elif month <= self.pilot_duration_months + self.proven_duration_months:
            return self.proven_multiplier
        elif month <= (self.pilot_duration_months +
                      self.proven_duration_months +
                      self.scaled_duration_months):
            return self.scaled_multiplier
        else:
            # Apply learning rate growth in optimized phase
            months_in_optimized = month - (
                self.pilot_duration_months +
                self.proven_duration_months +
                self.scaled_duration_months
            )
            growth = (1 + self.learning_rate) ** months_in_optimized
            return min(self.optimized_multiplier * growth, 1.8)  # Cap at 1.8x

    def get_stage_at_month(self, month: int) -> MaturityStage:
        """Get the maturity stage for a specific month."""
        if month <= self.pilot_duration_months:
            return MaturityStage.PILOT
        elif month <= self.pilot_duration_months + self.proven_duration_months:
            return MaturityStage.PROVEN
        elif month <= (self.pilot_duration_months +
                      self.proven_duration_months +
                      self.scaled_duration_months):
            return MaturityStage.SCALED
        else:
            return MaturityStage.OPTIMIZED


@dataclass
class ValueBreakdown:
    """
    Breakdown of value by dimension.

    Attributes:
        dla: Direct Labour Arbitrage value
        ta: Throughput Amplification value
        dqp: Decision Quality Premium value
        lv: Latency Value
        olv: Optionality & Learning Value
    """
    dla: float = 0.0
    ta: float = 0.0
    dqp: float = 0.0
    lv: float = 0.0
    olv: float = 0.0

    @property
    def total(self) -> float:
        """Total gross value across all dimensions."""
        return self.dla + self.ta + self.dqp + self.lv + self.olv

    def to_dict(self) -> Dict[str, float]:
        """Convert to dictionary."""
        return {
            "dla": self.dla,
            "ta": self.ta,
            "dqp": self.dqp,
            "lv": self.lv,
            "olv": self.olv,
            "total": self.total,
        }


@dataclass
class MonthlyProjection:
    """
    Projection for a single month.

    Attributes:
        month: Month number (1-indexed)
        stage: Maturity stage
        maturity_multiplier: Maturity multiplier applied
        gross_value: Gross value before adjustments
        risk_adjusted_value: Value after risk adjustment
        cost: Cost for this month
        net_value: Net value (risk-adjusted value minus cost)
        cumulative_net_value: Running total of net value
    """
    month: int
    stage: MaturityStage
    maturity_multiplier: float
    gross_value: float
    risk_adjusted_value: float
    cost: float
    net_value: float
    cumulative_net_value: float
    value_breakdown: Optional[ValueBreakdown] = None


@dataclass
class AURAResults:
    """
    Complete results from an AURA ROI calculation.

    Attributes:
        project_name: Name of the project analyzed
        duration_months: Analysis duration in months
        value_breakdown: Breakdown by value dimension
        total_gross_value: Total value before adjustments
        total_risk_adjusted_value: Total value after risk adjustment
        total_cost: Total cost over the period
        net_present_value: NPV at discount rate
        roi_percentage: Return on investment percentage
        payback_months: Time to break even in months
        irr: Internal rate of return (if calculable)
        monthly_projections: Month-by-month projections
        risk_profile: Risk profile used
        maturity_config: Maturity configuration used
    """
    project_name: str
    duration_months: int
    value_breakdown: ValueBreakdown
    total_gross_value: float
    total_risk_adjusted_value: float
    total_cost: float
    net_present_value: float
    roi_percentage: float
    payback_months: Optional[float]
    irr: Optional[float]
    monthly_projections: List[MonthlyProjection]
    risk_profile: RiskProfile
    maturity_config: MaturityConfig
    discount_rate: float = 0.10

    def to_dict(self) -> Dict[str, Any]:
        """Convert results to dictionary for serialization."""
        return {
            "project_name": self.project_name,
            "duration_months": self.duration_months,
            "summary": {
                "total_gross_value": self.total_gross_value,
                "total_risk_adjusted_value": self.total_risk_adjusted_value,
                "total_cost": self.total_cost,
                "net_present_value": self.net_present_value,
                "roi_percentage": self.roi_percentage,
                "payback_months": self.payback_months,
                "irr": self.irr,
            },
            "value_breakdown": self.value_breakdown.to_dict(),
            "risk_profile": self.risk_profile.to_dict(),
            "discount_rate": self.discount_rate,
        }

    def to_json(self, indent: int = 2) -> str:
        """Convert results to JSON string."""
        return json.dumps(self.to_dict(), indent=indent)


@dataclass
class Project:
    """
    Complete project definition for AURA analysis.

    Attributes:
        name: Project name
        duration_months: Analysis duration
        industry: Industry category
        tasks: List of tasks the agent will perform
        costs: Cost structure
        risk_profile: Risk assessment
        maturity_config: Maturity model configuration
        throughput_config: Throughput amplification configuration
        latency_config: Latency value configuration
        optionality_config: Optionality configuration
        discount_rate: Annual discount rate for NPV

    Example:
        >>> project = Project(
        ...     name="Customer Service Agent",
        ...     duration_months=24,
        ...     industry=Industry.RETAIL
        ... )
        >>> project.add_task(Task(
        ...     name="Email Response",
        ...     hours_per_week=40,
        ...     hourly_rate=35.0
        ... ))
    """
    name: str
    duration_months: int = 24
    industry: Industry = Industry.OTHER
    tasks: List[Task] = field(default_factory=list)
    costs: CostStructure = field(default_factory=CostStructure)
    risk_profile: RiskProfile = field(default_factory=RiskProfile)
    maturity_config: MaturityConfig = field(default_factory=MaturityConfig)
    throughput_config: Optional[ThroughputConfig] = None
    latency_config: Optional[LatencyConfig] = None
    optionality_config: Optional[OptionalityConfig] = None
    discount_rate: float = 0.10

    def add_task(self, task: Task) -> None:
        """Add a task to the project."""
        self.tasks.append(task)

    def set_costs(self, costs: CostStructure) -> None:
        """Set the cost structure."""
        self.costs = costs

    def set_risk_profile(self, risk: RiskProfile) -> None:
        """Set the risk profile."""
        self.risk_profile = risk

    def to_dict(self) -> Dict[str, Any]:
        """Convert project to dictionary."""
        return {
            "name": self.name,
            "duration_months": self.duration_months,
            "industry": self.industry.value if isinstance(self.industry, Industry) else self.industry,
            "tasks": [t.to_dict() for t in self.tasks],
            "costs": self.costs.to_dict(),
            "risk_profile": self.risk_profile.to_dict(),
            "discount_rate": self.discount_rate,
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Project":
        """Create project from dictionary."""
        project = cls(
            name=data["name"],
            duration_months=data.get("duration_months", 24),
            industry=Industry(data.get("industry", "other")),
            discount_rate=data.get("discount_rate", 0.10),
        )

        for task_data in data.get("tasks", []):
            project.add_task(Task.from_dict(task_data))

        if "costs" in data:
            project.costs = CostStructure(**data["costs"])

        if "risk_profile" in data:
            risk_data = {k: v for k, v in data["risk_profile"].items()
                        if k not in ["composite_risk", "risk_adjustment_factor"]}
            project.risk_profile = RiskProfile(**risk_data)

        return project

    @classmethod
    def from_json(cls, json_str: str) -> "Project":
        """Create project from JSON string."""
        return cls.from_dict(json.loads(json_str))
