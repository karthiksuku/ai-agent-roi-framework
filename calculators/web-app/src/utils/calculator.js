// AURA Framework Calculator Logic

export const INDUSTRIES = {
  healthcare: {
    name: 'Healthcare',
    hourlyRate: 55,
    accuracy: 0.88,
    oversightRate: 0.25,
    risks: { technical: 0.15, adoption: 0.20, regulatory: 0.25, vendor: 0.10 },
    maturity: { pilot: 4, proven: 8, scaled: 12, learningRate: 0.015 }
  },
  financial_services: {
    name: 'Financial Services',
    hourlyRate: 65,
    accuracy: 0.94,
    oversightRate: 0.18,
    risks: { technical: 0.12, adoption: 0.15, regulatory: 0.22, vendor: 0.12 },
    maturity: { pilot: 3, proven: 6, scaled: 9, learningRate: 0.02 }
  },
  retail: {
    name: 'Retail',
    hourlyRate: 28,
    accuracy: 0.91,
    oversightRate: 0.12,
    risks: { technical: 0.10, adoption: 0.12, regulatory: 0.08, vendor: 0.10 },
    maturity: { pilot: 2, proven: 4, scaled: 6, learningRate: 0.03 }
  },
  manufacturing: {
    name: 'Manufacturing',
    hourlyRate: 40,
    accuracy: 0.93,
    oversightRate: 0.15,
    risks: { technical: 0.12, adoption: 0.15, regulatory: 0.10, vendor: 0.08 },
    maturity: { pilot: 3, proven: 5, scaled: 8, learningRate: 0.025 }
  },
  government: {
    name: 'Government',
    hourlyRate: 45,
    accuracy: 0.90,
    oversightRate: 0.20,
    risks: { technical: 0.12, adoption: 0.25, regulatory: 0.20, vendor: 0.15 },
    maturity: { pilot: 4, proven: 9, scaled: 12, learningRate: 0.012 }
  },
  technology: {
    name: 'Technology',
    hourlyRate: 75,
    accuracy: 0.92,
    oversightRate: 0.10,
    risks: { technical: 0.08, adoption: 0.08, regulatory: 0.08, vendor: 0.12 },
    maturity: { pilot: 2, proven: 4, scaled: 6, learningRate: 0.035 }
  },
  professional_services: {
    name: 'Professional Services',
    hourlyRate: 85,
    accuracy: 0.91,
    oversightRate: 0.20,
    risks: { technical: 0.10, adoption: 0.18, regulatory: 0.15, vendor: 0.10 },
    maturity: { pilot: 3, proven: 5, scaled: 8, learningRate: 0.022 }
  }
};

const WEEKS_PER_MONTH = 4.33;

export function calculateDLA(tasks) {
  return tasks.reduce((total, task) => {
    const monthlyHours = task.hoursPerWeek * WEEKS_PER_MONTH;
    const effectiveAccuracy = task.accuracy * (1 - task.oversightRate);
    return total + (monthlyHours * task.hourlyRate * effectiveAccuracy);
  }, 0);
}

export function calculateTA(throughput) {
  if (!throughput || !throughput.enabled) return 0;
  const capacityIncrease = throughput.newCapacity - throughput.oldCapacity;
  if (capacityIncrease <= 0) return 0;
  return capacityIncrease * throughput.valuePerUnit * throughput.utilizationRate;
}

export function calculateDQP(tasks) {
  return tasks.reduce((total, task) => {
    if (!task.errorCost || !task.baselineErrorRate) return total;
    const decisionsPerMonth = task.volumePerWeek ? task.volumePerWeek * WEEKS_PER_MONTH : 0;
    const aiErrorRate = 1 - task.accuracy;
    const errorReduction = Math.max(0, task.baselineErrorRate - aiErrorRate);
    return total + (decisionsPerMonth * errorReduction * task.errorCost);
  }, 0);
}

export function calculateLV(latency) {
  if (!latency || !latency.enabled) return 0;
  const timeSaved = latency.oldTimeHours - latency.newTimeHours;
  if (timeSaved <= 0) return 0;
  return latency.transactionsPerMonth * timeSaved * latency.valuePerHourSaved * latency.sensitivityFactor;
}

export function calculateOLV(optionality) {
  if (!optionality || !optionality.enabled) return 0;
  const annualValue = optionality.processInsights + optionality.dataAssets + optionality.capabilityOptions;
  return (annualValue / 12) * optionality.probabilityFactor;
}

export function calculateCompositeRisk(risks) {
  const weights = { technical: 0.35, adoption: 0.35, regulatory: 0.15, vendor: 0.15 };
  return Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (risks[key] || 0) * weight;
  }, 0);
}

