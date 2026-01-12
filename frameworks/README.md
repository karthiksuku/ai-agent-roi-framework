# AURA Framework Compliance Mappings

This directory contains mappings between the AURA Framework and major AI governance/compliance frameworks. These mappings help organizations demonstrate that their AI ROI calculations align with regulatory and industry best practices.

## Supported Frameworks

### NIST AI Risk Management Framework (AI RMF)
- **Directory**: `nist-ai-rmf/`
- **Version**: 1.0 (January 2023)
- Maps AURA risk dimensions to NIST AI RMF functions (Govern, Map, Measure, Manage)

### ISO/IEC 42001
- **Directory**: `iso-42001/`
- **Version**: 2023
- AI Management System standard alignment
- Maps AURA processes to ISO 42001 clauses

### EU AI Act
- **Directory**: `eu-ai-act/`
- **Version**: 2024
- Risk classification guidance
- Compliance requirements by AI system risk level

### SOX AI Controls
- **Directory**: `sox-ai-controls/`
- Sarbanes-Oxley considerations for AI in financial reporting
- Control framework for AI-assisted financial processes

## Using Framework Mappings

### Python API

```python
from aura_roi.framework_alignment import (
    get_framework_mapping,
    assess_compliance_gaps,
    generate_compliance_report
)

# Load a framework mapping
nist_mapping = get_framework_mapping("nist-ai-rmf")

# Assess compliance gaps
project_assessment = assess_compliance_gaps(
    project=my_project,
    framework="nist-ai-rmf"
)

# Generate compliance report
report = generate_compliance_report(
    project=my_project,
    frameworks=["nist-ai-rmf", "eu-ai-act"]
)
```

## Framework Mapping Structure

Each framework directory contains:

- `mapping.json`: Detailed mapping between AURA components and framework requirements
- `checklist.md`: Actionable compliance checklist
- Additional supporting documents as needed

## Compliance Considerations by Industry

| Industry | Primary Frameworks | Key Considerations |
|----------|-------------------|-------------------|
| Healthcare | NIST AI RMF, HIPAA | Patient safety, data privacy |
| Financial Services | SOX, NIST AI RMF | Model risk management, auditability |
| Government | NIST AI RMF, EU AI Act | Transparency, accountability |
| Manufacturing | ISO 42001 | Safety, quality management |
| Retail | GDPR, EU AI Act | Consumer protection, transparency |

## Contributing

We welcome contributions to improve framework mappings. Please ensure:

1. Mappings are accurate and up-to-date
2. Sources are properly cited
3. Changes are reviewed by compliance experts

## Disclaimer

These mappings are provided for informational purposes only and do not constitute legal advice. Organizations should consult with legal and compliance professionals to ensure proper compliance with applicable regulations.
