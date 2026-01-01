import React from 'react';
import { DollarSign, Info } from 'lucide-react';

function CostsInput({ costs, onChange }) {
  const updateCost = (field, value) => {
    onChange({ ...costs, [field]: parseFloat(value) || 0 });
  };

  const totalInitial = costs.initialDevelopment + costs.trainingInitial + costs.changeManagement;
  const totalMonthly = costs.platformMonthly +
    (costs.apiCostPerCall * costs.estimatedCallsPerMonth) +
    costs.maintenanceMonthly +
    costs.trainingOngoing;

  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <DollarSign size={20} className="text-green-600" />
        Cost Structure
      </h3>

      <div className="space-y-4">
        {/* Initial Costs */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Initial Costs (One-time)</h4>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Development & Integration ($)</label>
              <input
                type="number"
                value={costs.initialDevelopment}
                onChange={(e) => updateCost('initialDevelopment', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Initial Training ($)</label>
              <input
                type="number"
                value={costs.trainingInitial}
                onChange={(e) => updateCost('trainingInitial', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Change Management ($)</label>
              <input
                type="number"
                value={costs.changeManagement}
                onChange={(e) => updateCost('changeManagement', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded text-right">
            <span className="text-sm text-gray-600">Total Initial: </span>
            <span className="font-semibold">${totalInitial.toLocaleString()}</span>
          </div>
        </div>

        {/* Monthly Costs */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Monthly Costs (Recurring)</h4>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Platform / Infrastructure ($)</label>
              <input
                type="number"
                value={costs.platformMonthly}
                onChange={(e) => updateCost('platformMonthly', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">API Cost per Call ($)</label>
                <input
                  type="number"
                  value={costs.apiCostPerCall}
                  onChange={(e) => updateCost('apiCostPerCall', e.target.value)}
                  className="input-field"
                  min="0"
                  step="0.001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Est. Calls/Month</label>
                <input
                  type="number"
                  value={costs.estimatedCallsPerMonth}
                  onChange={(e) => updateCost('estimatedCallsPerMonth', e.target.value)}
                  className="input-field"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Maintenance & Support ($)</label>
              <input
                type="number"
                value={costs.maintenanceMonthly}
                onChange={(e) => updateCost('maintenanceMonthly', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ongoing Training ($)</label>
              <input
                type="number"
                value={costs.trainingOngoing}
                onChange={(e) => updateCost('trainingOngoing', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded text-right">
            <span className="text-sm text-gray-600">Total Monthly: </span>
            <span className="font-semibold">${totalMonthly.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2">
        <Info size={18} className="text-green-600 mt-0.5" />
        <div className="text-sm text-green-800">
          <strong>API Cost Tip:</strong> Common rates are $0.01-0.03 per call for GPT-4, $0.001 for GPT-3.5
        </div>
      </div>
    </div>
  );
}

export default CostsInput;
