import React, { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const SafetyAnalysis = ({ grossBenefit = 500000, totalCost = 150000, onSafetyCalculated }) => {
  const [signals, setSignals] = useState({
    hallucinationRate: 3,
    accuracyRate: 94,
    consistencyRate: 90,
    guardrailRate: 5,
    humanOverrideRate: 8,
    escalationRate: 5,
    dataLeakIncidents: 0,
    modelDriftRetraining: 2,
    availability: 99.5,
    negativeFeedbackRate: 5
  });

  const [results, setResults] = useState(null);

  const calculateSafetyScore = () => {
    const weights = {
      hallucination: 0.20,
      accuracy: 0.15,
      guardrails: 0.10,
      humanOverride: 0.15,
      dataLeaks: 0.15,
      modelDrift: 0.10,
      availability: 0.10,
      userTrust: 0.05
    };

    const scores = {
      hallucination: 1 - Math.min((signals.hallucinationRate / 100) * 5, 1),
      accuracy: signals.accuracyRate / 100,
      guardrails: 1 - Math.min((signals.guardrailRate / 100) * 2, 1),
      humanOverride: 1 - Math.min((signals.humanOverrideRate / 100) * 2, 1),
      dataLeaks: signals.dataLeakIncidents === 0 ? 1 : Math.max(0, 1 - signals.dataLeakIncidents * 0.2),
      modelDrift: signals.modelDriftRetraining <= 2 ? 1 : Math.max(0, 1 - (signals.modelDriftRetraining - 2) * 0.1),
      availability: signals.availability / 100,
      userTrust: 1 - (signals.negativeFeedbackRate / 100)
    };

    let composite = 0;
    for (const key in weights) {
      composite += weights[key] * scores[key];
    }
    composite = Math.max(0, Math.min(1, composite));

    // Calculate safety discount
    let safetyDiscount;
    if (composite >= 0.9) {
      safetyDiscount = 1.0 - (1 - composite) * 0.5;
    } else if (composite >= 0.7) {
      safetyDiscount = 0.95 - (0.9 - composite) * 1.5;
    } else if (composite >= 0.5) {
      safetyDiscount = 0.65 - (0.7 - composite) * 1.25;
    } else {
      safetyDiscount = Math.max(0.1, composite * 1.2);
    }

    // Calculate ROIs
    const unadjustedROI = ((grossBenefit - totalCost) / totalCost) * 100;
    const adjustedBenefit = grossBenefit * safetyDiscount;
    const adjustedROI = ((adjustedBenefit - totalCost) / totalCost) * 100;

    // Check violations
    const violations = [];
    if (signals.hallucinationRate > 5) violations.push(`Hallucination rate (${signals.hallucinationRate}%) exceeds 5% threshold`);
    if (signals.accuracyRate < 90) violations.push(`Accuracy rate (${signals.accuracyRate}%) below 90% threshold`);
    if (signals.guardrailRate > 10) violations.push(`Guardrail intervention rate (${signals.guardrailRate}%) exceeds 10% threshold`);
    if (signals.humanOverrideRate > 15) violations.push(`Human override rate (${signals.humanOverrideRate}%) exceeds 15% threshold`);
    if (signals.dataLeakIncidents > 0) violations.push(`Data leak incidents (${signals.dataLeakIncidents}) detected`);
    if (signals.availability < 99.5) violations.push(`Availability (${signals.availability}%) below 99.5% threshold`);

    // Determine risk level
    let riskLevel;
    const hasCritical = signals.dataLeakIncidents > 0;
    if (hasCritical || composite < 0.5) {
      riskLevel = 'CRITICAL';
    } else if (composite < 0.7 || violations.length >= 3) {
      riskLevel = 'HIGH';
    } else if (composite < 0.85 || violations.length >= 1) {
      riskLevel = 'MEDIUM';
    } else {
      riskLevel = 'LOW';
    }

    // Generate recommendations
    const recommendations = [];
    if (signals.hallucinationRate > 3) {
      recommendations.push('Implement fact-checking layer or RAG system to reduce hallucinations');
    }
    if (signals.accuracyRate < 92) {
      recommendations.push('Review training data quality and consider model fine-tuning');
    }
    if (signals.humanOverrideRate > 10) {
      recommendations.push('Analyze override patterns to identify systematic issues');
    }
    if (signals.dataLeakIncidents > 0) {
      recommendations.push('URGENT: Conduct security audit and implement additional data protection');
    }
    if (signals.availability < 99.5) {
      recommendations.push('Review infrastructure reliability and implement redundancy');
    }
    if (recommendations.length === 0) {
      recommendations.push('Safety metrics are within acceptable ranges. Continue monitoring.');
    }

    // Radar chart data
    const radarData = [
      { subject: 'Accuracy', value: scores.accuracy * 100, fullMark: 100 },
      { subject: 'Hallucination Control', value: scores.hallucination * 100, fullMark: 100 },
      { subject: 'Guardrails', value: scores.guardrails * 100, fullMark: 100 },
      { subject: 'Human Oversight', value: scores.humanOverride * 100, fullMark: 100 },
      { subject: 'Data Security', value: scores.dataLeaks * 100, fullMark: 100 },
      { subject: 'Model Stability', value: scores.modelDrift * 100, fullMark: 100 },
      { subject: 'Availability', value: scores.availability * 100, fullMark: 100 },
      { subject: 'User Trust', value: scores.userTrust * 100, fullMark: 100 }
    ];

    const calculatedResults = {
      safetyScore: composite,
      safetyDiscount,
      unadjustedROI,
      adjustedROI,
      adjustedBenefit,
      roiImpact: adjustedROI - unadjustedROI,
      benefitReduction: grossBenefit - adjustedBenefit,
      violations,
      riskLevel,
      recommendations,
      radarData,
      scores
    };

    setResults(calculatedResults);

    if (onSafetyCalculated) {
      onSafetyCalculated(calculatedResults);
    }
  };

  useEffect(() => {
    calculateSafetyScore();
  }, [signals, grossBenefit, totalCost]);

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Safety-Adjusted ROI Analysis</h2>
        <p className="text-gray-600 mb-4">
          Incorporate operational safety signals to calculate risk-adjusted ROI projections.
        </p>

        {/* Safety Signals Input */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Hallucination Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.hallucinationRate}
              onChange={(e) => setSignals({ ...signals, hallucinationRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Accuracy Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.accuracyRate}
              onChange={(e) => setSignals({ ...signals, accuracyRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Guardrail Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.guardrailRate}
              onChange={(e) => setSignals({ ...signals, guardrailRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Human Override (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.humanOverrideRate}
              onChange={(e) => setSignals({ ...signals, humanOverrideRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Data Leak Incidents</label>
            <input
              type="number"
              min="0"
              value={signals.dataLeakIncidents}
              onChange={(e) => setSignals({ ...signals, dataLeakIncidents: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Model Retraining Count</label>
            <input
              type="number"
              min="0"
              value={signals.modelDriftRetraining}
              onChange={(e) => setSignals({ ...signals, modelDriftRetraining: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Availability (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.availability}
              onChange={(e) => setSignals({ ...signals, availability: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Negative Feedback (%)</label>
            <input
              type="number"
              step="0.1"
              value={signals.negativeFeedbackRate}
              onChange={(e) => setSignals({ ...signals, negativeFeedbackRate: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Safety Analysis Results</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(results.riskLevel)}`}>
              {results.riskLevel} RISK
            </span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Safety Score</p>
              <p className="text-2xl font-bold text-blue-900">{(results.safetyScore * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Safety Discount</p>
              <p className="text-2xl font-bold text-green-900">{(results.safetyDiscount * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 font-medium">Unadjusted ROI</p>
              <p className="text-2xl font-bold text-amber-900">{results.unadjustedROI.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Risk-Adjusted ROI</p>
              <p className="text-2xl font-bold text-purple-900">{results.adjustedROI.toFixed(1)}%</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-600 mb-2">Safety Dimensions</h4>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={results.radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Safety Score"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Financial Impact */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-2">Financial Impact</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Benefit Reduction</p>
                <p className="text-lg font-semibold text-red-600">-{formatCurrency(results.benefitReduction)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ROI Impact</p>
                <p className="text-lg font-semibold text-red-600">{results.roiImpact.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Violations */}
          {results.violations.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-md font-medium text-red-800 mb-2">Threshold Violations</h4>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                {results.violations.map((violation, index) => (
                  <li key={index}>{violation}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-md font-medium text-blue-800 mb-2">Recommendations</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              {results.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyAnalysis;
