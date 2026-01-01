import { describe, it, expect, vi } from 'vitest';
import {
  INDUSTRIES,
  calculateDLA,
  calculateTA,
  calculateDQP,
  calculateLV,
  calculateOLV,
  calculateCompositeRisk,
  getMaturityMultiplier,
  getMaturityStage,
  calculateMonthlyProjections,
  calculateNPV,
  calculatePaybackPeriod,
  calculateIRR,
  calculateFullResults,
  runMonteCarloSimulation,
  runSensitivityAnalysis
} from './calculator';

describe('INDUSTRIES constant', () => {
  it('should have all required industry presets', () => {
    expect(INDUSTRIES).toHaveProperty('healthcare');
    expect(INDUSTRIES).toHaveProperty('financial_services');
    expect(INDUSTRIES).toHaveProperty('retail');
    expect(INDUSTRIES).toHaveProperty('manufacturing');
    expect(INDUSTRIES).toHaveProperty('government');
    expect(INDUSTRIES).toHaveProperty('technology');
    expect(INDUSTRIES).toHaveProperty('professional_services');
  });

  it('should have valid structure for each industry', () => {
    Object.values(INDUSTRIES).forEach(industry => {
      expect(industry).toHaveProperty('name');
      expect(industry).toHaveProperty('hourlyRate');
      expect(industry).toHaveProperty('accuracy');
      expect(industry).toHaveProperty('oversightRate');
      expect(industry).toHaveProperty('risks');
      expect(industry).toHaveProperty('maturity');
      expect(industry.risks).toHaveProperty('technical');
      expect(industry.risks).toHaveProperty('adoption');
      expect(industry.risks).toHaveProperty('regulatory');
      expect(industry.risks).toHaveProperty('vendor');
    });
  });

  it('should have hourly rates between 20 and 100', () => {
    Object.values(INDUSTRIES).forEach(industry => {
      expect(industry.hourlyRate).toBeGreaterThanOrEqual(20);
      expect(industry.hourlyRate).toBeLessThanOrEqual(100);
    });
  });
});

describe('calculateDLA', () => {
  it('should return 0 for empty task list', () => {
    expect(calculateDLA([])).toBe(0);
  });

  it('should calculate Direct Labour Arbitrage correctly', () => {
    const tasks = [{
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }];
    // Monthly hours = 40 * 4.33 = 173.2
    // Effective accuracy = 0.9 * (1 - 0.1) = 0.81
    // DLA = 173.2 * 50 * 0.81 = 7014.6
    const result = calculateDLA(tasks);
    expect(result).toBeCloseTo(7014.6, 0);
  });

  it('should sum multiple tasks correctly', () => {
    const tasks = [
      { hoursPerWeek: 20, hourlyRate: 30, accuracy: 0.85, oversightRate: 0.15 },
      { hoursPerWeek: 10, hourlyRate: 40, accuracy: 0.90, oversightRate: 0.10 }
    ];
    const result = calculateDLA(tasks);
    expect(result).toBeGreaterThan(0);
  });

  it('should handle zero oversight rate', () => {
    const tasks = [{
      hoursPerWeek: 10,
      hourlyRate: 100,
      accuracy: 1.0,
      oversightRate: 0
    }];
    const result = calculateDLA(tasks);
    // 10 * 4.33 * 100 * 1.0 = 4330
    expect(result).toBeCloseTo(4330, 0);
  });
});

describe('calculateTA', () => {
  it('should return 0 when throughput is disabled', () => {
    expect(calculateTA({ enabled: false })).toBe(0);
    expect(calculateTA(null)).toBe(0);
    expect(calculateTA(undefined)).toBe(0);
  });

  it('should return 0 when new capacity is not greater than old', () => {
    const throughput = {
      enabled: true,
      oldCapacity: 100,
      newCapacity: 100,
      valuePerUnit: 50,
      utilizationRate: 0.8
    };
    expect(calculateTA(throughput)).toBe(0);
  });

  it('should calculate Throughput Amplification correctly', () => {
    const throughput = {
      enabled: true,
      oldCapacity: 100,
      newCapacity: 150,
      valuePerUnit: 50,
      utilizationRate: 0.8
    };
    // (150 - 100) * 50 * 0.8 = 2000
    expect(calculateTA(throughput)).toBe(2000);
  });
});

