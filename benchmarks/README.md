# AURA Framework Industry Benchmarks

This directory contains industry-specific benchmark data for AI agent ROI calculations. These benchmarks are derived from real-world implementations and industry research.

## Directory Structure

```
benchmarks/
├── schema.json              # JSON schema for benchmark data
├── healthcare/              # Healthcare industry benchmarks
├── government/              # Government/public sector benchmarks
├── retail/                  # Retail industry benchmarks
├── manufacturing/           # Manufacturing industry benchmarks
└── financial-services/      # Financial services benchmarks
```

## Using Benchmarks

### Python API

```python
from aura_roi.benchmarks import load_benchmark, list_benchmarks

# List available benchmarks
benchmarks = list_benchmarks("healthcare")

# Load a specific benchmark
benchmark = load_benchmark("healthcare", "patient-triage")

# Use benchmark in calculations
from aura_roi import AURACalculator, Project

project = Project(
    name="Patient Triage AI",
    duration_months=24,
    industry="healthcare"
)

# Apply benchmark defaults
project.apply_benchmark(benchmark)
```

### Benchmark Data Format

Each benchmark JSON file contains:

- **metadata**: Industry, use case, source information
- **baseline_metrics**: Pre-AI performance benchmarks
- **expected_improvements**: Typical improvement ranges
- **cost_benchmarks**: Typical cost structures
- **risk_factors**: Industry-specific risk considerations
- **success_criteria**: KPIs and thresholds

## Contributing Benchmarks

We welcome contributions of anonymized benchmark data. Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

### Requirements for Contribution

1. Data must be anonymized (no company names or identifying information)
2. Include sample size and confidence level
3. Provide data sources and methodology
4. Follow the schema defined in `schema.json`

## Benchmark Categories

### Healthcare
- Patient Triage & Routing
- Claims Processing
- Clinical Documentation
- Appointment Scheduling
- Medical Coding

### Government
- Permit Processing
- Citizen Services
- Compliance Review
- Document Classification
- Fraud Detection

### Retail
- Customer Service
- Inventory Optimization
- Personalization
- Demand Forecasting
- Returns Processing

### Manufacturing
- Quality Control
- Predictive Maintenance
- Supply Chain Optimization
- Production Scheduling
- Defect Detection

### Financial Services
- Fraud Detection
- Document Processing
- Risk Assessment
- Customer Onboarding
- Compliance Monitoring

## Data Sources

Benchmarks are compiled from:
- Industry analyst reports (Gartner, Forrester, McKinsey)
- Academic research papers
- Anonymized customer implementations
- Open-source case studies

## Disclaimer

These benchmarks represent industry averages and ranges. Actual results may vary significantly based on:
- Organization size and complexity
- Existing technology infrastructure
- Data quality and availability
- Change management effectiveness
- Implementation approach

Always validate benchmarks against your specific context before using them for business case development.
