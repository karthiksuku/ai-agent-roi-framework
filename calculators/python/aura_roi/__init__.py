"""
AURA Framework - AI Utility & Return Assessment

A comprehensive methodology for calculating ROI on AI Agent projects.

Enhanced with:
- Baseline capture and measurement
- Total Cost of Ownership (TCO) calculator
- Safety-adjusted ROI calculations
- Industry benchmarks
- Compliance framework mappings
"""

from .models import (
    Task,
    Project,
    CostStructure,
    RiskProfile,
    MaturityConfig,
    AURAResults,
    ValueBreakdown,
    MonthlyProjection,
)
from .calculator import AURACalculator
from .industry_presets import IndustryPresets, get_industry_preset

# New enhanced modules
from .baseline import (
    BaselineCapture,
    ProcessBaseline,
    MeasurementPlan,
    VarianceReport,
    MetricType,
)
from .tco import (
    TCOCalculator,
    InitialCosts,
    OngoingCosts,
    HiddenCosts,
    OpportunityCosts,
    TCOBreakdown,
)
from .safety_adjusted import (
    SafetyAdjustedROI,
    SafetySignals,
    SafetyThresholds,
    SafetyAdjustedResult,
)

__version__ = "2.0.0"
__author__ = "Karthik Sukumar"
__email__ = "karthiksukumar@gmail.com"

__all__ = [
    # Core models
    "Task",
    "Project",
    "CostStructure",
    "RiskProfile",
    "MaturityConfig",
    "AURAResults",
    "ValueBreakdown",
    "MonthlyProjection",
    "AURACalculator",
    "IndustryPresets",
    "get_industry_preset",
    # Baseline capture
    "BaselineCapture",
    "ProcessBaseline",
    "MeasurementPlan",
    "VarianceReport",
    "MetricType",
    # TCO
    "TCOCalculator",
    "InitialCosts",
    "OngoingCosts",
    "HiddenCosts",
    "OpportunityCosts",
    "TCOBreakdown",
    # Safety-adjusted ROI
    "SafetyAdjustedROI",
    "SafetySignals",
    "SafetyThresholds",
    "SafetyAdjustedResult",
]
