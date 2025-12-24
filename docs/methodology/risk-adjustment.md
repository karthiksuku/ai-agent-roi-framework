# Risk Adjustment

AI projects carry risks that can reduce realized value. The AURA Framework incorporates explicit risk adjustment to produce realistic projections.

## The Four Risk Categories

### 1. Technical Risk (Rₜ)

**Definition:** Risk that the AI agent fails to perform as expected due to technical issues.

**Examples:**
- Model degradation over time
- Hallucinations or confabulation
- Integration failures
- Performance bottlenecks
- Security vulnerabilities

**Typical Range:** 5-20%

| Scenario | Risk Level | Rationale |
|----------|-----------|-----------|
| Well-tested LLM on standard task | 5-8% | Proven technology |
| Custom fine-tuned model | 10-15% | More complexity |
| Novel application | 15-20% | Unproven territory |

**Mitigation Strategies:**
- Rigorous testing before deployment
- Continuous monitoring and alerting
- Fallback mechanisms
- Regular model evaluation
- Robust error handling

---

### 2. Adoption Risk (Rₐ)

**Definition:** Risk that users don't adopt the AI agent or don't use it effectively.

**Examples:**
- User resistance to change
- Insufficient training
- Poor user experience
- Workflow disruption
- Management resistance

**Typical Range:** 8-25%

| Scenario | Risk Level | Rationale |
|----------|-----------|-----------|
| Tech-savvy users, optional use | 8-12% | Willing adopters |
| Required use, good change management | 12-18% | Managed transition |
| Change-resistant culture | 20-25% | Significant hurdle |

**Mitigation Strategies:**
- Executive sponsorship
- User involvement in design
- Comprehensive training program
- Gradual rollout
- Success metrics and incentives
- User feedback loops

---

### 3. Regulatory Risk (Rᵣ)

**Definition:** Risk that regulatory changes or compliance issues affect deployment.

**Examples:**
- New AI regulations
- Explainability requirements
- Data privacy constraints
- Industry-specific compliance
- Audit findings

**Typical Range:** 3-25%

| Industry | Risk Level | Key Regulations |
|----------|-----------|-----------------|
| Healthcare | 20-25% | HIPAA, FDA, state boards |
| Financial Services | 18-22% | SEC, FINRA, SR 11-7 |
| Government | 15-20% | FedRAMP, accessibility |
| Retail | 5-10% | PCI-DSS, GDPR, CCPA |
| Technology | 5-8% | SOC 2, data privacy |

**Mitigation Strategies:**
- Legal/compliance review before deployment
- Explainability documentation
- Audit trail implementation
- Regular compliance assessment
- Industry group participation

---

### 4. Vendor Risk (Rᵥ)

**Definition:** Risk that the AI platform or vendor creates issues.

**Examples:**
- Pricing changes
- API deprecation
- Platform instability
- Vendor discontinuation
- Terms of service changes

**Typical Range:** 5-15%

| Scenario | Risk Level | Rationale |
|----------|-----------|-----------|
| Major cloud provider | 5-8% | Stable, reliable |
| Established AI vendor | 8-12% | Some uncertainty |
| Startup AI platform | 12-15% | Higher volatility |

**Mitigation Strategies:**
- Multi-vendor strategy
- Contractual protections
- Abstraction layers
- Data portability planning
- Monitoring vendor health

---

## Calculating Risk Adjustment

### Composite Risk Score

The composite risk score is a weighted average:

```
Composite Risk = (Rₜ × Wₜ) + (Rₐ × Wₐ) + (Rᵣ × Wᵣ) + (Rᵥ × Wᵥ)
```

**Default Weights:**

| Risk | Weight | Rationale |
|------|--------|-----------|
| Technical | 35% | Core to success |
| Adoption | 35% | Critical for value |
| Regulatory | 15% | Industry-dependent |
| Vendor | 15% | Manageable |

### Risk Adjustment Factor

```
Risk Adjustment Factor = 1 - Composite Risk Score
```

### Applying the Adjustment

```
Risk-Adjusted Value = Gross Value × Risk Adjustment Factor
```

---

## Example Calculation

### Healthcare AI Agent

**Risk Assessment:**
- Technical Risk: 15% (complex medical domain)
- Adoption Risk: 20% (physician resistance)
- Regulatory Risk: 25% (HIPAA, clinical validation)
- Vendor Risk: 10% (established vendor)

**Composite Risk:**
```
Composite = (0.15 × 0.35) + (0.20 × 0.35) + (0.25 × 0.15) + (0.10 × 0.15)
          = 0.0525 + 0.07 + 0.0375 + 0.015
          = 0.175 (17.5%)
```

**Risk Adjustment Factor:**
```
Factor = 1 - 0.175 = 0.825 (82.5%)
```

**Impact on $100,000 monthly gross value:**
```
Risk-Adjusted Value = $100,000 × 0.825 = $82,500/month
```

---

## Risk Over Time

Risk typically decreases over the maturity curve:

| Stage | Risk Multiplier | Rationale |
|-------|----------------|-----------|
| Pilot | 1.2× | Higher uncertainty |
| Proven | 1.0× | Baseline assessment |
| Scaled | 0.8× | Proven track record |
| Optimized | 0.7× | Well-understood |

*Note: The current AURA implementation applies a constant risk factor. Time-varying risk is available in advanced configurations.*

---

## Industry Risk Profiles

### Healthcare
```python
RiskProfile(
    technical_risk=0.15,
    adoption_risk=0.20,
    regulatory_risk=0.25,
    vendor_risk=0.10
)
# Composite: ~17.5%
```

### Financial Services
```python
RiskProfile(
    technical_risk=0.12,
    adoption_risk=0.15,
    regulatory_risk=0.22,
    vendor_risk=0.12
)
# Composite: ~14.5%
```

### Retail
```python
RiskProfile(
    technical_risk=0.10,
    adoption_risk=0.12,
    regulatory_risk=0.08,
    vendor_risk=0.10
)
# Composite: ~10%
```

### Government
```python
RiskProfile(
    technical_risk=0.12,
    adoption_risk=0.25,
    regulatory_risk=0.20,
    vendor_risk=0.15
)
# Composite: ~18%
```

---

## Best Practices

### 1. Be Honest About Risk
Don't minimize risk to make projections look better. Realistic risk assessment builds credibility.

### 2. Document Assumptions
Record why you assigned specific risk levels. This helps in later reviews.

### 3. Plan Mitigations
For each risk category, identify specific mitigation actions. Factor mitigation investments into costs.

### 4. Monitor and Adjust
Track actual risk events. Update risk assessments based on real experience.

### 5. Communicate Uncertainty
Present risk-adjusted projections alongside gross projections. Help stakeholders understand the range.

---

## Sensitivity Analysis

Use sensitivity analysis to understand risk impact:

```python
# Vary risk levels to see impact
scenarios = [
    {"name": "Optimistic", "modifications": {"risk_factor": 0.8}},
    {"name": "Base", "modifications": {"risk_factor": 1.0}},
    {"name": "Pessimistic", "modifications": {"risk_factor": 1.3}},
]
```

### Typical Risk Sensitivity

| Scenario | Composite Risk | NPV Impact |
|----------|---------------|------------|
| Optimistic | 10% | +12% |
| Base Case | 15% | Baseline |
| Pessimistic | 22% | -18% |

---

*Risk adjustment ensures ROI projections reflect real-world uncertainty.*