describe('calculateDQP', () => {
  it('should return 0 for empty task list', () => {
    expect(calculateDQP([])).toBe(0);
  });

  it('should return 0 when task has no error cost or baseline', () => {
    const tasks = [{ accuracy: 0.9 }];
    expect(calculateDQP(tasks)).toBe(0);
  });

  it('should calculate Decision Quality Premium correctly', () => {
    const tasks = [{
      volumePerWeek: 100,
      accuracy: 0.95,
      baselineErrorRate: 0.15,
      errorCost: 200
    }];
    // Decisions/month = 100 * 4.33 = 433
    // AI error rate = 1 - 0.95 = 0.05
    // Error reduction = 0.15 - 0.05 = 0.10
    // DQP = 433 * 0.10 * 200 = 8660
    const result = calculateDQP(tasks);
    expect(result).toBeCloseTo(8660, 0);
  });

  it('should return 0 when AI performs worse than baseline', () => {
    const tasks = [{
      volumePerWeek: 100,
      accuracy: 0.80,
      baselineErrorRate: 0.10,
      errorCost: 200
    }];
    expect(calculateDQP(tasks)).toBe(0);
  });
});

describe('calculateLV', () => {
  it('should return 0 when latency is disabled', () => {
    expect(calculateLV({ enabled: false })).toBe(0);
    expect(calculateLV(null)).toBe(0);
    expect(calculateLV(undefined)).toBe(0);
  });

  it('should return 0 when no time is saved', () => {
    const latency = {
      enabled: true,
      oldTimeHours: 24,
      newTimeHours: 24,
      transactionsPerMonth: 100,
      valuePerHourSaved: 50,
      sensitivityFactor: 1.0
    };
    expect(calculateLV(latency)).toBe(0);
  });

  it('should calculate Latency Value correctly', () => {
    const latency = {
      enabled: true,
      oldTimeHours: 48,
      newTimeHours: 8,
      transactionsPerMonth: 100,
      valuePerHourSaved: 25,
      sensitivityFactor: 0.8
    };
    // Time saved = 48 - 8 = 40 hours
    // LV = 100 * 40 * 25 * 0.8 = 80000
    expect(calculateLV(latency)).toBe(80000);
  });
});

describe('calculateOLV', () => {
  it('should return 0 when optionality is disabled', () => {
    expect(calculateOLV({ enabled: false })).toBe(0);
    expect(calculateOLV(null)).toBe(0);
    expect(calculateOLV(undefined)).toBe(0);
  });

  it('should calculate Optionality & Learning Value correctly', () => {
    const optionality = {
      enabled: true,
      processInsights: 120000,
      dataAssets: 60000,
      capabilityOptions: 48000,
      probabilityFactor: 0.5
    };
    // Annual value = 120000 + 60000 + 48000 = 228000
    // Monthly = 228000 / 12 = 19000
    // OLV = 19000 * 0.5 = 9500
    expect(calculateOLV(optionality)).toBe(9500);
  });
});

describe('calculateCompositeRisk', () => {
  it('should calculate weighted risk correctly', () => {
    const risks = {
      technical: 0.2,
      adoption: 0.3,
      regulatory: 0.1,
      vendor: 0.1
    };
    // Weights: technical=0.35, adoption=0.35, regulatory=0.15, vendor=0.15
    // Composite = 0.2*0.35 + 0.3*0.35 + 0.1*0.15 + 0.1*0.15 = 0.07 + 0.105 + 0.015 + 0.015 = 0.205
    expect(calculateCompositeRisk(risks)).toBeCloseTo(0.205, 3);
  });

  it('should handle zero risks', () => {
    const risks = {
      technical: 0,
      adoption: 0,
      regulatory: 0,
      vendor: 0
    };
    expect(calculateCompositeRisk(risks)).toBe(0);
  });

  it('should handle maximum risks', () => {
    const risks = {
      technical: 1,
      adoption: 1,
      regulatory: 1,
      vendor: 1
    };
    expect(calculateCompositeRisk(risks)).toBe(1);
  });
});

