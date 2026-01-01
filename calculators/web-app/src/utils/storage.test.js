import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  saveScenario,
  getAllScenarios,
  getSavedScenarios,
  getScenario,
  deleteScenario,
  exportScenario,
  importScenario,
  exportToPDF
} from './storage';

describe('getAllScenarios / getSavedScenarios', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  it('should return empty array when no data in localStorage', () => {
    localStorage.getItem.mockReturnValue(null);
    expect(getAllScenarios()).toEqual([]);
  });

  it('should return parsed scenarios from localStorage', () => {
    const mockScenarios = [
      { id: '1', name: 'Scenario 1' },
      { id: '2', name: 'Scenario 2' }
    ];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockScenarios));

    const result = getAllScenarios();
    expect(result).toEqual(mockScenarios);
    expect(localStorage.getItem).toHaveBeenCalledWith('aura_scenarios');
  });

  it('should return empty array on parse error', () => {
    localStorage.getItem.mockReturnValue('invalid json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = getAllScenarios();
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('getSavedScenarios should be alias for getAllScenarios', () => {
    localStorage.getItem.mockReturnValue(null);
    expect(getSavedScenarios()).toEqual([]);
  });
});

describe('saveScenario', () => {
  beforeEach(() => {
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
  });

  it('should save new scenario with generated id', () => {
    localStorage.getItem.mockReturnValue('[]');

    const scenario = { name: 'Test Scenario', data: { value: 123 } };
    const result = saveScenario(scenario);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('savedAt');
    expect(result.name).toBe('Test Scenario');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'aura_scenarios',
      expect.any(String)
    );
  });

  it('should update existing scenario with same id', () => {
    const existingScenarios = [{ id: 'existing-id', name: 'Old Name' }];
    localStorage.getItem.mockReturnValue(JSON.stringify(existingScenarios));

    const updatedScenario = { id: 'existing-id', name: 'New Name' };
    saveScenario(updatedScenario);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(1);
    expect(savedData[0].name).toBe('New Name');
  });

  it('should append new scenario to existing list', () => {
    const existingScenarios = [{ id: '1', name: 'Existing' }];
    localStorage.getItem.mockReturnValue(JSON.stringify(existingScenarios));

    const newScenario = { name: 'New Scenario' };
    saveScenario(newScenario);

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(2);
  });
});

describe('getScenario', () => {
  it('should return scenario by id', () => {
    const mockScenarios = [
      { id: '1', name: 'Scenario 1' },
      { id: '2', name: 'Scenario 2' }
    ];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockScenarios));

    const result = getScenario('2');
    expect(result).toEqual({ id: '2', name: 'Scenario 2' });
  });

  it('should return undefined for non-existent id', () => {
    const mockScenarios = [{ id: '1', name: 'Scenario 1' }];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockScenarios));

    const result = getScenario('999');
    expect(result).toBeUndefined();
  });
});

describe('deleteScenario', () => {
  it('should remove scenario by id', () => {
    const mockScenarios = [
      { id: '1', name: 'Keep' },
      { id: '2', name: 'Delete' },
      { id: '3', name: 'Keep' }
    ];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockScenarios));

    deleteScenario('2');

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(2);
    expect(savedData.find(s => s.id === '2')).toBeUndefined();
  });

  it('should handle deleting non-existent scenario', () => {
    const mockScenarios = [{ id: '1', name: 'Keep' }];
    localStorage.getItem.mockReturnValue(JSON.stringify(mockScenarios));

    deleteScenario('999');

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(1);
  });
});

describe('exportScenario', () => {
  it('should create download link with JSON data', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const mockLink = {
      href: '',
      download: '',
      click: vi.fn()
    };
    createElementSpy.mockReturnValue(mockLink);

    const scenario = { name: 'Test', value: 123 };
    exportScenario(scenario);

    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.download).toContain('aura-scenario-Test.json');
    expect(mockLink.click).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it('should use "export" as default name when no name provided', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const mockLink = { href: '', download: '', click: vi.fn() };
    createElementSpy.mockReturnValue(mockLink);

    exportScenario({ value: 123 });

    expect(mockLink.download).toContain('aura-scenario-export.json');

    createElementSpy.mockRestore();
  });
});

describe('importScenario', () => {
  it('should parse valid JSON file', async () => {
    const scenarioData = { name: 'Imported', value: 456 };
    const file = new Blob([JSON.stringify(scenarioData)], { type: 'application/json' });

    const result = await importScenario(file);
    expect(result).toEqual(scenarioData);
  });

  it('should reject invalid JSON', async () => {
    const file = new Blob(['not valid json'], { type: 'application/json' });

    await expect(importScenario(file)).rejects.toThrow('Invalid JSON file');
  });
});

describe('exportToPDF', () => {
  it('should open print window with formatted content', () => {
    const results = {
      npv: 150000,
      roi: 125.5,
      payback: 14.5,
      totalRiskAdjusted: 200000,
      valueBreakdown: {
        dla: 5000,
        ta: 2000,
        dqp: 1500,
        lv: 1000,
        olv: 500,
        total: 10000
      },
      compositeRisk: 0.15,
      riskAdjustment: 0.85
    };

    exportToPDF(results, 'Test Project');

    expect(window.open).toHaveBeenCalledWith('', '_blank');

    const mockWindow = window.open.mock.results[0].value;
    expect(mockWindow.document.write).toHaveBeenCalled();
    expect(mockWindow.document.close).toHaveBeenCalled();
    expect(mockWindow.print).toHaveBeenCalled();

    const htmlContent = mockWindow.document.write.mock.calls[0][0];
    expect(htmlContent).toContain('Test Project');
    expect(htmlContent).toContain('AURA ROI Analysis Report');
    expect(htmlContent).toContain('$150,000');
    expect(htmlContent).toContain('125.5%');
  });

  it('should handle N/A payback period', () => {
    const results = {
      npv: -10000,
      roi: -25,
      payback: null,
      totalRiskAdjusted: 50000,
      valueBreakdown: {
        dla: 1000,
        ta: 0,
        dqp: 0,
        lv: 0,
        olv: 0,
        total: 1000
      },
      compositeRisk: 0.30,
      riskAdjustment: 0.70
    };

    exportToPDF(results, 'Unprofitable Project');

    const mockWindow = window.open.mock.results[0].value;
    const htmlContent = mockWindow.document.write.mock.calls[0][0];
    expect(htmlContent).toContain('N/A');
  });
});