export function getMaturityMultiplier(month, maturityConfig) {
  const { pilot, proven, scaled, learningRate } = maturityConfig;

  if (month <= pilot) return 0.3;
  if (month <= pilot + proven) return 0.7;
  if (month <= pilot + proven + scaled) return 1.0;

  // Optimized phase with learning rate
  const monthsInOptimized = month - (pilot + proven + scaled);
  const growth = Math.pow(1 + learningRate, monthsInOptimized);
  return Math.min(1.3 * growth, 1.8);
}

export function getMaturityStage(month, maturityConfig) {
  const { pilot, proven, scaled } = maturityConfig;
  if (month <= pilot) return 'Pilot';
  if (month <= pilot + proven) return 'Proven';
  if (month <= pilot + proven + scaled) return 'Scaled';
  return 'Optimized';
}

export function calculateMonthlyProjections(project) {
  const { tasks, costs, risks, throughput, latency, optionality, duration, maturity } = project;

  const baseDLA = calculateDLA(tasks);
  const baseTA = calculateTA(throughput);
  const baseDQP = calculateDQP(tasks);
  const baseLV = calculateLV(latency);
  const baseOLV = calculateOLV(optionality);
  const baseMonthlyValue = baseDLA + baseTA + baseDQP + baseLV + baseOLV;

  const compositeRisk = calculateCompositeRisk(risks);
  const riskAdjustment = 1 - compositeRisk;

  const initialCost = costs.initialDevelopment + costs.trainingInitial + costs.changeManagement;
  const monthlyCost = costs.platformMonthly +
    (costs.apiCostPerCall * costs.estimatedCallsPerMonth) +
    costs.maintenanceMonthly +
    costs.trainingOngoing;

  let cumulativeNet = -initialCost;
  const projections = [];

  for (let month = 1; month <= duration; month++) {
    const multiplier = getMaturityMultiplier(month, maturity);
    const stage = getMaturityStage(month, maturity);

    const grossValue = baseMonthlyValue * multiplier;
    const riskAdjustedValue = grossValue * riskAdjustment;
    const cost = month === 1 ? initialCost + monthlyCost : monthlyCost;
    const netValue = riskAdjustedValue - cost;
    cumulativeNet += netValue;

    projections.push({
      month,
      stage,
      multiplier,
      grossValue,
      riskAdjustedValue,
      cost,
      netValue,
      cumulativeNet,
      breakdown: {
        dla: baseDLA * multiplier,
        ta: baseTA * multiplier,
        dqp: baseDQP * multiplier,
        lv: baseLV * multiplier,
        olv: baseOLV * multiplier
      }
    });
  }

  return projections;
}

export function calculateNPV(projections, discountRate) {
  const monthlyRate = discountRate / 12;
  return projections.reduce((npv, p) => {
    const discountFactor = Math.pow(1 + monthlyRate, p.month);
    return npv + (p.netValue / discountFactor);
  }, 0);
}

export function calculatePaybackPeriod(projections) {
  for (let i = 0; i < projections.length; i++) {
    if (projections[i].cumulativeNet >= 0) {
      if (i === 0) return projections[i].month;
      const prev = projections[i - 1];
      const curr = projections[i];
      const valueChange = curr.cumulativeNet - prev.cumulativeNet;
      if (valueChange !== 0) {
        const fraction = -prev.cumulativeNet / valueChange;
        return prev.month + fraction;
      }
      return curr.month;
    }
  }
  return null;
}

export function calculateIRR(projections, maxIterations = 100, tolerance = 1e-6) {
  const cashFlows = projections.map(p => p.netValue);

  if (cashFlows.every(cf => cf >= 0) || cashFlows.every(cf => cf <= 0)) {
    return null;
  }

  let rate = 0.1 / 12;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let npvDerivative = 0;

    cashFlows.forEach((cf, t) => {
      const period = t + 1;
      const discount = Math.pow(1 + rate, period);
      npv += cf / discount;
      npvDerivative -= period * cf / (discount * (1 + rate));
    });

    if (Math.abs(npvDerivative) < tolerance) return null;

    const newRate = rate - npv / npvDerivative;

    if (Math.abs(newRate - rate) < tolerance) {
      const annualRate = Math.pow(1 + newRate, 12) - 1;
      return annualRate * 100;
    }

    rate = newRate;
  }

  return null;
}

