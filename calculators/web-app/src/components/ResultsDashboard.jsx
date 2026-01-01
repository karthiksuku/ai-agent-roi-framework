import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c'];

function ResultsDashboard({ results, projections }) {
  const valueBreakdownData = [
    { name: 'DLA', value: results.valueBreakdown.dla, fullName: 'Direct Labour Arbitrage' },
    { name: 'TA', value: results.valueBreakdown.ta, fullName: 'Throughput Amplification' },
    { name: 'DQP', value: results.valueBreakdown.dqp, fullName: 'Decision Quality Premium' },
    { name: 'LV', value: results.valueBreakdown.lv, fullName: 'Latency Value' },
    { name: 'OLV', value: results.valueBreakdown.olv, fullName: 'Optionality & Learning' }
  ].filter(d => d.value > 0);

  const monthlyData = projections.map(p => ({
    month: `M${p.month}`,
    grossValue: Math.round(p.grossValue),
    riskAdjusted: Math.round(p.riskAdjustedValue),
    cost: Math.round(p.cost),
    netValue: Math.round(p.netValue),
    cumulative: Math.round(p.cumulativeNet),
    stage: p.stage
  }));

  const stageColors = {
    'Pilot': '#fef3c7',
    'Proven': '#dcfce7',
    'Scaled': '#dbeafe',
    'Optimized': '#ede9fe'
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="card">
          <h4 className="text-sm text-gray-500 mb-2">Total Value (Risk-Adjusted)</h4>
          <div className="text-3xl font-bold text-green-600">
            ${results.totalRiskAdjusted.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Gross: ${results.totalGross.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="card">
          <h4 className="text-sm text-gray-500 mb-2">Total Cost</h4>
          <div className="text-3xl font-bold text-red-600">
            ${results.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Over {projections.length} months
          </div>
        </div>
        <div className="card">
          <h4 className="text-sm text-gray-500 mb-2">Net Benefit</h4>
          <div className={`text-3xl font-bold ${results.totalRiskAdjusted - results.totalCost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(results.totalRiskAdjusted - results.totalCost).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Value Breakdown Pie */}
        <div className="card">
          <h4 className="font-semibold mb-4">Monthly Value Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={valueBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {valueBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `$${value.toLocaleString()}`,
                  props.payload.fullName
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500">Total Monthly Value</div>
            <div className="text-2xl font-bold text-blue-600">
              ${results.valueBreakdown.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Monthly Projection Line */}
        <div className="card">
          <h4 className="font-semibold mb-4">Monthly Value Projection</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
              <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, '']}
                labelFormatter={(label) => `Month ${label.replace('M', '')}`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="riskAdjusted"
                name="Risk-Adjusted Value"
                stroke="#22c55e"
                fill="#22c55e"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="cost"
                name="Cost"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cumulative Chart */}
      <div className="card">
        <h4 className="font-semibold mb-4">Cumulative Net Value Over Time</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
            <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, 'Cumulative']}
              labelFormatter={(label) => `Month ${label.replace('M', '')}`}
            />
            <defs>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorCumulative)"
            />
            {/* Break-even line */}
            <Line
              type="monotone"
              dataKey={() => 0}
              stroke="#666"
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        {results.payback && (
          <div className="mt-4 text-center p-3 bg-green-50 rounded-lg">
            <span className="text-green-800">
              Break-even at <strong>{results.payback.toFixed(1)} months</strong>
            </span>
          </div>
        )}
      </div>

      {/* Maturity Stages */}
      <div className="card">
        <h4 className="font-semibold mb-4">Maturity Stages & Multipliers</h4>
        <div className="flex gap-1 mb-4">
          {['Pilot', 'Proven', 'Scaled', 'Optimized'].map(stage => (
            <div
              key={stage}
              className="flex-1 py-2 text-center text-sm rounded"
              style={{ backgroundColor: stageColors[stage] }}
            >
              {stage}
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} interval={2} />
            <YAxis domain={[0, 2]} tickFormatter={(v) => `${v}x`} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={(d) => projections.find(p => `M${p.month}` === d.month)?.multiplier}
              name="Multiplier"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Table */}
      <div className="card">
        <h4 className="font-semibold mb-4">Monthly Breakdown</h4>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Month</th>
                <th className="px-3 py-2 text-left">Stage</th>
                <th className="px-3 py-2 text-right">Multiplier</th>
                <th className="px-3 py-2 text-right">Gross Value</th>
                <th className="px-3 py-2 text-right">Risk-Adjusted</th>
                <th className="px-3 py-2 text-right">Cost</th>
                <th className="px-3 py-2 text-right">Net</th>
                <th className="px-3 py-2 text-right">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {projections.map(p => (
                <tr key={p.month} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{p.month}</td>
                  <td className="px-3 py-2">
                    <span
                      className="px-2 py-1 rounded text-xs"
                      style={{ backgroundColor: stageColors[p.stage] }}
                    >
                      {p.stage}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right">{p.multiplier.toFixed(2)}x</td>
                  <td className="px-3 py-2 text-right">${p.grossValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="px-3 py-2 text-right">${p.riskAdjustedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className="px-3 py-2 text-right text-red-600">${p.cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                  <td className={`px-3 py-2 text-right ${p.netValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${p.netValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`px-3 py-2 text-right font-medium ${p.cumulativeNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${p.cumulativeNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultsDashboard;
