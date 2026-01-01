import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function MonteCarloResults({ results }) {
  const { roiDistribution, npvDistribution, statistics, percentiles } = results;

  // Create histogram data for ROI
  const roiHistogram = createHistogram(roiDistribution, 20);
  const npvHistogram = createHistogram(npvDistribution, 20);

  // Create cumulative distribution
  const cumulativeData = createCumulativeDistribution(roiDistribution);

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mean ROI"
          value={`${statistics.mean.roi.toFixed(1)}%`}
          subtitle="Expected outcome"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Std Deviation"
          value={`${statistics.stdDev.roi.toFixed(1)}%`}
          subtitle="Volatility measure"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="5th Percentile"
          value={`${percentiles.p5.roi.toFixed(1)}%`}
          subtitle="Downside case"
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          title="95th Percentile"
          value={`${percentiles.p95.roi.toFixed(1)}%`}
          subtitle="Upside case"
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* ROI Distribution Histogram */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-600" />
          ROI Distribution (1,000 Simulations)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiHistogram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 11 }}
              interval={1}
            />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value, name) => [value, 'Count']}
              labelFormatter={(label) => `ROI Range: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Key Statistics */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-red-600 font-medium">Worst Case (1%)</div>
            <div className="text-lg font-semibold">{percentiles.p1.roi.toFixed(1)}%</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-medium">Median (50%)</div>
            <div className="text-lg font-semibold">{statistics.median.roi.toFixed(1)}%</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-green-600 font-medium">Best Case (99%)</div>
            <div className="text-lg font-semibold">{percentiles.p99.roi.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Cumulative Probability */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">Cumulative Probability Distribution</h3>
        <p className="text-gray-500 text-sm mb-4">
          Shows the probability of achieving at least a given ROI
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={cumulativeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="roi"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              label={{ value: 'ROI', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              label={{ value: 'Probability of Exceeding', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              formatter={(value) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
              labelFormatter={(label) => `ROI ≥ ${label.toFixed(1)}%`}
            />
            <Area
              type="monotone"
              dataKey="probability"
              stroke="#3b82f6"
              fill="#93c5fd"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Probability markers */}
        <div className="mt-4 grid grid-cols-4 gap-3 text-sm">
          <ProbabilityMarker
            label="Prob. ROI > 0%"
            value={calculateProbAbove(roiDistribution, 0)}
          />
          <ProbabilityMarker
            label="Prob. ROI > 50%"
            value={calculateProbAbove(roiDistribution, 50)}
          />
          <ProbabilityMarker
            label="Prob. ROI > 100%"
            value={calculateProbAbove(roiDistribution, 100)}
          />
          <ProbabilityMarker
            label="Prob. ROI > 200%"
            value={calculateProbAbove(roiDistribution, 200)}
          />
        </div>
      </div>

      {/* NPV Distribution */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4">NPV Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={npvHistogram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              tick={{ fontSize: 10 }}
              interval={2}
            />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => [value, 'Count']}
              labelFormatter={(label) => `NPV Range: ${label}`}
            />
            <Bar
              dataKey="count"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-600 font-medium">Expected NPV</div>
            <div className="text-lg font-semibold">${statistics.mean.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-600 font-medium">NPV at Risk (5%)</div>
            <div className="text-lg font-semibold">${percentiles.p5.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-semibold text-lg mb-3">Risk Assessment Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Key Findings</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>
                  <strong>Expected Return:</strong> {statistics.mean.roi.toFixed(1)}% ROI with
                  ${statistics.mean.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })} NPV
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>
                  <strong>Success Probability:</strong> {(calculateProbAbove(roiDistribution, 0) * 100).toFixed(0)}% chance of positive ROI
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600">•</span>
                <span>
                  <strong>Downside Risk:</strong> 5% chance ROI falls below {percentiles.p5.roi.toFixed(1)}%
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-600 mb-2">Confidence Intervals</h4>
            <div className="space-y-3">
              <ConfidenceBar
                label="50% CI"
                low={percentiles.p25.roi}
                high={percentiles.p75.roi}
                color="blue"
              />
              <ConfidenceBar
                label="90% CI"
                low={percentiles.p5.roi}
                high={percentiles.p95.roi}
                color="purple"
              />
              <ConfidenceBar
                label="98% CI"
                low={percentiles.p1.roi}
                high={percentiles.p99.roi}
                color="gray"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600'
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function ProbabilityMarker({ label, value }) {
  const percentage = value * 100;
  let color = 'text-gray-600';
  if (percentage > 80) color = 'text-green-600';
  else if (percentage > 50) color = 'text-blue-600';
  else if (percentage > 20) color = 'text-orange-600';
  else color = 'text-red-600';

  return (
    <div className="p-2 bg-gray-50 rounded-lg text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{percentage.toFixed(0)}%</div>
    </div>
  );
}

function ConfidenceBar({ label, low, high, color }) {
  const colors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-400'
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-16 text-gray-500">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <span className="w-16 text-right">{low.toFixed(0)}%</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div className={`h-full ${colors[color]} rounded-full`} style={{ width: '100%' }} />
        </div>
        <span className="w-16">{high.toFixed(0)}%</span>
      </div>
    </div>
  );
}

function createHistogram(data, bins) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;

  const histogram = Array(bins).fill(0).map((_, i) => ({
    binStart: min + i * binWidth,
    binEnd: min + (i + 1) * binWidth,
    count: 0
  }));

  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogram[binIndex].count++;
  });

  return histogram.map(bin => ({
    range: `${bin.binStart.toFixed(0)}-${bin.binEnd.toFixed(0)}`,
    count: bin.count
  }));
}

function createCumulativeDistribution(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const step = Math.max(1, Math.floor(sorted.length / 50));

  return sorted.filter((_, i) => i % step === 0).map((roi, i, arr) => ({
    roi,
    probability: 1 - (i / arr.length)
  }));
}

function calculateProbAbove(data, threshold) {
  return data.filter(v => v > threshold).length / data.length;
}

export default MonteCarloResults;