describe('getMaturityMultiplier', () => {
  const maturityConfig = {
    pilot: 3,
    proven: 6,
    scaled: 6,
    learningRate: 0.02
  };

  it('should return 0.3 during pilot phase', () => {
    expect(getMaturityMultiplier(1, maturityConfig)).toBe(0.3);
    expect(getMaturityMultiplier(3, maturityConfig)).toBe(0.3);
  });

  it('should return 0.7 during proven phase', () => {
    expect(getMaturityMultiplier(4, maturityConfig)).toBe(0.7);
    expect(getMaturityMultiplier(9, maturityConfig)).toBe(0.7);
  });

  it('should return 1.0 during scaled phase', () => {
    expect(getMaturityMultiplier(10, maturityConfig)).toBe(1.0);
    expect(getMaturityMultiplier(15, maturityConfig)).toBe(1.0);
  });

  it('should return >1.0 during optimized phase with growth', () => {
    const result = getMaturityMultiplier(20, maturityConfig);
    expect(result).toBeGreaterThan(1.0);
    expect(result).toBeLessThanOrEqual(1.8);
  });

  it('should cap at 1.8x during optimized phase', () => {
    const result = getMaturityMultiplier(100, maturityConfig);
    expect(result).toBeLessThanOrEqual(1.8);
  });
});

describe('getMaturityStage', () => {
  const maturityConfig = { pilot: 3, proven: 6, scaled: 6 };

  it('should return correct stage names', () => {
    expect(getMaturityStage(1, maturityConfig)).toBe('Pilot');
    expect(getMaturityStage(3, maturityConfig)).toBe('Pilot');
    expect(getMaturityStage(4, maturityConfig)).toBe('Proven');
    expect(getMaturityStage(9, maturityConfig)).toBe('Proven');
    expect(getMaturityStage(10, maturityConfig)).toBe('Scaled');
    expect(getMaturityStage(15, maturityConfig)).toBe('Scaled');
    expect(getMaturityStage(16, maturityConfig)).toBe('Optimized');
    expect(getMaturityStage(24, maturityConfig)).toBe('Optimized');
  });
});

describe('calculateMonthlyProjections', () => {
  const sampleProject = {
    tasks: [{
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }],
    costs: {
      initialDevelopment: 50000,
      trainingInitial: 5000,
      changeManagement: 3000,
      platformMonthly: 2000,
      apiCostPerCall: 0.01,
      estimatedCallsPerMonth: 10000,
      maintenanceMonthly: 500,
      trainingOngoing: 200
    },
    risks: {
      technical: 0.15,
      adoption: 0.20,
      regulatory: 0.10,
      vendor: 0.10
    },
    throughput: { enabled: false },
    latency: { enabled: false },
    optionality: { enabled: false },
    duration: 24,
    maturity: { pilot: 3, proven: 6, scaled: 6, learningRate: 0.02 }
  };

  it('should generate correct number of months', () => {
    const projections = calculateMonthlyProjections(sampleProject);
    expect(projections).toHaveLength(24);
  });

  it('should have correct structure for each month', () => {
    const projections = calculateMonthlyProjections(sampleProject);
    projections.forEach((p, i) => {
      expect(p).toHaveProperty('month', i + 1);
      expect(p).toHaveProperty('stage');
      expect(p).toHaveProperty('multiplier');
      expect(p).toHaveProperty('grossValue');
      expect(p).toHaveProperty('riskAdjustedValue');
      expect(p).toHaveProperty('cost');
      expect(p).toHaveProperty('netValue');
      expect(p).toHaveProperty('cumulativeNet');
      expect(p).toHaveProperty('breakdown');
    });
  });

  it('should have higher cost in month 1 (includes initial)', () => {
    const projections = calculateMonthlyProjections(sampleProject);
    expect(projections[0].cost).toBeGreaterThan(projections[1].cost);
  });

  it('should show cumulative net starting negative and potentially turning positive', () => {
    const projections = calculateMonthlyProjections(sampleProject);
    expect(projections[0].cumulativeNet).toBeLessThan(0);
  });
});

describe('calculateNPV', () => {
  it('should discount future values correctly', () => {
    const projections = [
      { month: 1, netValue: 1000 },
      { month: 2, netValue: 1000 },
      { month: 3, netValue: 1000 }
    ];
    const npv10 = calculateNPV(projections, 0.10);
    const npv20 = calculateNPV(projections, 0.20);

    // Higher discount rate should yield lower NPV
    expect(npv10).toBeGreaterThan(npv20);
  });

  it('should return sum when discount rate is 0', () => {
    const projections = [
      { month: 1, netValue: 1000 },
      { month: 2, netValue: 1000 }
    ];
    const npv = calculateNPV(projections, 0);
    expect(npv).toBeCloseTo(2000, 0);
  });
});

