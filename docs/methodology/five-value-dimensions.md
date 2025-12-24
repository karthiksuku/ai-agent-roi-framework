# The Five Value Dimensions

AI agents generate value across multiple dimensions. Understanding and measuring each dimension is crucial for accurate ROI calculation.

## 1. Direct Labour Arbitrage (DLA)

### Definition

Direct Labour Arbitrage captures the value of hours saved by automating human work, adjusted for accuracy and oversight requirements.

### Formula

```
DLA = Hours Saved × Loaded Hourly Rate × Accuracy Factor × (1 - Oversight Rate)
```

### Components

| Component | Description | Typical Range |
|-----------|-------------|---------------|
| Hours Saved | Weekly hours the agent handles | 10-80+ hours |
| Loaded Hourly Rate | Fully loaded cost (salary + benefits + overhead) | $25-$150/hour |
| Accuracy Factor | Agent accuracy rate | 85%-98% |
| Oversight Rate | Percentage requiring human review | 5%-30% |

### Example

A customer service agent handling email inquiries:
- Hours per week: 40
- Loaded rate: $35/hour
- Accuracy: 92%
- Oversight: 15%

```
DLA (monthly) = 40 × 4.33 × $35 × 0.92 × (1 - 0.15)
             = 173.2 hours × $35 × 0.92 × 0.85
             = $4,743/month
```

### Considerations

- **Use loaded rates, not base salary** - Include benefits (typically 25-40% of salary), overhead, management time
- **Be conservative on accuracy** - Real-world accuracy often differs from testing
- **Account for oversight costs** - Some tasks will still need human review
- **Consider training time** - Initial periods have higher oversight

---

## 2. Throughput Amplification (TA)

### Definition

Throughput Amplification captures the value of handling more volume than was previously possible—not just faster, but more capacity.

### Formula

```
TA = (New Capacity - Old Capacity) × Value Per Unit × Utilization Rate
```

### Components

| Component | Description | Example |
|-----------|-------------|---------|
| Old Capacity | Previous maximum volume | 100 inquiries/day |
| New Capacity | New maximum with AI | 500 inquiries/day |
| Value Per Unit | Economic value of each additional unit | $15/inquiry |
| Utilization Rate | Expected utilization of new capacity | 80% |

### Example

An insurance claims intake process:
- Old capacity: 200 claims/day (human team limit)
- New capacity: 800 claims/day (with AI triage)
- Value per claim processed: $25
- Utilization: 75% (demand varies)

```
TA (daily) = (800 - 200) × $25 × 0.75
           = 600 × $25 × 0.75
           = $11,250/day
```

### When TA Applies

- Contact centers with call/chat/email backlogs
- Document processing with volume constraints
- Application processing during peak periods
- Any capacity-constrained workflow

---

## 3. Decision Quality Premium (DQP)

### Definition

Decision Quality Premium captures the value from improved decision accuracy—fewer errors, better outcomes, reduced rework.

### Formula

```
DQP = Decisions Made × Error Reduction % × Cost Per Error
```

### Components

| Component | Description | Measurement |
|-----------|-------------|-------------|
| Decisions Made | Volume of decisions per period | Count transactions |
| Error Reduction | Improvement over baseline human error rate | Compare AI vs. human accuracy |
| Cost Per Error | Full cost of an error | Include rework, customer impact, compliance |

### Example

An invoice processing agent:
- Invoices per month: 10,000
- Human error rate: 8%
- AI error rate: 3%
- Cost per error: $150 (includes rework, payment delays, relationship cost)

```
DQP (monthly) = 10,000 × (8% - 3%) × $150
              = 10,000 × 0.05 × $150
              = $75,000/month
```

### Measuring Error Costs

Include all downstream impacts:
- **Rework time** - Hours to fix the error
- **Customer impact** - Churn, complaints, refunds
- **Compliance costs** - Fines, audit remediation
- **Opportunity cost** - Revenue lost during resolution

