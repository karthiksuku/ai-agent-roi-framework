"""
AURA Framework - AI Utility & Return Assessment

A comprehensive methodology for calculating ROI on AI Agent projects.
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

__version__ = "1.0.0"
__author__ = "Karthik Sukumar"
__email__ = "karthik.sukumar@oracle.com"

__all__ = [
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
]