describe('calculatePaybackPeriod', () => {
  it('should return null when project never breaks even', () => {
    const projections = [
      { month: 1, cumulativeNet: -10000 },
      { month: 2, cumulativeNet: -9000 },
      { month: 3, cumulativeNet: -8000 }
    ];
    expect(calculatePaybackPeriod(projections)).toBeNull();
  });

  it('should return exact month when cumulative becomes zero', () => {
    const projections = [
      { month: 1, cumulativeNet: -1000 },
      { month: 2, cumulativeNet: 0 },
      { month: 3, cumulativeNet: 1000 }
    ];
    expect(calculatePaybackPeriod(projections)).toBe(2);
  });

  it('should interpolate payback between months', () => {
    const projections = [
      { month: 1, cumulativeNet: -1000 },
      { month: 2, cumulativeNet: 1000 }
    ];
    // Linear interpolation: fraction = 1000/2000 = 0.5
    // Payback = 1 + 0.5 = 1.5
    expect(calculatePaybackPeriod(projections)).toBeCloseTo(1.5, 1);
  });

  it('should return month 1 if immediately positive', () => {
    const projections = [
      { month: 1, cumulativeNet: 1000 },
      { month: 2, cumulativeNet: 2000 }
    ];
    expect(calculatePaybackPeriod(projections)).toBe(1);
  });
});

describe('calculateIRR', () => {
  it('should return null for all positive cash flows', () => {
    const projections = [
      { netValue: 100 },
      { netValue: 200 },
      { netValue: 300 }
    ];
    expect(calculateIRR(projections)).toBeNull();
  });

  it('should return null for all negative cash flows', () => {
    const projections = [
      { netValue: -100 },
      { netValue: -200 },
      { netValue: -300 }
    ];
    expect(calculateIRR(projections)).toBeNull();
  });

  it('should calculate positive IRR for profitable project', () => {
    const projections = [
      { netValue: -50000 },
      { netValue: 10000 },
      { netValue: 10000 },
      { netValue: 10000 },
      { netValue: 10000 },
      { netValue: 10000 },
      { netValue: 10000 }
    ];
    const irr = calculateIRR(projections);
    expect(irr).toBeGreaterThan(0);
  });
});

describe('calculateFullResults', () => {
  const sampleProject = {
    tasks: [{
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }],
    costs: {
      initialDevelopment: 30000,
      trainingInitial: 2000,
      changeManagement: 1000,
      platformMonthly: 1000,
      apiCostPerCall: 0.01,
      estimatedCallsPerMonth: 5000,
      maintenanceMonthly: 300,
      trainingOngoing: 100
    },
    risks: {
      technical: 0.10,
      adoption: 0.15,
      regulatory: 0.05,
      vendor: 0.05
    },
    throughput: { enabled: false },
    latency: { enabled: false },
    optionality: { enabled: false },
    duration: 24,
    maturity: { pilot: 2, proven: 4, scaled: 6, learningRate: 0.02 },
    discountRate: 0.10
  };

  it('should return complete results structure', () => {
    const results = calculateFullResults(sampleProject);

    expect(results).toHaveProperty('projections');
    expect(results).toHaveProperty('totalGross');
    expect(results).toHaveProperty('totalRiskAdjusted');
    expect(results).toHaveProperty('totalCost');
    expect(results).toHaveProperty('npv');
    expect(results).toHaveProperty('payback');
    expect(results).toHaveProperty('roi');
    expect(results).toHaveProperty('valueBreakdown');
    expect(results).toHaveProperty('compositeRisk');
    expect(results).toHaveProperty('riskAdjustment');
  });

  it('should calculate positive ROI for viable project', () => {
    const results = calculateFullResults(sampleProject);
    expect(results.roi).toBeGreaterThan(0);
  });

  it('should have valueBreakdown with all dimensions', () => {
    const results = calculateFullResults(sampleProject);
    expect(results.valueBreakdown).toHaveProperty('dla');
    expect(results.valueBreakdown).toHaveProperty('ta');
    expect(results.valueBreakdown).toHaveProperty('dqp');
    expect(results.valueBreakdown).toHaveProperty('lv');
    expect(results.valueBreakdown).toHaveProperty('olv');
    expect(results.valueBreakdown).toHaveProperty('total');
  });

  it('should have risk adjustment between 0 and 1', () => {
    const results = calculateFullResults(sampleProject);
    expect(results.riskAdjustment).toBeGreaterThan(0);
    expect(results.riskAdjustment).toBeLessThanOrEqual(1);
  });
});