export function calculateFullResults(project) {
  const projections = calculateMonthlyProjections(project);

  const totalGross = projections.reduce((sum, p) => sum + p.grossValue, 0);
  const totalRiskAdjusted = projections.reduce((sum, p) => sum + p.riskAdjustedValue, 0);
  const totalCost = projections.reduce((sum, p) => sum + p.cost, 0);

  const npv = calculateNPV(projections, project.discountRate || 0.10);
  const payback = calculatePaybackPeriod(projections);
  const irr = calculateIRR(projections);
  const roi = totalCost > 0 ? ((totalRiskAdjusted - totalCost) / totalCost) * 100 : 0;

  const lastProjection = projections[projections.length - 1];
  const valueBreakdown = {
    dla: calculateDLA(project.tasks),
    ta: calculateTA(project.throughput),
    dqp: calculateDQP(project.tasks),
    lv: calculateLV(project.latency),
    olv: calculateOLV(project.optionality)
  };
  valueBreakdown.total = Object.values(valueBreakdown).reduce((a, b) => a + b, 0);

  return {
    projections,
    totalGross,
    totalRiskAdjusted,
    totalCost,
    npv,
    payback,
    irr,
    roi,
    valueBreakdown,
    compositeRisk: calculateCompositeRisk(project.risks),
    riskAdjustment: 1 - calculateCompositeRisk(project.risks)
  };
}

// Monte Carlo Simulation
export function runMonteCarloSimulation(project, iterations = 1000) {
  const results = [];

  for (let i = 0; i < iterations; i++) {
    // Vary key parameters
    const variedProject = JSON.parse(JSON.stringify(project));

    // Vary accuracy by ±10%
    variedProject.tasks = variedProject.tasks.map(task => ({
      ...task,
      accuracy: Math.min(1, Math.max(0.5, task.accuracy * (0.9 + Math.random() * 0.2)))
    }));

    // Vary costs by ±20%
    variedProject.costs = {
      ...variedProject.costs,
      initialDevelopment: variedProject.costs.initialDevelopment * (0.8 + Math.random() * 0.4),
      platformMonthly: variedProject.costs.platformMonthly * (0.8 + Math.random() * 0.4)
    };

    // Vary risks by ±30%
    Object.keys(variedProject.risks).forEach(key => {
      variedProject.risks[key] = Math.min(1, Math.max(0, variedProject.risks[key] * (0.7 + Math.random() * 0.6)));
    });

    const result = calculateFullResults(variedProject);
    results.push({
      roi: result.roi,
      npv: result.npv,
      payback: result.payback
    });
  }

  // Calculate percentiles
  const sortedROI = results.map(r => r.roi).sort((a, b) => a - b);
  const sortedNPV = results.map(r => r.npv).sort((a, b) => a - b);
  const sortedPayback = results.map(r => r.payback).filter(p => p !== null).sort((a, b) => a - b);

  const getPercentile = (arr, p) => arr[Math.floor(arr.length * p / 100)] || 0;

  return {
    roi: {
      p10: getPercentile(sortedROI, 10),
      p50: getPercentile(sortedROI, 50),
      p90: getPercentile(sortedROI, 90),
      mean: sortedROI.reduce((a, b) => a + b, 0) / sortedROI.length
    },
    npv: {
      p10: getPercentile(sortedNPV, 10),
      p50: getPercentile(sortedNPV, 50),
      p90: getPercentile(sortedNPV, 90),
      mean: sortedNPV.reduce((a, b) => a + b, 0) / sortedNPV.length
    },
    payback: {
      p10: getPercentile(sortedPayback, 10),
      p50: getPercentile(sortedPayback, 50),
      p90: getPercentile(sortedPayback, 90),
      mean: sortedPayback.length > 0 ? sortedPayback.reduce((a, b) => a + b, 0) / sortedPayback.length : null
    },
    distribution: results
  };
}

// Sensitivity Analysis
export function runSensitivityAnalysis(project, parameter, variations = [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3]) {
  return variations.map(multiplier => {
    const variedProject = JSON.parse(JSON.stringify(project));

    switch (parameter) {
      case 'accuracy':
        variedProject.tasks = variedProject.tasks.map(task => ({
          ...task,
          accuracy: Math.min(1, task.accuracy * multiplier)
        }));
        break;
      case 'hourlyRate':
        variedProject.tasks = variedProject.tasks.map(task => ({
          ...task,
          hourlyRate: task.hourlyRate * multiplier
        }));
        break;
      case 'cost':
        variedProject.costs = {
          ...variedProject.costs,
          initialDevelopment: variedProject.costs.initialDevelopment * multiplier,
          platformMonthly: variedProject.costs.platformMonthly * multiplier,
          maintenanceMonthly: variedProject.costs.maintenanceMonthly * multiplier
        };
        break;
      case 'risk':
        Object.keys(variedProject.risks).forEach(key => {
          variedProject.risks[key] = Math.min(1, variedProject.risks[key] * multiplier);
        });
        break;
    }

    const result = calculateFullResults(variedProject);
    return {
      multiplier,
      roi: result.roi,
      npv: result.npv,
      payback: result.payback
    };
  });
}
