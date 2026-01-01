import React from 'react';
import { Settings, Zap, Clock, Lightbulb, TrendingUp } from 'lucide-react';

function AdvancedSettings({ project, onChange }) {
  const updateThroughput = (field, value) => {
    onChange({
      ...project,
      throughput: { ...project.throughput, [field]: parseFloat(value) || 0 }
    });
  };

  const updateLatency = (field, value) => {
    onChange({
      ...project,
      latency: { ...project.latency, [field]: parseFloat(value) || 0 }
    });
  };

  const updateOptionality = (field, value) => {
    onChange({
      ...project,
      optionality: { ...project.optionality, [field]: parseFloat(value) || 0 }
    });
  };

  const updateMaturity = (field, value) => {
    onChange({
      ...project,
      maturity: { ...project.maturity, [field]: parseFloat(value) || 0 }
    });
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Throughput Amplification */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Zap size={20} className="text-green-600" />
            Throughput Amplification (TA)
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={project.throughput.enabled}
              onChange={(e) => onChange({
                ...project,
                throughput: { ...project.throughput, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Enable</span>
          </label>
        </div>

        <div className={`space-y-3 ${!project.throughput.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Old Capacity</label>
              <input
                type="number"
                value={project.throughput.oldCapacity}
                onChange={(e) => updateThroughput('oldCapacity', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Capacity</label>
              <input
                type="number"
                value={project.throughput.newCapacity}
                onChange={(e) => updateThroughput('newCapacity', e.target.value)}
                className="input-field"
                min="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Value per Unit ($)</label>
            <input
              type="number"
              value={project.throughput.valuePerUnit}
              onChange={(e) => updateThroughput('valuePerUnit', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Utilization Rate (%)</label>
            <input
              type="number"
              value={Math.round(project.throughput.utilizationRate * 100)}
              onChange={(e) => updateThroughput('utilizationRate', (parseFloat(e.target.value) || 0) / 100)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-800">
          <strong>Formula:</strong> (New - Old) × Value × Utilization
        </div>
      </div>

      {/* Latency Value */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Clock size={20} className="text-purple-600" />
            Latency Value (LV)
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={project.latency.enabled}
              onChange={(e) => onChange({
                ...project,
                latency: { ...project.latency, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Enable</span>
          </label>
        </div>

        <div className={`space-y-3 ${!project.latency.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Transactions/Month</label>
            <input
              type="number"
              value={project.latency.transactionsPerMonth}
              onChange={(e) => updateLatency('transactionsPerMonth', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Old Time (hours)</label>
              <input
                type="number"
                value={project.latency.oldTimeHours}
                onChange={(e) => updateLatency('oldTimeHours', e.target.value)}
                className="input-field"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">New Time (hours)</label>
              <input
                type="number"
                value={project.latency.newTimeHours}
                onChange={(e) => updateLatency('newTimeHours', e.target.value)}
                className="input-field"
                min="0"
                step="0.1"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Value per Hour Saved ($)</label>
            <input
              type="number"
              value={project.latency.valuePerHourSaved}
              onChange={(e) => updateLatency('valuePerHourSaved', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Sensitivity Factor</label>
            <input
              type="number"
              value={project.latency.sensitivityFactor}
              onChange={(e) => updateLatency('sensitivityFactor', e.target.value)}
              className="input-field"
              min="0.5"
              max="3"
              step="0.1"
            />
          </div>
        </div>

        <div className="mt-3 p-2 bg-purple-50 rounded text-sm text-purple-800">
          <strong>Formula:</strong> Transactions × Time Saved × Value × Sensitivity
        </div>
      </div>

      {/* Optionality & Learning */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Lightbulb size={20} className="text-orange-600" />
            Optionality & Learning (OLV)
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={project.optionality.enabled}
              onChange={(e) => onChange({
                ...project,
                optionality: { ...project.optionality, enabled: e.target.checked }
              })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Enable</span>
          </label>
        </div>

        <div className={`space-y-3 ${!project.optionality.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Process Insights Value ($/year)</label>
            <input
              type="number"
              value={project.optionality.processInsights}
              onChange={(e) => updateOptionality('processInsights', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Data Assets Value ($/year)</label>
            <input
              type="number"
              value={project.optionality.dataAssets}
              onChange={(e) => updateOptionality('dataAssets', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Capability Options Value ($/year)</label>
            <input
              type="number"
              value={project.optionality.capabilityOptions}
              onChange={(e) => updateOptionality('capabilityOptions', e.target.value)}
              className="input-field"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Probability Factor (%)</label>
            <input
              type="number"
              value={Math.round(project.optionality.probabilityFactor * 100)}
              onChange={(e) => updateOptionality('probabilityFactor', (parseFloat(e.target.value) || 0) / 100)}
              className="input-field"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="mt-3 p-2 bg-orange-50 rounded text-sm text-orange-800">
          <strong>Formula:</strong> (Insights + Data + Options) / 12 × Probability
        </div>
      </div>

      {/* Maturity Model */}
      <div className="card">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-blue-600" />
          Maturity Model Configuration
        </h3>

        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pilot (months)</label>
              <input
                type="number"
                value={project.maturity.pilot}
                onChange={(e) => updateMaturity('pilot', e.target.value)}
                className="input-field"
                min="1"
                max="12"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Proven (months)</label>
              <input
                type="number"
                value={project.maturity.proven}
                onChange={(e) => updateMaturity('proven', e.target.value)}
                className="input-field"
                min="1"
                max="12"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Scaled (months)</label>
              <input
                type="number"
                value={project.maturity.scaled}
                onChange={(e) => updateMaturity('scaled', e.target.value)}
                className="input-field"
                min="1"
                max="18"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Learning Rate (%/month)</label>
            <input
              type="number"
              value={(project.maturity.learningRate * 100).toFixed(1)}
              onChange={(e) => updateMaturity('learningRate', (parseFloat(e.target.value) || 0) / 100)}
              className="input-field"
              min="0"
              max="10"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Discount Rate (%/year)</label>
            <input
              type="number"
              value={(project.discountRate * 100).toFixed(0)}
              onChange={(e) => onChange({ ...project, discountRate: (parseFloat(e.target.value) || 0) / 100 })}
              className="input-field"
              min="0"
              max="30"
            />
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Maturity Multipliers:</strong>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <div className="text-center p-2 bg-yellow-100 rounded">
                <div className="font-semibold">Pilot</div>
                <div>0.3×</div>
              </div>
              <div className="text-center p-2 bg-green-100 rounded">
                <div className="font-semibold">Proven</div>
                <div>0.7×</div>
              </div>
              <div className="text-center p-2 bg-blue-100 rounded">
                <div className="font-semibold">Scaled</div>
                <div>1.0×</div>
              </div>
              <div className="text-center p-2 bg-purple-100 rounded">
                <div className="font-semibold">Optimized</div>
                <div>1.3-1.8×</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSettings;
