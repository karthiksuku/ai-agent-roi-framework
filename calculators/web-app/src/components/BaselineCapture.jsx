import React, { useState } from 'react';

const BaselineCapture = ({ onBaselineCaptured }) => {
  const [baseline, setBaseline] = useState({
    processName: '',
    processDescription: '',
    avgHandlingTime: 15,
    handlingTimeStdDev: 5,
    dailyVolume: 500,
    peakVolume: 750,
    errorRate: 8,
    reworkRate: 5,
    costPerTransaction: 12.50,
    fullyLoadedRate: 75,
    fteCount: 5,
    customerSatisfaction: 3.8,
    dataSources: '',
    assumptions: ''
  });

  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedBaseline, setCapturedBaseline] = useState(null);

  const handleCapture = () => {
    setIsCapturing(true);

    // Simulate capture process
    setTimeout(() => {
      const captured = {
        ...baseline,
        errorRate: baseline.errorRate / 100,
        reworkRate: baseline.reworkRate / 100,
        firstPassYield: 1 - (baseline.errorRate / 100) - (baseline.reworkRate / 100),
        capturedAt: new Date().toISOString(),
        annualCost: baseline.costPerTransaction * baseline.dailyVolume * 250,
        annualVolume: baseline.dailyVolume * 250,
        qualityScore: (1 - (baseline.errorRate / 100) - (baseline.reworkRate / 100)) * 100
      };

      setCapturedBaseline(captured);
      setIsCapturing(false);

      if (onBaselineCaptured) {
        onBaselineCaptured(captured);
      }
    }, 1000);
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
        <h2 className="text-xl font-bold text-gray-900 mb-2">Baseline Capture</h2>
        <p className="text-gray-600 mb-4">
          Capture pre-AI performance metrics to establish a baseline for accurate ROI measurement.
        </p>

        {/* Process Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Process Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Process Name</label>
              <input
                type="text"
                value={baseline.processName}
                onChange={(e) => setBaseline({ ...baseline, processName: e.target.value })}
                placeholder="e.g., Invoice Processing"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Process Description</label>
              <input
                type="text"
                value={baseline.processDescription}
                onChange={(e) => setBaseline({ ...baseline, processDescription: e.target.value })}
                placeholder="Brief description of the process"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Time Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Time Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Avg Handling Time (min)</label>
              <input
                type="number"
                value={baseline.avgHandlingTime}
                onChange={(e) => setBaseline({ ...baseline, avgHandlingTime: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Std Deviation (min)</label>
              <input
                type="number"
                value={baseline.handlingTimeStdDev}
                onChange={(e) => setBaseline({ ...baseline, handlingTimeStdDev: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Daily Volume</label>
              <input
                type="number"
                value={baseline.dailyVolume}
                onChange={(e) => setBaseline({ ...baseline, dailyVolume: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Peak Volume</label>
              <input
                type="number"
                value={baseline.peakVolume}
                onChange={(e) => setBaseline({ ...baseline, peakVolume: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Quality Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Error Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={baseline.errorRate}
                onChange={(e) => setBaseline({ ...baseline, errorRate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Rework Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={baseline.reworkRate}
                onChange={(e) => setBaseline({ ...baseline, reworkRate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Customer Satisfaction (1-5)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={baseline.customerSatisfaction}
                onChange={(e) => setBaseline({ ...baseline, customerSatisfaction: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Cost Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Cost per Transaction ($)</label>
              <input
                type="number"
                step="0.01"
                value={baseline.costPerTransaction}
                onChange={(e) => setBaseline({ ...baseline, costPerTransaction: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Fully Loaded Rate ($/hr)</label>
              <input
                type="number"
                value={baseline.fullyLoadedRate}
                onChange={(e) => setBaseline({ ...baseline, fullyLoadedRate: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">FTE Count</label>
              <input
                type="number"
                step="0.1"
                value={baseline.fteCount}
                onChange={(e) => setBaseline({ ...baseline, fteCount: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Documentation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Data Sources</label>
              <textarea
                value={baseline.dataSources}
                onChange={(e) => setBaseline({ ...baseline, dataSources: e.target.value })}
                placeholder="e.g., ERP system, time tracking software..."
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Assumptions</label>
              <textarea
                value={baseline.assumptions}
                onChange={(e) => setBaseline({ ...baseline, assumptions: e.target.value })}
                placeholder="Key assumptions made in baseline..."
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Capture Button */}
        <button
          onClick={handleCapture}
          disabled={isCapturing || !baseline.processName}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCapturing ? 'Capturing Baseline...' : 'Capture Baseline'}
        </button>
      </div>

      {/* Captured Baseline Summary */}
      {capturedBaseline && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Baseline Summary: {capturedBaseline.processName}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Annual Cost</p>
              <p className="text-xl font-bold text-blue-900">{formatCurrency(capturedBaseline.annualCost)}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Annual Volume</p>
              <p className="text-xl font-bold text-green-900">{capturedBaseline.annualVolume.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 font-medium">First Pass Yield</p>
              <p className="text-xl font-bold text-amber-900">{(capturedBaseline.firstPassYield * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Quality Score</p>
              <p className="text-xl font-bold text-purple-900">{capturedBaseline.qualityScore.toFixed(1)}%</p>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Baseline captured successfully at {new Date(capturedBaseline.capturedAt).toLocaleString()}.
              Use this baseline to measure post-implementation improvements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaselineCapture;
