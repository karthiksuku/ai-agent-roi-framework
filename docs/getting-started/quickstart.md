# Quickstart Guide

Get up and running with the AURA Framework in 5 minutes.

## Installation

### Python Package

```bash
# Install from PyPI
pip install aura-roi

# Or install from source
git clone https://github.com/your-username/ai-agent-roi-framework.git
cd ai-agent-roi-framework/calculators/python
pip install -e .
```

### Verify Installation

```bash
aura --help
```

---

## Your First Calculation

### Option 1: Command Line

```bash
# Interactive mode
aura interactive
```

Follow the prompts to enter your project details.

### Option 2: Python Script

```python
from aura_roi import AURACalculator, Project, Task, CostStructure

# Create a project
project = Project(
    name="Customer Service Agent",
    duration_months=24,
    industry="retail"
)

# Add tasks the agent will handle
project.add_task(Task(
    name="Email Response",
    hours_per_week=40,
    hourly_rate=28,
    accuracy=0.92,
    oversight_rate=0.12
))

# Set costs
project.costs = CostStructure(
    initial_development=40000,
    platform_monthly=2000,
    api_cost_per_call=0.01,
    estimated_calls_per_month=50000
)

# Calculate ROI
calculator = AURACalculator(project)
results = calculator.calculate()

# View results
print(f"Project: {results.project_name}")
print(f"NPV: ${results.net_present_value:,.0f}")
print(f"ROI: {results.roi_percentage:.1f}%")
print(f"Payback: {results.payback_months:.1f} months")
```

### Option 3: JSON Scenario File

Create `scenario.json`:

```json
{
  "name": "Customer Service Agent",
  "duration_months": 24,
  "industry": "retail",
  "tasks": [
    {
      "name": "Email Response",
      "hours_per_week": 40,
      "hourly_rate": 28,
      "accuracy": 0.92,
      "oversight_rate": 0.12
    }
  ],
  "costs": {
    "initial_development": 40000,
    "platform_monthly": 2000,
    "api_cost_per_call": 0.01,
    "estimated_calls_per_month": 50000
  }
}
```

Run the calculation:

```bash
aura calculate --input scenario.json --output results.json --verbose
```

---

## Understanding the Output

### Summary Metrics

| Metric | Description |
|--------|-------------|
| **Net Present Value (NPV)** | Total value in today's dollars |
| **ROI** | Return on investment percentage |
| **Payback Period** | Months until break-even |
| **IRR** | Internal rate of return |

### Value Breakdown

| Dimension | Description |
|-----------|-------------|
| **DLA** | Direct Labour Arbitrage - hours saved |
| **TA** | Throughput Amplification - capacity increase |
| **DQP** | Decision Quality Premium - error reduction |
| **LV** | Latency Value - speed improvement |
| **OLV** | Optionality & Learning Value - strategic benefits |

### Monthly Projections

The calculation generates month-by-month projections showing:
- Maturity stage (Pilot → Proven → Scaled → Optimized)
- Gross value
- Risk-adjusted value
- Costs
- Cumulative net value

---

## Quick Examples

### Example 1: Simple Email Agent

```python
from aura_roi import AURACalculator, Project, Task

project = Project(name="Email Agent", duration_months=12)
project.add_task(Task("Email Handling", hours_per_week=60, hourly_rate=30))

results = AURACalculator(project).calculate()
print(f"Monthly value: ${results.value_breakdown.total:,.0f}")
```

### Example 2: Using Industry Presets

```python
from aura_roi import AURACalculator, Project, Task
from aura_roi.industry_presets import IndustryPresets, Industry

# Get healthcare preset
preset = IndustryPresets.get(Industry.HEALTHCARE)

project = Project(
    name="Patient Triage",
    duration_months=36,
    industry=Industry.HEALTHCARE
)
project.add_task(Task(
    "Symptom Assessment",
    hours_per_week=80,
    hourly_rate=preset.typical_hourly_rate,
    accuracy=preset.typical_accuracy,
    oversight_rate=preset.typical_oversight_rate
))
project.risk_profile = preset.risk_profile
project.maturity_config = preset.maturity_config
project.costs = IndustryPresets.get_typical_costs(Industry.HEALTHCARE, "medium")

results = AURACalculator(project).calculate()
```

### Example 3: Generate a Report

```bash
aura report --input scenario.json --format markdown --output report.md
```

---

## Next Steps

1. **Learn the methodology**
   - [Five Value Dimensions](../methodology/five-value-dimensions.md)
   - [Maturity Model](../methodology/maturity-model.md)
   - [Risk Adjustment](../methodology/risk-adjustment.md)

2. **Explore examples**
   - [Customer Service Agent](../../examples/customer-service-agent/)
   - [Document Processing](../../examples/document-processing/)
   - [Healthcare Triage](../../examples/healthcare-triage/)

3. **Build your business case**
   - [Presenting to Executives](../guides/presenting-to-executives.md)
   - [Business Case Templates](../../templates/business-case/)

---

## Getting Help

- **Documentation:** Read the full docs in `/docs`
- **Examples:** See `/examples` for complete scenarios
- **Issues:** Report bugs at GitHub Issues
- **Community:** Join discussions on GitHub

---

*You're ready to start calculating AI agent ROI with the AURA Framework.*
