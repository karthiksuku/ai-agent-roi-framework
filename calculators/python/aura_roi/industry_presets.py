"""
Industry-specific presets for the AURA Framework.

This module provides realistic default values for different industries,
based on market research and real-world implementations.
"""

from dataclasses import dataclass
from typing import Dict, Optional

from .models import (
    Industry,
    RiskProfile,
    MaturityConfig,
    CostStructure,
)


@dataclass
class IndustryPreset:
    """
    Complete preset configuration for an industry.

    Attributes:
        industry: Industry category
        name: Human-readable name
        description: Description of typical AI agent use cases
        typical_hourly_rate: Average loaded hourly cost
        typical_accuracy: Expected AI accuracy for this industry
        typical_oversight_rate: Expected human oversight rate
        risk_profile: Default risk profile
        maturity_config: Default maturity settings
        learning_rate: Industry-specific learning rate
        typical_tasks: Common AI agent tasks for this industry
        regulatory_considerations: Key regulatory factors
        adoption_notes: Notes on adoption patterns
    """
    industry: Industry
    name: str
    description: str
    typical_hourly_rate: float
    typical_accuracy: float
    typical_oversight_rate: float
    risk_profile: RiskProfile
    maturity_config: MaturityConfig
    learning_rate: float
    typical_tasks: list
    regulatory_considerations: str
    adoption_notes: str


