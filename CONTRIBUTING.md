# Contributing to AURA Framework

Thank you for your interest in contributing to the AURA Framework! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

---

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Environment details (Python version, OS, etc.)
- Code samples if applicable

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md).

### Suggesting Features

Feature requests are welcome! Please use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md).

Good feature requests include:
- Clear description of the problem it solves
- Proposed solution
- Alternatives considered
- Real-world use case

### Submitting Use Cases

Real-world use cases and case studies are incredibly valuable. Use the [Use Case Submission template](.github/ISSUE_TEMPLATE/use_case_submission.md) to share:

- Industry context
- Problem statement
- Solution approach
- Results (anonymized as needed)
- Lessons learned

### Contributing Code

Types of code contributions we welcome:
- Bug fixes
- New features
- Industry presets
- Documentation improvements
- Test coverage improvements
- Performance optimizations

### Contributing Documentation

Documentation improvements are always welcome:
- Fixing typos and unclear explanations
- Adding examples
- Improving industry guides
- Translating documentation

---

## Development Setup

### Prerequisites

- Python 3.9+
- Git
- Virtual environment tool (venv, conda, etc.)

### Setup Steps

1. **Fork the repository**

   Click "Fork" on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-agent-roi-framework.git
   cd ai-agent-roi-framework
   ```

3. **Create a virtual environment**

   ```bash
   cd calculators/python
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

4. **Install development dependencies**

   ```bash
   pip install -e ".[dev]"
   ```

5. **Install pre-commit hooks** (optional but recommended)

   ```bash
   pip install pre-commit
   pre-commit install
   ```

6. **Run tests to verify setup**

   ```bash
   pytest tests/ -v
   ```

### Project Structure

```
ai-agent-roi-framework/
├── calculators/
│   └── python/
│       ├── aura_roi/          # Main package
│       │   ├── __init__.py
│       │   ├── calculator.py   # Core calculations
│       │   ├── models.py       # Data models
│       │   ├── industry_presets.py
│       │   ├── visualizations.py
│       │   └── cli.py
│       └── tests/              # Test suite
├── docs/                       # Documentation
├── examples/                   # Example scenarios
└── templates/                  # Business templates
```

---

## Pull Request Process

### Before Submitting

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**

   - Follow the [Style Guidelines](#style-guidelines)
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests locally**

   ```bash
   cd calculators/python
   pytest tests/ -v --cov=aura_roi
   ```

4. **Run linting**

   ```bash
   black --check .
   mypy aura_roi --ignore-missing-imports
   ```

5. **Commit your changes**

   Write clear, descriptive commit messages:
   ```
   Add healthcare industry preset for dental practices

   - Added DentalClinic preset with appropriate defaults
   - Updated industry_presets.py with dental-specific risk factors
   - Added test cases for new preset
   ```

### Submitting the PR

1. Push to your fork
2. Create a Pull Request against the `main` branch
3. Fill out the PR template completely
4. Link any related issues
5. Request review from maintainers

### Review Process

- Maintainers will review your PR within a few days
- Address any requested changes
- Once approved, your PR will be merged

---

## Style Guidelines

### Python Code

- **Formatting**: Use [Black](https://black.readthedocs.io/) with default settings
- **Type hints**: Required for all public functions
- **Docstrings**: Use Google style docstrings
- **Line length**: 100 characters maximum
- **Imports**: Use isort for import ordering

Example:

```python
def calculate_dla(
    hours_per_week: float,
    hourly_rate: float,
    accuracy: float = 0.90,
    oversight_rate: float = 0.10,
) -> float:
    """
    Calculate Direct Labour Arbitrage value.

    Args:
        hours_per_week: Weekly hours saved by automation
        hourly_rate: Loaded hourly cost (salary + benefits)
        accuracy: AI accuracy rate (0.0 to 1.0)
        oversight_rate: Percentage requiring human review

    Returns:
        Monthly DLA value in dollars

    Example:
        >>> calculate_dla(40, 50, 0.92, 0.15)
        6789.60
    """
    weeks_per_month = 4.33
    monthly_hours = hours_per_week * weeks_per_month
    effective_accuracy = accuracy * (1 - oversight_rate)
    return monthly_hours * hourly_rate * effective_accuracy
```

### Tests

- Use pytest
- Name test files `test_*.py`
- Name test functions `test_*`
- Use descriptive test names
- Include both positive and negative test cases
- Aim for >80% code coverage

### Documentation

- Use clear, concise language
- Include code examples where helpful
- Keep formatting consistent
- Update the CHANGELOG for significant changes

---

## Adding Industry Presets

When adding a new industry preset:

1. **Research the industry**
   - Typical hourly rates
   - Common AI use cases
   - Regulatory environment
   - Adoption patterns

2. **Create the preset** in `industry_presets.py`:

   ```python
   Industry.NEW_INDUSTRY: IndustryPreset(
       industry=Industry.NEW_INDUSTRY,
       name="New Industry",
       description="Description of the industry",
       typical_hourly_rate=50.0,
       typical_accuracy=0.90,
       typical_oversight_rate=0.15,
       risk_profile=RiskProfile(...),
       maturity_config=MaturityConfig(...),
       learning_rate=0.02,
       typical_tasks=[...],
       regulatory_considerations="...",
       adoption_notes="...",
   )
   ```

3. **Add tests** for the new preset

4. **Document** the rationale for default values

---

## Adding Example Scenarios

When adding example scenarios:

1. Create a folder in `examples/` with a descriptive name
2. Include:
   - `scenario.json` - Complete project definition
   - `analysis.md` - Detailed analysis narrative
   - `results.json` - Calculated outputs (optional)

3. Ensure the scenario:
   - Uses realistic values
   - Is based on a real-world use case
   - Demonstrates the framework's capabilities
   - Is properly anonymized if from a real implementation

---

## Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

---

## Community

### Getting Help

- Open a GitHub issue for bugs or features
- Use GitHub Discussions for questions
- Check existing issues and documentation first

### Recognition

Contributors will be recognized in:
- The project README
- Release notes
- GitHub contributor graphs

---

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

---

Thank you for contributing to the AURA Framework!
