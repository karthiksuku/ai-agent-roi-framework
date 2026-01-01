# AURA Framework

## AI Utility & Return Assessment

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://python.org)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A comprehensive, open-source methodology for calculating ROI on AI Agent projects.**

---

## Overview

The AURA Framework provides a rigorous, transparent methodology for evaluating the return on investment of AI agent implementations. Unlike traditional ROI models that treat AI as static software, AURA captures the unique characteristics of AI agents:

- **Compounding Value**: Agents that improve over time through learning
- **Adaptive Capacity**: Variable workloads and dynamic scaling
- **Multi-Dimensional Value**: Benefits beyond simple cost savings
- **Risk-Adjusted Projections**: Mature, realistic forecasting

## Why AURA?

Traditional ROI calculations fail to capture the true value of AI agents because they:

1. **Ignore the learning curve** - AI agents improve with usage and feedback
2. **Miss throughput amplification** - Agents enable work that wasn't previously possible
3. **Undervalue decision quality** - Better data leads to better decisions
4. **Overlook optionality** - Process insights and data assets have long-term value
5. **Don't account for risk** - Technical, adoption, and regulatory risks affect outcomes

AURA addresses all of these limitations with a comprehensive, research-backed framework.

---

## The Five Value Dimensions

### 1. Direct Labour Arbitrage (DLA)
The foundational value dimension - hours saved multiplied by loaded labour cost, adjusted for accuracy.

```
DLA = Hours Saved × Loaded Hourly Rate × Accuracy Factor × (1 - Oversight Rate)
```

### 2. Throughput Amplification (TA)
Value from enabling work beyond previous capacity limits - processing more transactions, serving more customers, handling more cases.

```
TA = (New Capacity - Old Capacity) × Value Per Unit × Utilization Rate
```

### 3. Decision Quality Premium (DQP)
Economic value from improved decision accuracy - fewer errors, better outcomes, reduced rework.

```
DQP = Decisions Made × Error Reduction % × Cost Per Error
```

### 4. Latency Value (LV)
Speed creates value - faster responses, quicker turnaround, reduced waiting costs.

```
LV = Transactions × Time Saved × Value of Time
```

### 5. Optionality & Learning Value (OLV)
Strategic value from process insights, data assets, and future capabilities enabled.

```
OLV = (Process Insights Value + Data Asset Value + Capability Options Value) × Probability Factor
```

---

## The Maturity Multiplier

AI agents don't deliver constant value - they improve over time. The AURA Maturity Model captures this evolution:

| Stage | Timeline | Multiplier | Description |
|-------|----------|------------|-------------|
| **Pilot** | Months 1-3 | 0.3× | Initial deployment, learning, adjustment |
| **Proven** | Months 4-9 | 0.7× | Validated performance, growing adoption |
| **Scaled** | Months 10-18 | 1.0× | Full deployment, optimized workflows |
| **Optimized** | 18+ months | 1.3-1.8× | Continuous improvement, compound effects |

```
Value(t) = Base Value × (1 + Learning Rate)^t × Adoption Factor(t)
```

---

## Risk Adjustment

AURA incorporates four risk categories:

| Risk Type | Symbol | Examples |
|-----------|--------|----------|
| **Technical** | Rₜ | Model degradation, hallucinations, integration failures |
| **Adoption** | Rₐ | User resistance, training gaps, change management |
| **Regulatory** | Rᵣ | Compliance changes, explainability requirements |
| **Vendor** | Rᵥ | Platform changes, pricing shifts, API deprecation |

```
Risk-Adjusted Value = Gross Value × (1 - Composite Risk Score)
```

---

## The Composite ROI Formula

```
AI Agent ROI = [(DLA + TA + DQP + LV + OLV) × Maturity Multiplier × Risk Adjustment - Total Cost] / Total Cost × 100
```

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-agent-roi-framework.git
cd ai-agent-roi-framework

# Install Python package
cd calculators/python
pip install -e .
```

### Basic Usage

```python
from aura_roi import AURACalculator, Project, Task

# Define your AI agent project
project = Project(
    name="Customer Service Agent",
    duration_months=24,
    industry="retail"
)

# Add tasks the agent will perform
project.add_task(Task(
    name="Email Response",
    hours_per_week=40,
    hourly_rate=35,
    accuracy=0.92
))

# Calculate ROI
calculator = AURACalculator(project)
results = calculator.calculate()

print(f"Net Present Value: ${results.npv:,.0f}")
print(f"ROI: {results.roi:.1f}%")
print(f"Payback Period: {results.payback_months:.1f} months")
```

### Command Line Interface

```bash
# Run with a scenario file
aura calculate --input scenario.json --output results.json

# Generate a report
aura report --input scenario.json --format pdf --output roi-analysis.pdf

# Interactive mode
aura interactive
```

---

## Project Structure

```
ai-agent-roi-framework/
├── calculators/
│   ├── python/          # Python library and CLI
│   ├── excel/           # Excel workbook calculator
│   └── web-app/         # React web application
├── docs/                # Comprehensive documentation
├── examples/            # Real-world scenarios
├── templates/           # Business case templates
├── research/            # Benchmarks and references
└── api/                 # API specification
```

---

## Documentation

- [Methodology Overview](docs/methodology/overview.md)
- [Five Value Dimensions](docs/methodology/five-value-dimensions.md)
- [Maturity Model](docs/methodology/maturity-model.md)
- [Risk Adjustment](docs/methodology/risk-adjustment.md)
- [Getting Started Guide](docs/getting-started/quickstart.md)
- [Industry Guides](docs/industry-guides/)

---

## Example Scenarios

| Scenario | Industry | ROI | Payback |
|----------|----------|-----|---------|
| [Customer Service Agent](examples/customer-service-agent/) | Retail | 280% | 8 months |
| [Document Processing](examples/document-processing/) | Financial Services | 340% | 6 months |
| [Healthcare Triage](examples/healthcare-triage/) | Healthcare | 195% | 11 months |
| [Supply Chain Optimization](examples/supply-chain-optimization/) | Manufacturing | 420% | 5 months |
| [Fraud Detection](examples/fraud-detection/) | Financial Services | 510% | 4 months |

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Ways to Contribute

- Add industry-specific presets and benchmarks
- Submit real-world case studies (anonymized)
- Improve documentation and examples
- Enhance the calculators and visualizations
- Report bugs and suggest features

---

## Citation

If you use the AURA Framework in academic work, please cite:

```bibtex
@software{aura_framework,
  title = {AURA Framework: AI Utility & Return Assessment},
  author = {Sukumar, Karthik},
  year = {2026},
  url = {https://github.com/YOUR_USERNAME/ai-agent-roi-framework}
}
```

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Author

**Karthik Sukumar**


---

## Acknowledgments

- The AI/ML community for ongoing research into AI economics
- Early adopters who provided feedback and real-world validation
- Contributors who have helped improve this framework

---

<p align="center">
  <strong>Built with clarity. Designed for impact.</strong>
</p>
