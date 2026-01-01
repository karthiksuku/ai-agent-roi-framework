import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';

function TasksInput({ tasks, onChange, industry }) {
  const addTask = () => {
    const newTask = {
      id: Date.now().toString(),
      name: 'New Task',
      hoursPerWeek: 40,
      hourlyRate: industry.hourlyRate,
      accuracy: industry.accuracy,
      oversightRate: industry.oversightRate,
      volumePerWeek: 0,
      errorCost: 0,
      baselineErrorRate: 0
    };
    onChange([...tasks, newTask]);
  };

  const updateTask = (id, field, value) => {
    onChange(tasks.map(task =>
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const removeTask = (id) => {
    if (tasks.length > 1) {
      onChange(tasks.filter(task => task.id !== id));
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Tasks (Direct Labour Arbitrage)</h3>
        <button onClick={addTask} className="btn-primary flex items-center gap-1 text-sm">
          <Plus size={16} />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={task.name}
                onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                className="font-medium border-none bg-transparent focus:outline-none focus:ring-0 text-lg"
                placeholder="Task Name"
              />
              {tasks.length > 1 && (
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hours/Week</label>
                <input
                  type="number"
                  value={task.hoursPerWeek}
                  onChange={(e) => updateTask(task.id, 'hoursPerWeek', parseFloat(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                  max="168"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={task.hourlyRate}
                  onChange={(e) => updateTask(task.id, 'hourlyRate', parseFloat(e.target.value) || 0)}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">AI Accuracy (%)</label>
                <input
                  type="number"
                  value={Math.round(task.accuracy * 100)}
                  onChange={(e) => updateTask(task.id, 'accuracy', (parseFloat(e.target.value) || 0) / 100)}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Oversight Rate (%)</label>
                <input
                  type="number"
                  value={Math.round(task.oversightRate * 100)}
                  onChange={(e) => updateTask(task.id, 'oversightRate', (parseFloat(e.target.value) || 0) / 100)}
                  className="input-field"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* DQP Fields (expandable) */}
            <details className="mt-3">
              <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                + Decision Quality Premium (optional)
              </summary>
              <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Volume/Week</label>
                  <input
                    type="number"
                    value={task.volumePerWeek || 0}
                    onChange={(e) => updateTask(task.id, 'volumePerWeek', parseInt(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Error Cost ($)</label>
                  <input
                    type="number"
                    value={task.errorCost || 0}
                    onChange={(e) => updateTask(task.id, 'errorCost', parseFloat(e.target.value) || 0)}
                    className="input-field"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Baseline Error (%)</label>
                  <input
                    type="number"
                    value={Math.round((task.baselineErrorRate || 0) * 100)}
                    onChange={(e) => updateTask(task.id, 'baselineErrorRate', (parseFloat(e.target.value) || 0) / 100)}
                    className="input-field"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
        <Info size={18} className="text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <strong>DLA Formula:</strong> Hours × Rate × Accuracy × (1 - Oversight)
          <br />
          <strong>DQP Formula:</strong> Volume × (Baseline Error - AI Error) × Error Cost
        </div>
      </div>
    </div>
  );
}

export default TasksInput;
