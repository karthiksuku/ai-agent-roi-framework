import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, BarChart3, Settings, FileText, GitCompare, TrendingUp, Save, Upload, Download, Trash2, Play, Info } from 'lucide-react';
import { INDUSTRIES, calculateFullResults, runMonteCarloSimulation, runSensitivityAnalysis } from './utils/calculator';
import { saveScenario, getAllScenarios, deleteScenario, exportScenario, importScenario, exportToPDF } from './utils/storage';
import ResultsDashboard from './components/ResultsDashboard';
import TasksInput from './components/TasksInput';
import CostsInput from './components/CostsInput';
import RisksInput from './components/RisksInput';
import AdvancedSettings from './components/AdvancedSettings';
import SensitivityAnalysis from './components/SensitivityAnalysis';
import MonteCarloResults from './components/MonteCarloResults';
import CompareScenarios from './components/CompareScenarios';

const defaultProject = {
  name: 'New AI Agent Project',
  industry: 'retail',
  duration: 24,
  discountRate: 0.10,
  tasks: [
    {
      id: '1',
      name: 'Email Response',
      hoursPerWeek: 40,
      hourlyRate: 28,
      accuracy: 0.92,
      oversightRate: 0.12,
      volumePerWeek: 0,
      errorCost: 0,
      baselineErrorRate: 0
    }
  ],
  costs: {
    initialDevelopment: 50000,
    platformMonthly: 2500,
    apiCostPerCall: 0.01,
    estimatedCallsPerMonth: 100000,
    maintenanceMonthly: 1500,
    trainingInitial: 10000,
    trainingOngoing: 500,
    changeManagement: 15000
  },
  risks: {
    technical: 0.10,
    adoption: 0.15,
    regulatory: 0.08,
    vendor: 0.10
  },
  throughput: {
    enabled: false,
    oldCapacity: 100,
    newCapacity: 200,
    valuePerUnit: 10,
    utilizationRate: 0.80
  },
  latency: {
    enabled: false,
    transactionsPerMonth: 1000,
    oldTimeHours: 4,
    newTimeHours: 0.5,
    valuePerHourSaved: 25,
    sensitivityFactor: 1.0
  },
  optionality: {
    enabled: false,
    processInsights: 50000,
    dataAssets: 30000,
    capabilityOptions: 75000,
    probabilityFactor: 0.50
  },
  maturity: {
    pilot: 3,
    proven: 6,
    scaled: 9,
    learningRate: 0.02
  }
};

