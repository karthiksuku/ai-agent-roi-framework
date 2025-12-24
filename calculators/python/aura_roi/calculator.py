"""
Core AURA ROI Calculator.

This module implements the complete AURA methodology for calculating
return on investment for AI agent projects.
"""

from typing import List, Optional, Tuple
import math

from .models import (
    Project,
    Task,
    CostStructure,
    RiskProfile,
    MaturityConfig,
    ThroughputConfig,
    LatencyConfig,
    OptionalityConfig,
    AURAResults,
    ValueBreakdown,
    MonthlyProjection,
    MaturityStage,
)


class AURACalculator:
    """
    Main calculator for AURA ROI analysis.

    The calculator takes a Project definition and computes comprehensive
    ROI metrics including NPV, IRR, payback period, and monthly projections.

    Example:
        >>> from aura_roi import AURACalculator, Project, Task
        >>> project = Project(name="Customer Service Bot", duration_months=24)
        >>> project.add_task(Task(
        ...     name="Email Response",
        ...     hours_per_week=40,
        ...     hourly_rate=35.0,
        ...     accuracy=0.92
        ... ))
        >>> calculator = AURACalculator(project)
        >>> results = calculator.calculate()
        >>> print(f"ROI: {results.roi_percentage:.1f}%")
    """

    WEEKS_PER_MONTH = 4.33
    MONTHS_PER_YEAR = 12

    def __init__(self, project: Project):
        """
        Initialize the calculator with a project.

        Args:
            project: The Project to analyze
        """
        self.project = project
        self._validate_project()

    def _validate_project(self) -> None:
        """Validate the project has required data."""
        if not self.project.name:
            raise ValueError("Project must have a name")
        if self.project.duration_months <= 0:
            raise ValueError("Project duration must be positive")

    def calculate(self) -> AURAResults:
        """
        Perform the complete AURA ROI calculation.

        Returns:
            AURAResults containing all calculated metrics
        """
        # Calculate base monthly values for each dimension
        value_breakdown = self._calculate_value_breakdown()

        # Generate monthly projections
        monthly_projections = self._generate_monthly_projections(value_breakdown)

        # Calculate aggregate metrics
        total_gross = sum(p.gross_value for p in monthly_projections)
        total_risk_adjusted = sum(p.risk_adjusted_value for p in monthly_projections)
        total_cost = sum(p.cost for p in monthly_projections)

        # Calculate NPV
        npv = self._calculate_npv(monthly_projections)

        # Calculate payback period
        payback = self._calculate_payback_period(monthly_projections)

        # Calculate IRR
        irr = self._calculate_irr(monthly_projections)

        # Calculate ROI
        roi = ((total_risk_adjusted - total_cost) / total_cost * 100
               if total_cost > 0 else 0)

        return AURAResults(
            project_name=self.project.name,
            duration_months=self.project.duration_months,
            value_breakdown=value_breakdown,
            total_gross_value=total_gross,
            total_risk_adjusted_value=total_risk_adjusted,
            total_cost=total_cost,
            net_present_value=npv,
            roi_percentage=roi,
            payback_months=payback,
            irr=irr,
            monthly_projections=monthly_projections,
            risk_profile=self.project.risk_profile,
            maturity_config=self.project.maturity_config,
            discount_rate=self.project.discount_rate,
        )

    def _calculate_value_breakdown(self) -> ValueBreakdown:
        """
        Calculate the monthly base value for each dimension.

        Returns:
            ValueBreakdown with monthly values (before maturity adjustment)
        """
        dla = self._calculate_dla()
        ta = self._calculate_ta()
        dqp = self._calculate_dqp()
        lv = self._calculate_lv()
        olv = self._calculate_olv()

        return ValueBreakdown(
            dla=dla,
            ta=ta,
            dqp=dqp,
            lv=lv,
            olv=olv,
        )

    def _calculate_dla(self) -> float:
        """
        Calculate Direct Labour Arbitrage (DLA).

        DLA = Sum of (Hours Saved × Hourly Rate × Accuracy × (1 - Oversight Rate))

        Returns:
            Monthly DLA value
        """
        total_dla = 0.0

        for task in self.project.tasks:
            monthly_hours = task.hours_per_week * self.WEEKS_PER_MONTH
            effective_accuracy = task.accuracy * (1 - task.oversight_rate)
            task_dla = monthly_hours * task.hourly_rate * effective_accuracy
            total_dla += task_dla

        return total_dla

    def _calculate_ta(self) -> float:
        """
        Calculate Throughput Amplification (TA).

        TA = (New Capacity - Old Capacity) × Value Per Unit × Utilization Rate

        Returns:
            Monthly TA value
        """
        config = self.project.throughput_config
        if not config:
            return 0.0

        capacity_increase = config.new_capacity - config.old_capacity
        if capacity_increase <= 0:
            return 0.0

        return (
            capacity_increase *
            config.value_per_unit *
            config.utilization_rate
        )

    def _calculate_dqp(self) -> float:
        """
        Calculate Decision Quality Premium (DQP).

        DQP = Decisions Made × Error Reduction × Cost Per Error

        Returns:
            Monthly DQP value
        """
        total_dqp = 0.0

        for task in self.project.tasks:
            if task.error_cost and task.baseline_error_rate:
                # Calculate decisions per month
                if task.volume_per_week:
                    decisions_per_month = task.volume_per_week * self.WEEKS_PER_MONTH
                else:
                    # Estimate from hours if volume not provided
                    if task.time_per_task_minutes:
                        decisions_per_month = (
                            task.hours_per_week * 60 /
                            task.time_per_task_minutes *
                            self.WEEKS_PER_MONTH
                        )
                    else:
                        continue

                # Error reduction = baseline error rate - AI error rate
                ai_error_rate = 1 - task.accuracy
                error_reduction = max(0, task.baseline_error_rate - ai_error_rate)

                task_dqp = decisions_per_month * error_reduction * task.error_cost
                total_dqp += task_dqp

        return total_dqp

    def _calculate_lv(self) -> float:
        """
        Calculate Latency Value (LV).

        LV = Transactions × Time Saved × Value of Time × Sensitivity Factor

        Returns:
            Monthly LV value
        """
        config = self.project.latency_config
        if not config:
            return 0.0

        time_saved = config.old_time_hours - config.new_time_hours
        if time_saved <= 0:
            return 0.0

        return (
            config.transactions_per_month *
            time_saved *
            config.value_per_hour_saved *
            config.time_sensitivity_factor
        )

    def _calculate_olv(self) -> float:
        """
        Calculate Optionality & Learning Value (OLV).

        OLV = (Process Insights + Data Assets + Capabilities) × Probability

        Returns:
            Monthly OLV value (annualized values divided by 12)
        """
        config = self.project.optionality_config
        if not config:
            return 0.0

        annual_value = (
            config.process_insights_value +
            config.data_asset_value +
            config.capability_options_value
        )

        # Annualized value spread across months
        monthly_value = annual_value / self.MONTHS_PER_YEAR

        return monthly_value * config.probability_factor

    def _generate_monthly_projections(
        self,
        value_breakdown: ValueBreakdown
    ) -> List[MonthlyProjection]:
        """
        Generate month-by-month projections.

        Args:
            value_breakdown: Base monthly value breakdown

        Returns:
            List of MonthlyProjection for each month
        """
        projections = []
        cumulative_net = -self.project.costs.total_initial  # Start with initial investment
        base_monthly_value = value_breakdown.total

        for month in range(1, self.project.duration_months + 1):
            # Get maturity multiplier and stage
            multiplier = self.project.maturity_config.get_multiplier_at_month(month)
            stage = self.project.maturity_config.get_stage_at_month(month)

            # Apply maturity multiplier to get gross value
            gross_value = base_monthly_value * multiplier

            # Apply risk adjustment
            risk_adjusted_value = (
                gross_value *
                self.project.risk_profile.risk_adjustment_factor
            )

            # Calculate cost for this month
            if month == 1:
                cost = self.project.costs.total_initial + self.project.costs.total_monthly
            else:
                cost = self.project.costs.total_monthly

            # Calculate net value
            net_value = risk_adjusted_value - cost
            cumulative_net += net_value

            # Create monthly value breakdown
            monthly_breakdown = ValueBreakdown(
                dla=value_breakdown.dla * multiplier,
                ta=value_breakdown.ta * multiplier,
                dqp=value_breakdown.dqp * multiplier,
                lv=value_breakdown.lv * multiplier,
                olv=value_breakdown.olv * multiplier,
            )

            projections.append(MonthlyProjection(
                month=month,
                stage=stage,
                maturity_multiplier=multiplier,
                gross_value=gross_value,
                risk_adjusted_value=risk_adjusted_value,
                cost=cost,
                net_value=net_value,
                cumulative_net_value=cumulative_net,
                value_breakdown=monthly_breakdown,
            ))

        return projections

    def _calculate_npv(self, projections: List[MonthlyProjection]) -> float:
        """
        Calculate Net Present Value.

        NPV = Sum of (Net Cash Flow_t / (1 + r)^t)

        Args:
            projections: Monthly projections

        Returns:
            Net Present Value
        """
        monthly_rate = self.project.discount_rate / self.MONTHS_PER_YEAR
        npv = 0.0

        for projection in projections:
            discount_factor = (1 + monthly_rate) ** projection.month
            npv += projection.net_value / discount_factor

        return npv

    def _calculate_payback_period(
        self,
        projections: List[MonthlyProjection]
    ) -> Optional[float]:
        """
        Calculate payback period in months.

        Uses linear interpolation to find the exact break-even point.

        Args:
            projections: Monthly projections

        Returns:
            Payback period in months, or None if never achieved
        """
        for i, projection in enumerate(projections):
            if projection.cumulative_net_value >= 0:
                if i == 0:
                    return projection.month
                else:
                    # Linear interpolation
                    prev = projections[i - 1]
                    value_change = projection.cumulative_net_value - prev.cumulative_net_value
                    if value_change != 0:
                        fraction = -prev.cumulative_net_value / value_change
                        return prev.month + fraction
                    return projection.month

        return None  # Never breaks even

    def _calculate_irr(
        self,
        projections: List[MonthlyProjection],
        max_iterations: int = 100,
        tolerance: float = 1e-6
    ) -> Optional[float]:
        """
        Calculate Internal Rate of Return using Newton-Raphson method.

        Args:
            projections: Monthly projections
            max_iterations: Maximum iterations for convergence
            tolerance: Convergence tolerance

        Returns:
            Annual IRR, or None if cannot be calculated
        """
        # Get cash flows (initial investment is negative)
        cash_flows = [p.net_value for p in projections]

        # If all cash flows are the same sign, IRR doesn't exist
        if all(cf >= 0 for cf in cash_flows) or all(cf <= 0 for cf in cash_flows):
            return None

        # Newton-Raphson method
        rate = 0.1 / self.MONTHS_PER_YEAR  # Start with 10% annual rate converted to monthly

        for _ in range(max_iterations):
            npv = 0.0
            npv_derivative = 0.0

            for t, cf in enumerate(cash_flows, 1):
                discount = (1 + rate) ** t
                npv += cf / discount
                npv_derivative -= t * cf / (discount * (1 + rate))

            if abs(npv_derivative) < tolerance:
                return None  # Derivative too small

            new_rate = rate - npv / npv_derivative

            if abs(new_rate - rate) < tolerance:
                # Convert monthly rate to annual rate
                annual_rate = (1 + new_rate) ** self.MONTHS_PER_YEAR - 1
                return annual_rate * 100  # Return as percentage

            rate = new_rate

        return None  # Failed to converge

    def sensitivity_analysis(
        self,
        parameter: str,
        variations: List[float]
    ) -> List[Tuple[float, AURAResults]]:
        """
        Perform sensitivity analysis on a parameter.

        Args:
            parameter: Parameter to vary (e.g., 'accuracy', 'hourly_rate')
            variations: List of multipliers (e.g., [0.8, 0.9, 1.0, 1.1, 1.2])

        Returns:
            List of (multiplier, results) tuples
        """
        results = []
        original_project = self.project

        for multiplier in variations:
            # Create a modified project
            modified_project = self._create_modified_project(parameter, multiplier)
            self.project = modified_project

            result = self.calculate()
            results.append((multiplier, result))

        # Restore original project
        self.project = original_project
        return results

    def _create_modified_project(
        self,
        parameter: str,
        multiplier: float
    ) -> Project:
        """Create a project copy with a modified parameter."""
        import copy
        project = copy.deepcopy(self.project)

        if parameter == "accuracy":
            for task in project.tasks:
                task.accuracy = min(1.0, task.accuracy * multiplier)
        elif parameter == "hourly_rate":
            for task in project.tasks:
                task.hourly_rate *= multiplier
        elif parameter == "hours_per_week":
            for task in project.tasks:
                task.hours_per_week *= multiplier
        elif parameter == "cost":
            project.costs.initial_development *= multiplier
            project.costs.platform_monthly *= multiplier
            project.costs.maintenance_monthly *= multiplier
        elif parameter == "discount_rate":
            project.discount_rate *= multiplier

        return project

    def what_if_analysis(
        self,
        scenarios: List[dict]
    ) -> List[Tuple[str, AURAResults]]:
        """
        Run what-if analysis with multiple scenarios.

        Args:
            scenarios: List of scenario definitions, each with:
                - name: Scenario name
                - modifications: Dict of parameter -> multiplier

        Returns:
            List of (scenario_name, results) tuples
        """
        results = []

        for scenario in scenarios:
            import copy
            project = copy.deepcopy(self.project)

            for param, multiplier in scenario.get("modifications", {}).items():
                if param == "accuracy":
                    for task in project.tasks:
                        task.accuracy = min(1.0, task.accuracy * multiplier)
                elif param == "cost":
                    project.costs.initial_development *= multiplier
                    project.costs.platform_monthly *= multiplier

            calculator = AURACalculator(project)
            result = calculator.calculate()
            results.append((scenario.get("name", "Unnamed"), result))

        return results
