# AURA ROI Calculator - Python Package

Python library for the AURA Framework (AI Utility & Return Assessment).

## Installation

```bash
pip install aura-roi
```

## Quick Start

```python
from aura_roi import AURACalculator, Project, Task, CostStructure

project = Project(name="Customer Service Agent", duration_months=24)
project.add_task(Task(name="Email Response", hours_per_week=40, hourly_rate=35))
project.costs = CostStructure(initial_development=50000, platform_monthly=2500)

results = AURACalculator(project).calculate()
print(f"ROI: {results.roi_percentage:.1f}%")
```

## Documentation

See the [full documentation](https://github.com/karthiksuku/ai-agent-roi-framework).