describe('runMonteCarloSimulation', () => {
  const sampleProject = {
    tasks: [{
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }],
    costs: {
      initialDevelopment: 30000,
      trainingInitial: 2000,
      changeManagement: 1000,
      platformMonthly: 1000,
      apiCostPerCall: 0.01,
      estimatedCallsPerMonth: 5000,
      maintenanceMonthly: 300,
      trainingOngoing: 100
    },
    risks: {
      technical: 0.10,
      adoption: 0.15,
      regulatory: 0.05,
      vendor: 0.05
    },
    throughput: { enabled: false },
    latency: { enabled: false },
    optionality: { enabled: false },
    duration: 24,
    maturity: { pilot: 2, proven: 4, scaled: 6, learningRate: 0.02 },
    discountRate: 0.10
  };

  it('should return percentiles for ROI, NPV, and payback', () => {
    const results = runMonteCarloSimulation(sampleProject, 100);

    expect(results.roi).toHaveProperty('p10');
    expect(results.roi).toHaveProperty('p50');
    expect(results.roi).toHaveProperty('p90');
    expect(results.roi).toHaveProperty('mean');

    expect(results.npv).toHaveProperty('p10');
    expect(results.npv).toHaveProperty('p50');
    expect(results.npv).toHaveProperty('p90');
    expect(results.npv).toHaveProperty('mean');

    expect(results.payback).toHaveProperty('p10');
    expect(results.payback).toHaveProperty('p50');
    expect(results.payback).toHaveProperty('p90');
  });

  it('should have p10 <= p50 <= p90 for ROI', () => {
    const results = runMonteCarloSimulation(sampleProject, 100);
    expect(results.roi.p10).toBeLessThanOrEqual(results.roi.p50);
    expect(results.roi.p50).toBeLessThanOrEqual(results.roi.p90);
  });

  it('should return distribution array', () => {
    const results = runMonteCarloSimulation(sampleProject, 50);
    expect(results.distribution).toHaveLength(50);
    results.distribution.forEach(r => {
      expect(r).toHaveProperty('roi');
      expect(r).toHaveProperty('npv');
      expect(r).toHaveProperty('payback');
    });
  });
});

describe('runSensitivityAnalysis', () => {
  const sampleProject = {
    tasks: [{
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }],
    costs: {
      initialDevelopment: 30000,
      trainingInitial: 2000,
      changeManagement: 1000,
      platformMonthly: 1000,
      apiCostPerCall: 0.01,
      estimatedCallsPerMonth: 5000,
      maintenanceMonthly: 300,
      trainingOngoing: 100
    },
    risks: {
      technical: 0.10,
      adoption: 0.15,
      regulatory: 0.05,
      vendor: 0.05
    },
    throughput: { enabled: false },
    latency: { enabled: false },
    optionality: { enabled: false },
    duration: 24,
    maturity: { pilot: 2, proven: 4, scaled: 6, learningRate: 0.02 },
    discountRate: 0.10
  };

  it('should return array matching variations count', () => {
    const variations = [0.8, 1.0, 1.2];
    const results = runSensitivityAnalysis(sampleProject, 'accuracy', variations);
    expect(results).toHaveLength(3);
  });

  it('should include multiplier, roi, npv, payback in results', () => {
    const results = runSensitivityAnalysis(sampleProject, 'accuracy');
    results.forEach(r => {
      expect(r).toHaveProperty('multiplier');
      expect(r).toHaveProperty('roi');
      expect(r).toHaveProperty('npv');
      expect(r).toHaveProperty('payback');
    });
  });

  it('should show higher ROI with higher accuracy', () => {
    const results = runSensitivityAnalysis(sampleProject, 'accuracy', [0.8, 1.0, 1.2]);
    expect(results[2].roi).toBeGreaterThan(results[0].roi);
  });

  it('should show lower ROI with higher costs', () => {
    const results = runSensitivityAnalysis(sampleProject, 'cost', [0.8, 1.0, 1.2]);
    expect(results[0].roi).toBeGreaterThan(results[2].roi);
  });

  it('should handle hourlyRate parameter', () => {
    const results = runSensitivityAnalysis(sampleProject, 'hourlyRate', [0.8, 1.0, 1.2]);
    expect(results).toHaveLength(3);
  });

  it('should handle risk parameter', () => {
    const results = runSensitivityAnalysis(sampleProject, 'risk', [0.8, 1.0, 1.2]);
    expect(results).toHaveLength(3);
    // Lower risk multiplier should mean lower overall risk, thus higher ROI
    expect(results[0].roi).toBeGreaterThan(results[2].roi);
  });
});
