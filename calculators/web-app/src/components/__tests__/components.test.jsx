import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock Recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  Area: () => null,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  RadarChart: ({ children }) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  Cell: () => null
}));

// Mock storage
vi.mock('../../utils/storage', () => ({
  getSavedScenarios: vi.fn(() => []),
  getAllScenarios: vi.fn(() => []),
  deleteScenario: vi.fn(),
  saveScenario: vi.fn(),
  exportScenario: vi.fn(),
  exportToPDF: vi.fn()
}));

import TasksInput from '../TasksInput';
import CostsInput from '../CostsInput';
import RisksInput from '../RisksInput';
import ResultsDashboard from '../ResultsDashboard';
import AdvancedSettings from '../AdvancedSettings';
import SensitivityAnalysis from '../SensitivityAnalysis';
import MonteCarloResults from '../MonteCarloResults';
import CompareScenarios from '../CompareScenarios';

describe('Component Render Tests', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TasksInput', () => {
    const defaultIndustry = {
      name: 'Technology',
      hourlyRate: 75,
      accuracy: 0.92,
      oversightRate: 0.10
    };

    const defaultTasks = [{
      id: '1',
      name: 'Test Task',
      hoursPerWeek: 40,
      hourlyRate: 50,
      accuracy: 0.9,
      oversightRate: 0.1
    }];

    it('renders without crashing', () => {
      const { container } = render(
        <TasksInput tasks={defaultTasks} onChange={mockOnChange} industry={defaultIndustry} />
      );
      expect(container).toBeTruthy();
    });

    it('displays task name', () => {
      render(<TasksInput tasks={defaultTasks} onChange={mockOnChange} industry={defaultIndustry} />);
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    });

    it('shows add button', () => {
      render(<TasksInput tasks={defaultTasks} onChange={mockOnChange} industry={defaultIndustry} />);
      expect(screen.getByText(/add task/i)).toBeInTheDocument();
    });
  });

  describe('CostsInput', () => {
    const defaultCosts = {
      initialDevelopment: 50000,
      trainingInitial: 5000,
      changeManagement: 3000,
      platformMonthly: 2000,
      apiCostPerCall: 0.01,
      estimatedCallsPerMonth: 10000,
      maintenanceMonthly: 500,
      trainingOngoing: 200
    };

    it('renders without crashing', () => {
      const { container } = render(
        <CostsInput costs={defaultCosts} onChange={mockOnChange} />
      );
      expect(container).toBeTruthy();
    });

    it('displays cost values', () => {
      render(<CostsInput costs={defaultCosts} onChange={mockOnChange} />);
      expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
    });
  });

  describe('RisksInput', () => {
    const defaultRisks = {
      technical: 0.15,
      adoption: 0.20,
      regulatory: 0.10,
      vendor: 0.10
    };

    it('renders without crashing', () => {
      const { container } = render(
        <RisksInput risks={defaultRisks} onChange={mockOnChange} />
      );
      expect(container).toBeTruthy();
    });

    it('renders sliders', () => {
      render(<RisksInput risks={defaultRisks} onChange={mockOnChange} />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders.length).toBe(4);
    });
  });

  describe('ResultsDashboard', () => {
    const sampleProjections = [
      { month: 1, stage: 'Pilot', multiplier: 0.3, grossValue: 3000, riskAdjustedValue: 2550, cost: 55000, netValue: -52450, cumulativeNet: -52450 },
      { month: 2, stage: 'Pilot', multiplier: 0.3, grossValue: 3000, riskAdjustedValue: 2550, cost: 5000, netValue: -2450, cumulativeNet: -54900 }
    ];

    const sampleResults = {
      roi: 125.5,
      npv: 150000,
      payback: 14.5,
      irr: 45.2,
      totalGross: 300000,
      totalRiskAdjusted: 255000,
      totalCost: 105000,
      compositeRisk: 0.15,
      riskAdjustment: 0.85,
      valueBreakdown: {
        dla: 8000,
        ta: 2000,
        dqp: 1500,
        lv: 1000,
        olv: 500,
        total: 13000
      }
    };

    it('renders without crashing', () => {
      const { container } = render(
        <ResultsDashboard results={sampleResults} projections={sampleProjections} />
      );
      expect(container).toBeTruthy();
    });

    it('renders charts', () => {
      render(<ResultsDashboard results={sampleResults} projections={sampleProjections} />);
      expect(screen.getAllByTestId('responsive-container').length).toBeGreaterThan(0);
    });
  });

  describe('AdvancedSettings', () => {
    const defaultProject = {
      throughput: { enabled: false, oldCapacity: 100, newCapacity: 150, valuePerUnit: 50, utilizationRate: 0.8 },
      latency: { enabled: false, oldTimeHours: 48, newTimeHours: 8, transactionsPerMonth: 100, valuePerHourSaved: 25, sensitivityFactor: 0.8 },
      optionality: { enabled: false, processInsights: 50000, dataAssets: 25000, capabilityOptions: 25000, probabilityFactor: 0.5 },
      maturity: { pilot: 3, proven: 6, scaled: 6, learningRate: 0.02 }
    };

    it('renders without crashing', () => {
      const { container } = render(
        <AdvancedSettings project={defaultProject} onChange={mockOnChange} />
      );
      expect(container).toBeTruthy();
    });

    it('renders toggle switches', () => {
      render(<AdvancedSettings project={defaultProject} onChange={mockOnChange} />);
      const toggles = screen.getAllByRole('checkbox');
      expect(toggles.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('SensitivityAnalysis', () => {
    const sampleResults = {
      accuracy: [
        { multiplier: 0.7, roi: 50, npv: 50000, payback: 18 },
        { multiplier: 1.0, roi: 125, npv: 125000, payback: 10 },
        { multiplier: 1.3, roi: 200, npv: 200000, payback: 5 }
      ],
      cost: [
        { multiplier: 0.7, roi: 175, npv: 175000, payback: 6 },
        { multiplier: 1.0, roi: 125, npv: 125000, payback: 10 },
        { multiplier: 1.3, roi: 80, npv: 80000, payback: 16 }
      ],
      risk: [
        { multiplier: 0.7, roi: 160, npv: 160000, payback: 8 },
        { multiplier: 1.0, roi: 125, npv: 125000, payback: 10 },
        { multiplier: 1.3, roi: 85, npv: 85000, payback: 14 }
      ]
    };

    const baseResults = { roi: 125, npv: 125000, payback: 10 };

    it('renders without crashing', () => {
      const { container } = render(
        <SensitivityAnalysis results={sampleResults} baseResults={baseResults} />
      );
      expect(container).toBeTruthy();
    });

    it('renders tornado chart', () => {
      render(<SensitivityAnalysis results={sampleResults} baseResults={baseResults} />);
      expect(screen.getByText(/tornado/i)).toBeInTheDocument();
    });
  });

  describe('MonteCarloResults', () => {
    const sampleResults = {
      roiDistribution: Array.from({ length: 100 }, () => 100 + Math.random() * 50),
      npvDistribution: Array.from({ length: 100 }, () => 100000 + Math.random() * 100000),
      statistics: {
        mean: { roi: 125, npv: 150000 },
        stdDev: { roi: 28.5, npv: 45000 },
        median: { roi: 122, npv: 148000 }
      },
      percentiles: {
        p1: { roi: 45, npv: 30000 },
        p5: { roi: 65, npv: 55000 },
        p25: { roi: 100, npv: 110000 },
        p75: { roi: 150, npv: 190000 },
        p95: { roi: 185, npv: 245000 },
        p99: { roi: 205, npv: 270000 }
      }
    };

    it('renders without crashing', () => {
      const { container } = render(
        <MonteCarloResults results={sampleResults} />
      );
      expect(container).toBeTruthy();
    });

    it('renders distribution chart', () => {
      render(<MonteCarloResults results={sampleResults} />);
      // Multiple distribution sections may exist
      expect(screen.getAllByText(/distribution/i).length).toBeGreaterThan(0);
    });
  });

  describe('CompareScenarios', () => {
    const currentScenario = { name: 'Current', tasks: [] };
    const currentResults = {
      roi: 125,
      npv: 150000,
      paybackMonths: 12,
      totalBenefits: 250000,
      totalCosts: 100000,
      riskAdjustedBenefits: 212500
    };

    it('renders without crashing', () => {
      const { container } = render(
        <CompareScenarios currentScenario={currentScenario} currentResults={currentResults} />
      );
      expect(container).toBeTruthy();
    });

    it('shows comparison section', () => {
      render(<CompareScenarios currentScenario={currentScenario} currentResults={currentResults} />);
      // Multiple elements match, use getAllByText
      expect(screen.getAllByText(/compare|select/i).length).toBeGreaterThan(0);
    });
  });
});
