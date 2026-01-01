import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

function RisksInput({ risks, onChange }) {
  const updateRisk = (field, value) => {
    onChange({ ...risks, [field]: (parseFloat(value) || 0) / 100 });
  };

  const weights = { technical: 0.35, adoption: 0.35, regulatory: 0.15, vendor: 0.15 };
  const compositeRisk = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (risks[key] || 0) * weight;
  }, 0);

  const riskLabels = {
    technical: {
      name: 'Technical Risk',
      description: 'Model degradation, hallucinations, integration failures',
      color: 'blue'
    },
    adoption: {
      name: 'Adoption Risk',
      description: 'User resistance, training gaps, change management',
      color: 'purple'
    },
    regulatory: {
      name: 'Regulatory Risk',
      description: 'Compliance changes, explainability requirements',
      color: 'orange'
    },
    vendor: {
      name: 'Vendor Risk',
      description: 'Platform changes, pricing shifts, API deprecation',
      color: 'gray'
    }
  };

  const getRiskColor = (value) => {
    if (value < 0.10) return 'text-green-600';
    if (value < 0.20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <AlertTriangle size={20} className="text-orange-500" />
        Risk Assessment
      </h3>

      <div className="space-y-4">
        {Object.entries(riskLabels).map(([key, info]) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">{info.name}</label>
              <span className={`text-sm font-semibold ${getRiskColor(risks[key])}`}>
                {Math.round(risks[key] * 100)}%
              </span>
            </div>
            <input
              type="range"
              value={Math.round(risks[key] * 100)}
              onChange={(e) => updateRisk(key, e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              min="0"
              max="50"
            />
            <p className="text-xs text-gray-500 mt-1">{info.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Composite Risk Score</span>
          <span className={`text-xl font-bold ${getRiskColor(compositeRisk)}`}>
            {(compositeRisk * 100).toFixed(1)}%
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <span>Risk Adjustment Factor</span>
          <span className="font-semibold text-green-600">
            {((1 - compositeRisk) * 100).toFixed(1)}%
          </span>
        </div>
        <div className="mt-3 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              compositeRisk < 0.10 ? 'bg-green-500' :
              compositeRisk < 0.20 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${compositeRisk * 100 * 2}%` }}
          />
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-start gap-2">
        <Info size={18} className="text-orange-600 mt-0.5" />
        <div className="text-sm text-orange-800">
          <strong>Weighting:</strong> Technical (35%), Adoption (35%), Regulatory (15%), Vendor (15%)
        </div>
      </div>
    </div>
  );
}

export default RisksInput;