function App() {
  const [project, setProject] = useState(defaultProject);
  const [activeTab, setActiveTab] = useState('calculator');
  const [savedScenarios, setSavedScenarios] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [monteCarloResults, setMonteCarloResults] = useState(null);
  const [isRunningMonteCarlo, setIsRunningMonteCarlo] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [scenariosToCompare, setScenariosToCompare] = useState([]);

  useEffect(() => {
    setSavedScenarios(getAllScenarios());
  }, []);

  const results = useMemo(() => {
    return calculateFullResults(project);
  }, [project]);

  const sensitivityResults = useMemo(() => {
    return {
      accuracy: runSensitivityAnalysis(project, 'accuracy'),
      cost: runSensitivityAnalysis(project, 'cost'),
      risk: runSensitivityAnalysis(project, 'risk')
    };
  }, [project]);

  const handleIndustryChange = (industryKey) => {
    const industry = INDUSTRIES[industryKey];
    setProject(prev => ({
      ...prev,
      industry: industryKey,
      risks: { ...industry.risks },
      maturity: { ...industry.maturity },
      tasks: prev.tasks.map(task => ({
        ...task,
        hourlyRate: industry.hourlyRate,
        accuracy: industry.accuracy,
        oversightRate: industry.oversightRate
      }))
    }));
  };

  const handleSave = () => {
    const saved = saveScenario(project);
    setProject(prev => ({ ...prev, id: saved.id }));
    setSavedScenarios(getAllScenarios());
    setShowSaveModal(false);
  };

  const handleLoad = (scenario) => {
    setProject(scenario);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this scenario?')) {
      deleteScenario(id);
      setSavedScenarios(getAllScenarios());
    }
  };

  const handleExport = () => {
    exportScenario(project);
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imported = await importScenario(file);
        setProject(imported);
      } catch (err) {
        alert('Error importing file: ' + err.message);
      }
    }
  };

  const handleExportPDF = () => {
    exportToPDF(results, project.name);
  };

  const runMonteCarlo = () => {
    setIsRunningMonteCarlo(true);
    setTimeout(() => {
      const mcResults = runMonteCarloSimulation(project, 1000);
      setMonteCarloResults(mcResults);
      setIsRunningMonteCarlo(false);
    }, 100);
  };

  const tabs = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'sensitivity', label: 'Sensitivity', icon: TrendingUp },
    { id: 'montecarlo', label: 'Monte Carlo', icon: Play },
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'settings', label: 'Advanced', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-bg text-white py-6 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">A</span>
                </div>
                AURA Framework
              </h1>
              <p className="text-blue-100 mt-1">AI Utility & Return Assessment</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                <Save size={18} />
                Save
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                <Download size={18} />
                Export
              </button>
              <label className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition cursor-pointer">
                <Upload size={18} />
                Import
                <input type="file" accept=".json" onChange={handleImport} className="hidden" />
              </label>
              <button onClick={handleExportPDF} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
                <FileText size={18} />
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Project Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <input
                type="text"
                value={project.name}
                onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold border-none focus:outline-none focus:ring-0 w-full"
                placeholder="Project Name"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Industry</label>
                <select
                  value={project.industry}
                  onChange={(e) => handleIndustryChange(e.target.value)}
                  className="input-field"
                >
                  {Object.entries(INDUSTRIES).map(([key, ind]) => (
                    <option key={key} value={key}>{ind.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Duration (months)</label>
                <input
                  type="number"
                  value={project.duration}
                  onChange={(e) => setProject(prev => ({ ...prev, duration: parseInt(e.target.value) || 24 }))}
                  className="input-field w-24"
                  min="6"
                  max="60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="metric-card">
            <div className="text-sm text-gray-600">Net Present Value</div>
            <div className={`text-2xl font-bold ${results.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${results.npv.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="metric-card">
            <div className="text-sm text-gray-600">ROI</div>
            <div className={`text-2xl font-bold ${results.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {results.roi.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="text-sm text-gray-600">Payback Period</div>
            <div className="text-2xl font-bold text-blue-600">
              {results.payback ? `${results.payback.toFixed(1)} mo` : 'N/A'}
            </div>
          </div>
          <div className="metric-card">
            <div className="text-sm text-gray-600">Monthly Value</div>
            <div className="text-2xl font-bold text-blue-600">
              ${results.valueBreakdown.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-2 gap-6">
            <TasksInput
              tasks={project.tasks}
              onChange={(tasks) => setProject(prev => ({ ...prev, tasks }))}
              industry={INDUSTRIES[project.industry]}
            />
            <CostsInput
              costs={project.costs}
              onChange={(costs) => setProject(prev => ({ ...prev, costs }))}
            />
            <RisksInput
              risks={project.risks}
              onChange={(risks) => setProject(prev => ({ ...prev, risks }))}
            />
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">Saved Scenarios</h3>
              {savedScenarios.length === 0 ? (
                <p className="text-gray-500">No saved scenarios yet. Click "Save" to save your current scenario.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedScenarios.map(scenario => (
                    <div key={scenario.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{scenario.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(scenario.savedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleLoad(scenario)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(scenario.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <ResultsDashboard results={results} projections={results.projections} />
        )}

        {activeTab === 'sensitivity' && (
          <SensitivityAnalysis results={sensitivityResults} baseResults={results} />
        )}

        {activeTab === 'montecarlo' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg">Monte Carlo Simulation</h3>
                <p className="text-gray-500">Run 1,000 simulations with varied parameters to understand outcome distribution</p>
              </div>
              <button
                onClick={runMonteCarlo}
                disabled={isRunningMonteCarlo}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={18} />
                {isRunningMonteCarlo ? 'Running...' : 'Run Simulation'}
              </button>
            </div>
            {monteCarloResults ? (
              <MonteCarloResults results={monteCarloResults} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Play size={48} className="mx-auto mb-4 opacity-50" />
                <p>Click "Run Simulation" to analyze outcome distribution</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compare' && (
          <CompareScenarios
            savedScenarios={savedScenarios}
            currentProject={project}
            currentResults={results}
          />
        )}

        {activeTab === 'settings' && (
          <AdvancedSettings
            project={project}
            onChange={setProject}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>AURA Framework - AI Utility & Return Assessment</p>
          <p className="text-sm mt-2">
            Created by Karthik Sukumar |
            <a href="https://github.com/karthiksuku/ai-agent-roi-framework" className="text-blue-400 hover:text-blue-300 ml-1" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
