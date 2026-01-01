import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { GitCompare, Trash2, Plus, Download } from 'lucide-react';
import { getSavedScenarios, deleteScenario } from '../utils/storage';

function CompareScenarios({ currentScenario, currentResults }) {
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [selectedScenarios, setSelectedScenarios] = useState([]);
  const [includeCurrentInComparison, setIncludeCurrentInComparison] = useState(true);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = () => {
    const scenarios = getSavedScenarios();
    setSavedScenarios(scenarios);
  };

  const handleDeleteScenario = (id) => {
    deleteScenario(id);
    loadScenarios();
    setSelectedScenarios(prev => prev.filter(s => s.id !== id));
  };

  const toggleScenarioSelection = (scenario) => {
    setSelectedScenarios(prev => {
      const exists = prev.find(s => s.id === scenario.id);
      if (exists) {
        return prev.filter(s => s.id !== scenario.id);
      } else if (prev.length < 4) {
        return [...prev, scenario];
      }
      return prev;
    });
  };

  // Build comparison data
  const scenariosToCompare = [];
  if (includeCurrentInComparison && currentResults) {
    scenariosToCompare.push({
      name: 'Current',
      results: currentResults,
      scenario: currentScenario,
      color: '#3b82f6'
    });
  }
  selectedScenarios.forEach((s, i) => {
    const colors = ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
    scenariosToCompare.push({
      name: s.name,
      results: s.results,
      scenario: s.data,
      color: colors[i % colors.length]
    });
  });

  // Prepare bar chart data
  const barChartData = [
    {
      metric: 'ROI (%)',
      ...Object.fromEntries(scenariosToCompare.map(s => [s.name, s.results.roi]))
    },
    {
      metric: 'NPV ($k)',
      ...Object.fromEntries(scenariosToCompare.map(s => [s.name, s.results.npv / 1000]))
    },
    {
      metric: 'Payback (mo)',
      ...Object.fromEntries(scenariosToCompare.map(s => [s.name, s.results.paybackMonths || 0]))
    }
  ];

  // Prepare radar chart data for normalized comparison
  const radarData = [
    { metric: 'ROI', fullMark: 100, ...normalizeValues(scenariosToCompare, 'roi') },
    { metric: 'NPV', fullMark: 100, ...normalizeValues(scenariosToCompare, 'npv') },
    { metric: 'Speed', fullMark: 100, ...normalizePayback(scenariosToCompare) },
    { metric: 'Risk Adj.', fullMark: 100, ...normalizeRiskAdjustment(scenariosToCompare) }
  ];

  return (
    <div className="space-y-6">
      {/* Scenario Selector */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <GitCompare size={20} className="text-purple-600" />
          Select Scenarios to Compare
        </h3>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeCurrentInComparison}
              onChange={(e) => setIncludeCurrentInComparison(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Include current scenario</span>
          </label>
          <span className="text-sm text-gray-500">
            {selectedScenarios.length}/4 saved scenarios selected
          </span>
        </div>

        {savedScenarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No saved scenarios yet.</p>
            <p className="text-sm mt-2">Use the "Save Scenario" button on the Calculator tab to save scenarios for comparison.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {savedScenarios.map(scenario => {
              const isSelected = selectedScenarios.find(s => s.id === scenario.id);
              return (
                <div
                  key={scenario.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleScenarioSelection(scenario)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(scenario.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteScenario(scenario.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-green-600 font-medium">{scenario.results.roi.toFixed(0)}% ROI</span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-600">${(scenario.results.npv / 1000).toFixed(0)}k NPV</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comparison Charts */}
      {scenariosToCompare.length >= 2 && (
        <>
          {/* Bar Chart Comparison */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Key Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="metric" width={100} />
                <Tooltip />
                <Legend />
                {scenariosToCompare.map(s => (
                  <Bar
                    key={s.name}
                    dataKey={s.name}
                    fill={s.color}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Multi-Dimensional Comparison</h3>
            <p className="text-gray-500 text-sm mb-4">
              Normalized scores (0-100) across different performance dimensions
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis domain={[0, 100]} />
                {scenariosToCompare.map(s => (
                  <Radar
                    key={s.name}
                    name={s.name}
                    dataKey={s.name}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.2}
                  />
                ))}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Comparison Table */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Metric</th>
                    {scenariosToCompare.map(s => (
                      <th key={s.name} className="px-3 py-2 text-right" style={{ color: s.color }}>
                        {s.name}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right text-gray-500">Best</th>
                  </tr>
                </thead>
                <tbody>
                  <ComparisonRow
                    label="ROI"
                    values={scenariosToCompare.map(s => s.results.roi)}
                    format={(v) => `${v.toFixed(1)}%`}
                    higherBetter={true}
                    scenarios={scenariosToCompare}
                  />
                  <ComparisonRow
                    label="NPV"
                    values={scenariosToCompare.map(s => s.results.npv)}
                    format={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    higherBetter={true}
                    scenarios={scenariosToCompare}
                  />
                  <ComparisonRow
                    label="Total Benefits"
                    values={scenariosToCompare.map(s => s.results.totalBenefits)}
                    format={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    higherBetter={true}
                    scenarios={scenariosToCompare}
                  />
                  <ComparisonRow
                    label="Total Costs"
                    values={scenariosToCompare.map(s => s.results.totalCosts)}
                    format={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    higherBetter={false}
                    scenarios={scenariosToCompare}
                  />
                  <ComparisonRow
                    label="Payback Period"
                    values={scenariosToCompare.map(s => s.results.paybackMonths || 999)}
                    format={(v) => v >= 999 ? 'N/A' : `${v.toFixed(1)} months`}
                    higherBetter={false}
                    scenarios={scenariosToCompare}
                  />
                  <ComparisonRow
                    label="Risk-Adjusted Benefits"
                    values={scenariosToCompare.map(s => s.results.riskAdjustedBenefits)}
                    format={(v) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    higherBetter={true}
                    scenarios={scenariosToCompare}
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation */}
          <div className="card bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="font-semibold text-lg mb-3">Recommendation</h3>
            {(() => {
              const best = scenariosToCompare.reduce((a, b) =>
                a.results.roi > b.results.roi ? a : b
              );
              const secondBest = scenariosToCompare
                .filter(s => s.name !== best.name)
                .reduce((a, b) => a.results.roi > b.results.roi ? a : b, { results: { roi: 0 } });

              return (
                <div className="text-sm space-y-2">
                  <p>
                    <strong>{best.name}</strong> offers the highest ROI at <span className="text-green-600 font-medium">{best.results.roi.toFixed(1)}%</span>.
                  </p>
                  {secondBest.name && (
                    <p>
                      Compared to {secondBest.name}, this is{' '}
                      <span className="font-medium">
                        {(best.results.roi - secondBest.results.roi).toFixed(1)} percentage points higher
                      </span>.
                    </p>
                  )}
                  <p className="text-gray-500 mt-2">
                    Consider risk tolerance, implementation complexity, and organizational readiness
                    when making your final decision.
                  </p>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {scenariosToCompare.length < 2 && (
        <div className="card text-center py-12 text-gray-500">
          <GitCompare size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select at least 2 scenarios to compare</p>
          <p className="text-sm mt-2">
            {includeCurrentInComparison
              ? 'Select 1+ saved scenario to compare with current'
              : 'Select 2+ saved scenarios or include current scenario'}
          </p>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ label, values, format, higherBetter, scenarios }) {
  const bestIndex = higherBetter
    ? values.indexOf(Math.max(...values))
    : values.indexOf(Math.min(...values.filter(v => v > 0)));

  return (
    <tr className="border-b">
      <td className="px-3 py-2 font-medium">{label}</td>
      {values.map((value, i) => (
        <td
          key={i}
          className={`px-3 py-2 text-right ${i === bestIndex ? 'font-semibold text-green-600' : ''}`}
        >
          {format(value)}
        </td>
      ))}
      <td className="px-3 py-2 text-right text-gray-500">
        {scenarios[bestIndex]?.name}
      </td>
    </tr>
  );
}

function normalizeValues(scenarios, key) {
  const values = scenarios.map(s => s.results[key]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return Object.fromEntries(
    scenarios.map(s => [s.name, ((s.results[key] - min) / range) * 100])
  );
}

function normalizePayback(scenarios) {
  // Lower payback is better, so invert
  const paybacks = scenarios.map(s => s.results.paybackMonths || 36);
  const max = Math.max(...paybacks);
  const min = Math.min(...paybacks);
  const range = max - min || 1;

  return Object.fromEntries(
    scenarios.map(s => {
      const payback = s.results.paybackMonths || 36;
      return [s.name, ((max - payback) / range) * 100];
    })
  );
}

function normalizeRiskAdjustment(scenarios) {
  const values = scenarios.map(s => s.results.riskAdjustedBenefits / s.results.totalBenefits);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return Object.fromEntries(
    scenarios.map(s => {
      const ratio = s.results.riskAdjustedBenefits / s.results.totalBenefits;
      return [s.name, ((ratio - min) / range) * 100];
    })
  );
}

export default CompareScenarios;
