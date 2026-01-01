// Local Storage utilities for saving/loading scenarios

const STORAGE_KEY = 'aura_scenarios';

export function saveScenario(scenario) {
  const scenarios = getAllScenarios();
  const id = scenario.id || Date.now().toString();
  const savedScenario = {
    ...scenario,
    id,
    savedAt: new Date().toISOString()
  };

  const existingIndex = scenarios.findIndex(s => s.id === id);
  if (existingIndex >= 0) {
    scenarios[existingIndex] = savedScenario;
  } else {
    scenarios.push(savedScenario);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  return savedScenario;
}

export function getAllScenarios() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading scenarios:', e);
    return [];
  }
}

// Alias for compatibility
export const getSavedScenarios = getAllScenarios;

export function getScenario(id) {
  const scenarios = getAllScenarios();
  return scenarios.find(s => s.id === id);
}

export function deleteScenario(id) {
  const scenarios = getAllScenarios();
  const filtered = scenarios.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function exportScenario(scenario) {
  const dataStr = JSON.stringify(scenario, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `aura-scenario-${scenario.name || 'export'}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function importScenario(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const scenario = JSON.parse(e.target.result);
        resolve(scenario);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}

export function exportToPDF(results, projectName) {
  // Create a printable HTML version
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AURA ROI Report - ${projectName}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #1e40af; }
        h2 { color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f1f5f9; }
        .metric { font-size: 24px; font-weight: bold; color: #16a34a; }
        .summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .summary-card { background: #f8fafc; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #64748b; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>AURA ROI Analysis Report</h1>
      <h2>${projectName}</h2>
      <p>Generated: ${new Date().toLocaleDateString()}</p>

      <h2>Executive Summary</h2>
      <div class="summary-grid">
        <div class="summary-card">
          <div>Net Present Value</div>
          <div class="metric">$${results.npv.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
        <div class="summary-card">
          <div>ROI</div>
          <div class="metric">${results.roi.toFixed(1)}%</div>
        </div>
        <div class="summary-card">
          <div>Payback Period</div>
          <div class="metric">${results.payback ? results.payback.toFixed(1) + ' months' : 'N/A'}</div>
        </div>
        <div class="summary-card">
          <div>Risk-Adjusted Value</div>
          <div class="metric">$${results.totalRiskAdjusted.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
        </div>
      </div>

      <h2>Value Breakdown (Monthly)</h2>
      <table>
        <tr><th>Dimension</th><th>Value</th><th>% of Total</th></tr>
        <tr><td>Direct Labour Arbitrage</td><td>$${results.valueBreakdown.dla.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>${((results.valueBreakdown.dla / results.valueBreakdown.total) * 100).toFixed(1)}%</td></tr>
        <tr><td>Throughput Amplification</td><td>$${results.valueBreakdown.ta.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>${((results.valueBreakdown.ta / results.valueBreakdown.total) * 100).toFixed(1)}%</td></tr>
        <tr><td>Decision Quality Premium</td><td>$${results.valueBreakdown.dqp.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>${((results.valueBreakdown.dqp / results.valueBreakdown.total) * 100).toFixed(1)}%</td></tr>
        <tr><td>Latency Value</td><td>$${results.valueBreakdown.lv.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>${((results.valueBreakdown.lv / results.valueBreakdown.total) * 100).toFixed(1)}%</td></tr>
        <tr><td>Optionality & Learning</td><td>$${results.valueBreakdown.olv.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>${((results.valueBreakdown.olv / results.valueBreakdown.total) * 100).toFixed(1)}%</td></tr>
        <tr style="font-weight: bold;"><td>Total</td><td>$${results.valueBreakdown.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</td><td>100%</td></tr>
      </table>

      <h2>Risk Profile</h2>
      <table>
        <tr><th>Risk Category</th><th>Score</th></tr>
        <tr><td>Technical Risk</td><td>${(results.compositeRisk * 100).toFixed(1)}%</td></tr>
        <tr><td>Risk Adjustment Factor</td><td>${(results.riskAdjustment * 100).toFixed(1)}%</td></tr>
      </table>

      <div class="footer">
        <p>Generated by AURA Framework - AI Utility & Return Assessment</p>
        <p>https://github.com/karthiksuku/ai-agent-roi-framework</p>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}
