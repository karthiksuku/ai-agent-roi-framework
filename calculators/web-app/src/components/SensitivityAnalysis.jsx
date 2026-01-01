import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, AlertTriangle } from 'lucide-react';

function SensitivityAnalysis({ results, baseResults }) {
  const [selectedParameter, setSelectedParameter] = useState('accuracy');

  const parameters = [
    { key: 'accuracy', name: 'AI Accuracy', color: '#3b82f6' },
    { key: 'cost', name: 'Cost', color: '#ef4444' },
    { key: 'risk', name: 'Risk Level', color: '#f59e0b' }
  ];

  const currentData = results[selectedParameter].map(d => ({
    ...d,
    multiplierLabel: `${(d.multiplier * 100).toFixed(0)}%`,
    roiFormatted: d.roi.toFixed(1),
    npvFormatted: d.npv.toLocaleString(undefined, { maximumFractionDigits: 0 }),
    paybackFormatted: d.payback ? d.payback.toFixed(1) : 'N/A'
  }));

  // Calculate tornado chart data
  const tornadoData = parameters.map(param => {
    const data = results[param.key];
    const low = data[0];
    const high = data[data.length - 1];
    const base = data.find(d => d.multiplier === 1.0) || data[Math.floor(data.length / 2)];

    return {
      parameter: param.name,
      lowROI: low.roi,
      highROI: high.roi,
      baseROI: base.roi,
      range: Math.abs(high.roi - low.roi),
      lowLabel: `${(low.multiplier * 100).toFixed(0)}%`,
      highLabel: `${(high.multiplier * 100).toFixed(0)}%`
    };
  }).sort((a, b) => b.range - a.range);

  return (
    <div className="space-y-6">
      {/* Tornado Chart */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          Sensitivity Tornado Chart
        </h3>
        <p className="text-gray-500 text-sm mb-4">
          Shows which parameters have the greatest impact on ROI when varied by ±30%
        </p>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={tornadoData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={['auto', 'auto']} tickFormatter={(v) => `${v.toFixed(0)}%`} />
            <YAxis type="category" dataKey="parameter" width={120} />
            <Tooltip
              formatter={(value, name) => [`${value.toFixed(1)}%`, name === 'range' ? 'ROI Range' : 'ROI']}
            />
            <Bar dataKey="lowROI" name="Low Case" fill="#ef4444" />
            <Bar dataKey="highROI" name="High Case" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {tornadoData.map((item, i) => (
            <div key={item.parameter} className="p-3 bg-gray-50 rounded-lg">
              <div className="font-medium text-sm">{item.parameter}</div>
              <div className="text-xs text-gray-500 mt-1">
                {item.lowLabel} → {item.highLabel}
              </div>
              <div className="text-lg font-semibold mt-1">
                <span className="text-red-600">{item.lowROI.toFixed(0)}%</span>
                {' → '}
                <span className="text-green-600">{item.highROI.toFixed(0)}%</span>
              </div>
              <div className="text-xs text-gray-500">
                Range: {item.range.toFixed(0)} pp
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parameter Selector */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Detailed Sensitivity Analysis
        </h3>

        <div className="flex gap-2 mb-6">
          {parameters.map(param => (
            <button
              key={param.key}
              onClick={() => setSelectedParameter(param.key)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedParameter === param.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {param.name}
            </button>
          ))}
        </div>

        {/* Line Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">ROI Sensitivity</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="multiplierLabel" />
                <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} />
                <Tooltip
                  formatter={(value) => [`${value.toFixed(1)}%`, 'ROI']}
                  labelFormatter={(label) => `Parameter: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke={parameters.find(p => p.key === selectedParameter)?.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                {/* Reference line at base case */}
                <Line
                  type="monotone"
                  dataKey={() => baseResults.roi}
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">NPV Sensitivity</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="multiplierLabel" />
                <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, 'NPV']}
                  labelFormatter={(label) => `Parameter: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="npv"
                  stroke={parameters.find(p => p.key === selectedParameter)?.color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={() => baseResults.npv}
                  stroke="#9ca3af"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <h4 className="font-medium text-sm text-gray-600 mb-2">Sensitivity Data</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Parameter Level</th>
                <th className="px-3 py-2 text-right">ROI</th>
                <th className="px-3 py-2 text-right">NPV</th>
                <th className="px-3 py-2 text-right">Payback</th>
                <th className="px-3 py-2 text-right">vs Base</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, i) => {
                const isBase = row.multiplier === 1.0;
                const roiDiff = row.roi - baseResults.roi;
                return (
                  <tr key={i} className={`border-b ${isBase ? 'bg-blue-50 font-medium' : ''}`}>
                    <td className="px-3 py-2">{row.multiplierLabel} {isBase && '(Base)'}</td>
                    <td className="px-3 py-2 text-right">{row.roiFormatted}%</td>
                    <td className="px-3 py-2 text-right">${row.npvFormatted}</td>
                    <td className="px-3 py-2 text-right">{row.paybackFormatted} mo</td>
                    <td className={`px-3 py-2 text-right ${roiDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {roiDiff >= 0 ? '+' : ''}{roiDiff.toFixed(1)} pp
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              <strong>Most Sensitive:</strong> {tornadoData[0]?.parameter} has the largest impact on ROI
              ({tornadoData[0]?.range.toFixed(0)} percentage points swing)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">•</span>
            <span>
              <strong>Break-even:</strong> Even with {parameters.find(p => p.key === selectedParameter)?.name.toLowerCase()} at 70%,
              ROI remains {results[selectedParameter][0]?.roi > 0 ? 'positive' : 'negative'} at {results[selectedParameter][0]?.roi.toFixed(0)}%
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-600">•</span>
            <span>
              <strong>Upside:</strong> Improving {parameters.find(p => p.key === selectedParameter)?.name.toLowerCase()} by 30%
              could increase ROI to {results[selectedParameter][results[selectedParameter].length - 1]?.roi.toFixed(0)}%
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SensitivityAnalysis;