---

## 4. Latency Value (LV)

### Definition

Latency Value captures the economic benefit of speed—faster response times, quicker turnaround, reduced waiting costs.

### Formula

```
LV = Transactions × Time Saved × Value of Time × Sensitivity Factor
```

### Components

| Component | Description | Examples |
|-----------|-------------|----------|
| Transactions | Volume per period | Applications, inquiries, orders |
| Time Saved | Reduction in processing time | Hours or days saved |
| Value of Time | Economic value of speed | Revenue at risk, customer satisfaction |
| Sensitivity Factor | How time-sensitive is the process? | 1.0 normal, 2.0+ urgent |

### Example

Loan application processing:
- Applications per month: 500
- Old processing time: 5 days
- New processing time: 4 hours
- Value per day saved: $50 (interest, customer satisfaction)
- Time sensitivity: 1.5 (competitive market)

```
LV (monthly) = 500 × 4.8 days × $50 × 1.5
             = 500 × 4.8 × $50 × 1.5
             = $180,000/month
```

### Time-Sensitive Industries

| Industry | Time Sensitivity | Reason |
|----------|-----------------|--------|
| Financial Services | High | Market timing, customer expectations |
| Healthcare | Critical | Patient outcomes, care coordination |
| E-commerce | High | Customer expectations, competitive pressure |
| Government | Moderate | Service level requirements |
| Manufacturing | High | Supply chain timing, inventory costs |

---

## 5. Optionality & Learning Value (OLV)

### Definition

Optionality & Learning Value captures the strategic benefits that emerge from AI deployment—process insights, data assets, and future capabilities enabled.

### Formula

```
OLV = (Process Insights + Data Assets + Capability Options) × Probability Factor
```

### Components

| Component | Description | Valuation Approach |
|-----------|-------------|-------------------|
| Process Insights | Improvements identified through AI analysis | Cost savings enabled |
| Data Assets | Structured data captured by the agent | Replacement cost or revenue enabled |
| Capability Options | Future capabilities enabled by this deployment | Option value calculation |
| Probability Factor | Likelihood of realizing these values | 30-70% typically |

### Example

Customer service AI generating insights:
- Process insights: AI identifies 5 process improvements worth $100,000/year in savings
- Data assets: Structured customer intent data worth $50,000/year to marketing
- Capability options: Platform enables future sales agent worth $200,000/year potential
- Probability: 50% realization rate

```
OLV (annual) = ($100,000 + $50,000 + $200,000) × 0.50
             = $350,000 × 0.50
             = $175,000/year
             = $14,583/month
```

### Common Optionality Sources

1. **Process Mining** - Agent interactions reveal inefficiencies
2. **Customer Intelligence** - Intent data, sentiment trends
3. **Compliance Documentation** - Automated audit trails
4. **Training Data** - Conversations for model improvement
5. **Platform Extension** - Foundation for additional AI use cases

---

## Combining the Dimensions

### Total Monthly Value

```
Total Monthly Value = DLA + TA + DQP + LV + OLV
```

### Typical Distribution

For a typical customer service AI agent:

| Dimension | % of Total | Notes |
|-----------|------------|-------|
| DLA | 40-60% | Often the primary value driver |
| TA | 10-20% | If capacity-constrained |
| DQP | 15-25% | Depends on error cost |
| LV | 5-15% | Industry-dependent |
| OLV | 5-15% | Long-term strategic value |

### Calculation Tips

1. **Start with DLA** - It's the most concrete and easiest to validate
2. **Only include TA if capacity-constrained** - Don't double-count with DLA
3. **Be rigorous on error costs for DQP** - Include full downstream impact
4. **LV matters most for time-sensitive processes** - Focus where speed = money
5. **Be conservative on OLV** - It's the most uncertain dimension

---

*Each dimension should be calculated independently and then summed for total value.*