class IndustryPresets:
    """
    Collection of industry-specific presets.

    Provides default values based on industry characteristics,
    regulatory environment, and typical automation patterns.

    Example:
        >>> preset = IndustryPresets.get(Industry.HEALTHCARE)
        >>> print(f"Typical accuracy: {preset.typical_accuracy}")
        >>> print(f"Regulatory considerations: {preset.regulatory_considerations}")
    """

    _presets: Dict[Industry, IndustryPreset] = {
        Industry.HEALTHCARE: IndustryPreset(
            industry=Industry.HEALTHCARE,
            name="Healthcare",
            description="Healthcare organizations including hospitals, clinics, "
                       "health insurers, and pharmaceutical companies",
            typical_hourly_rate=55.0,  # Higher due to specialized staff
            typical_accuracy=0.88,  # Conservative due to safety requirements
            typical_oversight_rate=0.25,  # Higher oversight for patient safety
            risk_profile=RiskProfile(
                technical_risk=0.15,
                adoption_risk=0.20,
                regulatory_risk=0.25,  # HIPAA, FDA considerations
                vendor_risk=0.10,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=4,  # Longer pilots for clinical validation
                proven_duration_months=8,
                scaled_duration_months=12,
                learning_rate=0.015,  # Slower learning due to regulation
                pilot_multiplier=0.25,
                proven_multiplier=0.60,
                scaled_multiplier=1.0,
                optimized_multiplier=1.2,
            ),
            learning_rate=0.015,
            typical_tasks=[
                "Patient intake and triage",
                "Appointment scheduling",
                "Prior authorization",
                "Claims processing",
                "Medical record summarization",
                "Patient communication",
                "Symptom assessment",
                "Medication reconciliation",
            ],
            regulatory_considerations="HIPAA compliance required. FDA oversight "
                                     "for clinical decision support. State medical "
                                     "board regulations. Patient consent requirements.",
            adoption_notes="Clinical staff adoption can be challenging. Require "
                          "physician champions. Integration with EHR systems critical. "
                          "Safety validation essential before scaling.",
        ),

        Industry.GOVERNMENT: IndustryPreset(
            industry=Industry.GOVERNMENT,
            name="Government",
            description="Federal, state, and local government agencies",
            typical_hourly_rate=45.0,
            typical_accuracy=0.90,
            typical_oversight_rate=0.20,
            risk_profile=RiskProfile(
                technical_risk=0.12,
                adoption_risk=0.25,  # Government change is slow
                regulatory_risk=0.20,  # Procurement and compliance rules
                vendor_risk=0.15,  # Contract and sovereignty concerns
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=4,
                proven_duration_months=9,  # Longer approval cycles
                scaled_duration_months=12,
                learning_rate=0.012,
                pilot_multiplier=0.25,
                proven_multiplier=0.55,
                scaled_multiplier=1.0,
                optimized_multiplier=1.15,
            ),
            learning_rate=0.012,
            typical_tasks=[
                "Citizen inquiry response",
                "Benefits eligibility",
                "Document processing",
                "License and permit processing",
                "Case management assistance",
                "Records request handling",
                "Compliance monitoring",
                "Report generation",
            ],
            regulatory_considerations="FedRAMP compliance for federal. State-specific "
                                     "data residency requirements. Accessibility "
                                     "requirements (Section 508). Public records laws.",
            adoption_notes="Union considerations may affect deployment. Procurement "
                          "cycles are lengthy. Security clearance requirements. "
                          "Strong preference for explainable AI.",
        ),

        Industry.MANUFACTURING: IndustryPreset(
            industry=Industry.MANUFACTURING,
            name="Manufacturing",
            description="Discrete and process manufacturing operations",
            typical_hourly_rate=40.0,
            typical_accuracy=0.93,  # Higher accuracy expectations
            typical_oversight_rate=0.15,
            risk_profile=RiskProfile(
                technical_risk=0.12,
                adoption_risk=0.15,  # Good tech adoption culture
                regulatory_risk=0.10,
                vendor_risk=0.08,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=5,
                scaled_duration_months=8,
                learning_rate=0.025,  # Fast learning with clear metrics
                pilot_multiplier=0.35,
                proven_multiplier=0.75,
                scaled_multiplier=1.0,
                optimized_multiplier=1.4,
            ),
            learning_rate=0.025,
            typical_tasks=[
                "Quality inspection",
                "Predictive maintenance",
                "Supply chain optimization",
                "Production scheduling",
                "Inventory management",
                "Supplier communication",
                "Safety monitoring",
                "Process documentation",
            ],
            regulatory_considerations="Industry-specific safety standards (OSHA). "
                                     "Quality certifications (ISO, AS9100). "
                                     "Environmental compliance.",
            adoption_notes="Strong ROI focus. Integration with existing automation. "
                          "Clear success metrics available. Shift-based operations "
                          "enable 24/7 agent utilization.",
        ),

        Industry.RETAIL: IndustryPreset(
            industry=Industry.RETAIL,
            name="Retail",
            description="Retail operations including e-commerce",
            typical_hourly_rate=28.0,  # Lower labor costs
            typical_accuracy=0.91,
            typical_oversight_rate=0.12,
            risk_profile=RiskProfile(
                technical_risk=0.10,
                adoption_risk=0.12,
                regulatory_risk=0.08,
                vendor_risk=0.10,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=2,  # Fast iteration
                proven_duration_months=4,
                scaled_duration_months=6,
                learning_rate=0.03,  # Rapid learning from customer feedback
                pilot_multiplier=0.40,
                proven_multiplier=0.80,
                scaled_multiplier=1.0,
                optimized_multiplier=1.5,
            ),
            learning_rate=0.03,
            typical_tasks=[
                "Customer service",
                "Order tracking",
                "Product recommendations",
                "Inventory inquiries",
                "Returns processing",
                "Price matching",
                "Store assistance",
                "Loyalty program support",
            ],
            regulatory_considerations="PCI-DSS for payment handling. Consumer "
                                     "protection laws. Accessibility requirements. "
                                     "Privacy regulations (CCPA, GDPR).",
            adoption_notes="High volume enables rapid learning. Customer satisfaction "
                          "is key metric. Seasonal variations in workload. "
                          "Multi-channel integration important.",
        ),

        Industry.FINANCIAL_SERVICES: IndustryPreset(
            industry=Industry.FINANCIAL_SERVICES,
            name="Financial Services",
            description="Banks, insurance companies, investment firms, fintech",
            typical_hourly_rate=65.0,  # Higher compensation
            typical_accuracy=0.94,  # High accuracy requirements
            typical_oversight_rate=0.18,
            risk_profile=RiskProfile(
                technical_risk=0.12,
                adoption_risk=0.15,
                regulatory_risk=0.22,  # Heavy regulation
                vendor_risk=0.12,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=6,
                scaled_duration_months=9,
                learning_rate=0.02,
                pilot_multiplier=0.30,
                proven_multiplier=0.70,
                scaled_multiplier=1.0,
                optimized_multiplier=1.35,
            ),
            learning_rate=0.02,
            typical_tasks=[
                "Customer onboarding",
                "Account inquiries",
                "Fraud detection",
                "Claims processing",
                "Loan processing",
                "Compliance monitoring",
                "Risk assessment",
                "Investment research",
            ],
            regulatory_considerations="SEC, FINRA regulations. Banking compliance "
                                     "(OCC, FDIC). Insurance regulations. "
                                     "Model risk management (SR 11-7). "
                                     "Fair lending requirements.",
            adoption_notes="Strong compliance requirements. Model validation needed. "
                          "High value per transaction. Risk management culture. "
                          "Integration with legacy systems challenging.",
        ),

        Industry.TECHNOLOGY: IndustryPreset(
            industry=Industry.TECHNOLOGY,
            name="Technology",
            description="Software companies, SaaS providers, tech services",
            typical_hourly_rate=75.0,  # High tech salaries
            typical_accuracy=0.92,
            typical_oversight_rate=0.10,  # Tech-savvy users
            risk_profile=RiskProfile(
                technical_risk=0.08,  # Strong technical capability
                adoption_risk=0.08,  # Early adopters
                regulatory_risk=0.08,
                vendor_risk=0.12,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=2,
                proven_duration_months=4,
                scaled_duration_months=6,
                learning_rate=0.035,  # Fast iteration
                pilot_multiplier=0.45,
                proven_multiplier=0.85,
                scaled_multiplier=1.0,
                optimized_multiplier=1.6,
            ),
            learning_rate=0.035,
            typical_tasks=[
                "Customer support",
                "Code review assistance",
                "Documentation",
                "Bug triage",
                "DevOps automation",
                "Security monitoring",
                "User onboarding",
                "Feature requests",
            ],
            regulatory_considerations="SOC 2 compliance. Data privacy (GDPR, CCPA). "
                                     "Export controls for some technologies.",
            adoption_notes="Quick adoption of new tools. Integration-friendly. "
                          "High expectations for AI performance. "
                          "Developer experience is key.",
        ),

        Industry.EDUCATION: IndustryPreset(
            industry=Industry.EDUCATION,
            name="Education",
            description="K-12, higher education, ed-tech",
            typical_hourly_rate=38.0,
            typical_accuracy=0.89,
            typical_oversight_rate=0.22,  # Educational oversight important
            risk_profile=RiskProfile(
                technical_risk=0.12,
                adoption_risk=0.18,  # Faculty adoption varies
                regulatory_risk=0.15,  # FERPA, accessibility
                vendor_risk=0.10,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=6,
                scaled_duration_months=9,
                learning_rate=0.018,
                pilot_multiplier=0.30,
                proven_multiplier=0.65,
                scaled_multiplier=1.0,
                optimized_multiplier=1.25,
            ),
            learning_rate=0.018,
            typical_tasks=[
                "Student inquiries",
                "Enrollment support",
                "Tutoring assistance",
                "Grading support",
                "Administrative tasks",
                "Research assistance",
                "Library services",
                "Career guidance",
            ],
            regulatory_considerations="FERPA compliance. Accessibility (Section 508). "
                                     "Academic integrity considerations. "
                                     "State education requirements.",
            adoption_notes="Academic calendar affects rollouts. Faculty buy-in crucial. "
                          "Academic integrity concerns with AI. "
                          "Budget constraints common.",
        ),

        Industry.UTILITIES: IndustryPreset(
            industry=Industry.UTILITIES,
            name="Utilities",
            description="Energy, water, telecommunications utilities",
            typical_hourly_rate=48.0,
            typical_accuracy=0.92,
            typical_oversight_rate=0.15,
            risk_profile=RiskProfile(
                technical_risk=0.10,
                adoption_risk=0.15,
                regulatory_risk=0.18,  # Public utility regulation
                vendor_risk=0.08,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=6,
                scaled_duration_months=9,
                learning_rate=0.02,
                pilot_multiplier=0.32,
                proven_multiplier=0.72,
                scaled_multiplier=1.0,
                optimized_multiplier=1.3,
            ),
            learning_rate=0.02,
            typical_tasks=[
                "Customer service",
                "Outage reporting",
                "Billing inquiries",
                "Service scheduling",
                "Usage analysis",
                "Meter reading",
                "Field service dispatch",
                "Energy efficiency advice",
            ],
            regulatory_considerations="Public utility commission oversight. "
                                     "Service level requirements. "
                                     "Critical infrastructure protection.",
            adoption_notes="High customer contact volume. Predictable workloads. "
                          "Integration with SCADA and operational systems. "
                          "Reliability is paramount.",
        ),

        Industry.PROFESSIONAL_SERVICES: IndustryPreset(
            industry=Industry.PROFESSIONAL_SERVICES,
            name="Professional Services",
            description="Consulting, legal, accounting, architecture",
            typical_hourly_rate=85.0,  # High billing rates
            typical_accuracy=0.91,
            typical_oversight_rate=0.20,  # Professional judgment needed
            risk_profile=RiskProfile(
                technical_risk=0.10,
                adoption_risk=0.18,
                regulatory_risk=0.15,
                vendor_risk=0.10,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=5,
                scaled_duration_months=8,
                learning_rate=0.022,
                pilot_multiplier=0.35,
                proven_multiplier=0.70,
                scaled_multiplier=1.0,
                optimized_multiplier=1.35,
            ),
            learning_rate=0.022,
            typical_tasks=[
                "Document review",
                "Research assistance",
                "Client communication",
                "Time tracking",
                "Report generation",
                "Due diligence",
                "Contract analysis",
                "Knowledge management",
            ],
            regulatory_considerations="Professional licensing requirements. "
                                     "Client confidentiality. Malpractice considerations. "
                                     "Industry-specific regulations.",
            adoption_notes="Partner buy-in essential. Billable hour model affects ROI. "
                          "Quality and accuracy paramount. "
                          "Client relationship management important.",
        ),

        Industry.OTHER: IndustryPreset(
            industry=Industry.OTHER,
            name="Other",
            description="General industry defaults",
            typical_hourly_rate=45.0,
            typical_accuracy=0.90,
            typical_oversight_rate=0.15,
            risk_profile=RiskProfile(
                technical_risk=0.12,
                adoption_risk=0.15,
                regulatory_risk=0.10,
                vendor_risk=0.10,
            ),
            maturity_config=MaturityConfig(
                pilot_duration_months=3,
                proven_duration_months=6,
                scaled_duration_months=9,
                learning_rate=0.02,
                pilot_multiplier=0.30,
                proven_multiplier=0.70,
                scaled_multiplier=1.0,
                optimized_multiplier=1.3,
            ),
            learning_rate=0.02,
            typical_tasks=[
                "Customer service",
                "Data entry",
                "Document processing",
                "Email handling",
                "Scheduling",
                "Reporting",
                "Monitoring",
                "Quality assurance",
            ],
            regulatory_considerations="General data privacy requirements. "
                                     "Industry-specific considerations may apply.",
            adoption_notes="Results will vary. Consider industry-specific factors. "
                          "Benchmarking against similar implementations recommended.",
        ),
    }

    @classmethod
    def get(cls, industry: Industry) -> IndustryPreset:
        """
        Get the preset for a specific industry.

        Args:
            industry: The industry to get presets for

        Returns:
            IndustryPreset with default values

        Example:
            >>> preset = IndustryPresets.get(Industry.HEALTHCARE)
            >>> print(preset.typical_hourly_rate)
            55.0
        """
        return cls._presets.get(industry, cls._presets[Industry.OTHER])

    @classmethod
    def list_industries(cls) -> list:
        """List all available industries."""
        return [i.value for i in Industry]

    @classmethod
    def get_typical_costs(
        cls,
        industry: Industry,
        scale: str = "medium"
    ) -> CostStructure:
        """
        Get typical cost structure for an industry and scale.

        Args:
            industry: The industry
            scale: Project scale ('small', 'medium', 'large', 'enterprise')

        Returns:
            CostStructure with typical values
        """
        scale_multipliers = {
            "small": 0.3,
            "medium": 1.0,
            "large": 2.5,
            "enterprise": 5.0,
        }
        multiplier = scale_multipliers.get(scale, 1.0)

        # Base costs (medium scale)
        base_costs = {
            Industry.HEALTHCARE: CostStructure(
                initial_development=75000,
                platform_monthly=3000,
                api_cost_per_call=0.02,
                estimated_calls_per_month=50000,
                maintenance_monthly=2000,
                training_initial=15000,
                training_ongoing_monthly=500,
                change_management=20000,
            ),
            Industry.FINANCIAL_SERVICES: CostStructure(
                initial_development=100000,
                platform_monthly=4000,
                api_cost_per_call=0.015,
                estimated_calls_per_month=100000,
                maintenance_monthly=3000,
                training_initial=20000,
                training_ongoing_monthly=750,
                change_management=25000,
            ),
            Industry.RETAIL: CostStructure(
                initial_development=40000,
                platform_monthly=2000,
                api_cost_per_call=0.01,
                estimated_calls_per_month=200000,
                maintenance_monthly=1500,
                training_initial=8000,
                training_ongoing_monthly=300,
                change_management=10000,
            ),
            Industry.MANUFACTURING: CostStructure(
                initial_development=60000,
                platform_monthly=2500,
                api_cost_per_call=0.012,
                estimated_calls_per_month=75000,
                maintenance_monthly=2000,
                training_initial=12000,
                training_ongoing_monthly=400,
                change_management=15000,
            ),
            Industry.GOVERNMENT: CostStructure(
                initial_development=80000,
                platform_monthly=3500,
                api_cost_per_call=0.018,
                estimated_calls_per_month=40000,
                maintenance_monthly=2500,
                training_initial=18000,
                training_ongoing_monthly=600,
                change_management=22000,
            ),
        }

        base = base_costs.get(industry, CostStructure(
            initial_development=50000,
            platform_monthly=2500,
            api_cost_per_call=0.015,
            estimated_calls_per_month=50000,
            maintenance_monthly=1500,
            training_initial=10000,
            training_ongoing_monthly=400,
            change_management=12000,
        ))

        return CostStructure(
            initial_development=base.initial_development * multiplier,
            platform_monthly=base.platform_monthly * multiplier,
            api_cost_per_call=base.api_cost_per_call,  # Don't scale per-call cost
            estimated_calls_per_month=base.estimated_calls_per_month * multiplier,
            maintenance_monthly=base.maintenance_monthly * multiplier,
            training_initial=base.training_initial * multiplier,
            training_ongoing_monthly=base.training_ongoing_monthly * multiplier,
            change_management=base.change_management * multiplier,
        )


def get_industry_preset(industry_name: str) -> Optional[IndustryPreset]:
    """
    Convenience function to get industry preset by name.

    Args:
        industry_name: Industry name (case-insensitive)

    Returns:
        IndustryPreset or None if not found

    Example:
        >>> preset = get_industry_preset("healthcare")
        >>> print(preset.name)
        Healthcare
    """
    try:
        industry = Industry(industry_name.lower().replace(" ", "_"))
        return IndustryPresets.get(industry)
    except ValueError:
        return None
