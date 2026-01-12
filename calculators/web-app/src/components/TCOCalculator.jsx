import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const TCOCalculator = ({ onTCOCalculated }) => {
  const [initialCosts, setInitialCosts] = useState({
    development_hours: 500,
    hourly_rate: 150,
    consulting: 0,
    infrastructure_setup: 50000,
    cloud_credits: 10000,
    api_integration: 25000,
    data_preparation: 15000,
    training: 20000,
    compliance: 10000,
    platform_license: 0
  });

  const [ongoingCosts, setOngoingCosts] = useState({
    llm_inference: 5000,
    cloud_compute: 3000,
    storage: 500,
    api_subscription: 2000,
    platform_license: 1500,
    monitoring: 500,
    ai_ops_team: 15000,
    human_oversight: 5000,
    maintenance: 2000,
    compliance: 1000
  });

  const [duration, setDuration] = useState(36);
  const [discountRate, setDiscountRate] = useState(10);

  const [tcoResults, setTcoResults] = useState(null);

  const calculateTCO = () => {
    // Calculate initial costs
    const developmentCost = initialCosts.development_hours * initialCosts.hourly_rate + initialCosts.consulting;
    const infrastructureCost = initialCosts.infrastructure_setup + initialCosts.cloud_credits;
    const integrationCost = initialCosts.api_integration + initialCosts.data_preparation;
    const trainingCost = initialCosts.training;
    const complianceCost = initialCosts.compliance;
    const vendorCost = initialCosts.platform_license;

    const totalInitial = developmentCost + infrastructureCost + integrationCost + trainingCost + complianceCost + vendorCost;

    // Calculate ongoing monthly costs
    const computeCost = ongoingCosts.llm_inference + ongoingCosts.cloud_compute + ongoingCosts.storage;
    const platformCost = ongoingCosts.api_subscription + ongoingCosts.platform_license;
    const operationsCost = ongoingCosts.monitoring;
    const hrCost = ongoingCosts.ai_ops_team + ongoingCosts.human_oversight;
    const maintenanceCost = ongoingCosts.maintenance;
    const ongoingComplianceCost = ongoingCosts.compliance;

    const totalMonthly = computeCost + platformCost + operationsCost + hrCost + maintenanceCost + ongoingComplianceCost;
    const totalOngoing = totalMonthly * duration;

    // Estimate hidden costs (20% of ongoing)
    const hiddenMonthly = totalMonthly * 0.20;
    const totalHidden = hiddenMonthly * duration;

    // Calculate NPV
    const monthlyRate = discountRate / 100 / 12;
    let npv = totalInitial;
    for (let month = 1; month <= duration; month++) {
      const monthlyCost = totalMonthly + hiddenMonthly;
      npv += monthlyCost / Math.pow(1 + monthlyRate, month);
    }

    const totalTCO = totalInitial + totalOngoing + totalHidden;

    // Generate monthly breakdown
    const monthlyBreakdown = [];
    let cumulative = totalInitial;
    for (let month = 1; month <= duration; month++) {
      cumulative += totalMonthly + hiddenMonthly;
      monthlyBreakdown.push({
        month,
        ongoing: totalMonthly,
        hidden: hiddenMonthly,
        cumulative
      });
    }

    // Cost by category
    const costByCategory = [
      { name: 'Development & Setup', value: developmentCost + integrationCost },
      { name: 'Infrastructure', value: infrastructureCost + (computeCost * duration) },
      { name: 'Platform & Licensing', value: vendorCost + (platformCost * duration) },
      { name: 'Human Resources', value: (hrCost * duration) + trainingCost },
      { name: 'Compliance & Security', value: complianceCost + (ongoingComplianceCost * duration) },
      { name: 'Maintenance & Ops', value: (maintenanceCost + operationsCost) * duration },
      { name: 'Hidden Costs', value: totalHidden }
    ];

    const results = {
      totalInitial,
      totalOngoing,
      totalHidden,
      totalTCO,
      npvTCO: npv,
      monthlyAverage: (totalOngoing + totalHidden) / duration,
      costByCategory,
      monthlyBreakdown
    };

    setTcoResults(results);

    if (onTCOCalculated) {
      onTCOCalculated(results);
    }
  };

  useEffect(() => {
    calculateTCO();
  }, [initialCosts, ongoingCosts, duration, discountRate]);

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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Total Cost of Ownership Calculator</h2>

        {/* Initial Costs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Initial Investment Costs</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Development Hours</label>
              <input
                type="number"
                value={initialCosts.development_hours}
                onChange={(e) => setInitialCosts({ ...initialCosts, development_hours: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Hourly Rate ($)</label>
              <input
                type="number"
                value={initialCosts.hourly_rate}
                onChange={(e) => setInitialCosts({ ...initialCosts, hourly_rate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Infrastructure Setup ($)</label>
              <input
                type="number"
                value={initialCosts.infrastructure_setup}
                onChange={(e) => setInitialCosts({ ...initialCosts, infrastructure_setup: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">API Integration ($)</label>
              <input
                type="number"
                value={initialCosts.api_integration}
                onChange={(e) => setInitialCosts({ ...initialCosts, api_integration: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Data Preparation ($)</label>
              <input
                type="number"
                value={initialCosts.data_preparation}
                onChange={(e) => setInitialCosts({ ...initialCosts, data_preparation: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Training & Change Mgmt ($)</label>
              <input
                type="number"
                value={initialCosts.training}
                onChange={(e) => setInitialCosts({ ...initialCosts, training: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ongoing Costs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Monthly Operational Costs</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">LLM Inference ($)</label>
              <input
                type="number"
                value={ongoingCosts.llm_inference}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, llm_inference: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Cloud Compute ($)</label>
              <input
                type="number"
                value={ongoingCosts.cloud_compute}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, cloud_compute: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">API Subscription ($)</label>
              <input
                type="number"
                value={ongoingCosts.api_subscription}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, api_subscription: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">AI Ops Team ($)</label>
              <input
                type="number"
                value={ongoingCosts.ai_ops_team}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, ai_ops_team: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Human Oversight ($)</label>
              <input
                type="number"
                value={ongoingCosts.human_oversight}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, human_oversight: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Maintenance ($)</label>
              <input
                type="number"
                value={ongoingCosts.maintenance}
                onChange={(e) => setOngoingCosts({ ...ongoingCosts, maintenance: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Analysis Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Duration (months)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Discount Rate (%)</label>
              <input
                type="number"
                value={discountRate}
                onChange={(e) => setDiscountRate(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {tcoResults && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">TCO Analysis Results</h3>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Total TCO</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(tcoResults.totalTCO)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">NPV TCO</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(tcoResults.npvTCO)}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 font-medium">Initial Investment</p>
              <p className="text-2xl font-bold text-amber-900">{formatCurrency(tcoResults.totalInitial)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Avg Monthly Cost</p>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(tcoResults.monthlyAverage)}</p>
            </div>
          </div>

          {/* Cost Breakdown Pie Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Cost Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={tcoResults.costByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {tcoResults.costByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-600 mb-2">Cost Breakdown</h4>
              <div className="space-y-2">
                {tcoResults.costByCategory.map((cat, index) => (
                  <div key={cat.name} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-gray-600">{cat.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(cat.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hidden Costs Warning */}
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Hidden Costs Estimated:</strong> {formatCurrency(tcoResults.totalHidden)} ({((tcoResults.totalHidden / tcoResults.totalTCO) * 100).toFixed(1)}% of total TCO).
              Hidden costs include data quality remediation, API version updates, technical debt, and incident response.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TCOCalculator;
