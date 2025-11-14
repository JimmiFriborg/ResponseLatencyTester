import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, Plus, Trash2, Copy, Check, X, AlertCircle, FileText, BarChart3, Settings, Save, FolderOpen, Eye, EyeOff, ChevronDown, ChevronUp, HardDrive, Cloud } from 'lucide-react';

const LatencyTester = () => {
  // State Management with localStorage persistence
  const [testCases, setTestCases] = useState([]);
  const [activeTestCase, setActiveTestCase] = useState(null);
  const [activeExecution, setActiveExecution] = useState(null);
  const [view, setView] = useState('execution'); // execution, comparison, settings
  const [comparisonSets, setComparisonSets] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [autoSave, setAutoSave] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const fileInputRef = useRef(null);

  // Check if localStorage is available
  const checkStorageAvailable = () => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Local Storage Keys
  const STORAGE_KEYS = {
    testCases: 'latencyTester_testCases',
    activeTestCase: 'latencyTester_activeTestCase',
    activeExecution: 'latencyTester_activeExecution',
    comparisonSets: 'latencyTester_comparisonSets',
    view: 'latencyTester_view',
    autoSave: 'latencyTester_autoSave'
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const isStorageAvailable = checkStorageAvailable();
    setStorageAvailable(isStorageAvailable);
    
    const loadFromStorage = () => {
      if (!isStorageAvailable) {
        // Initialize with default if no storage
        const defaultTestCase = createNewTestCase();
        setTestCases([defaultTestCase]);
        setActiveTestCase(defaultTestCase.id);
        setActiveExecution(defaultTestCase.executions[0].id);
        setDataLoaded(true);
        return;
      }
      
      try {
        // Load saved data
        const savedTestCases = localStorage.getItem(STORAGE_KEYS.testCases);
        const savedActiveTestCase = localStorage.getItem(STORAGE_KEYS.activeTestCase);
        const savedActiveExecution = localStorage.getItem(STORAGE_KEYS.activeExecution);
        const savedComparisonSets = localStorage.getItem(STORAGE_KEYS.comparisonSets);
        const savedView = localStorage.getItem(STORAGE_KEYS.view);
        const savedAutoSave = localStorage.getItem(STORAGE_KEYS.autoSave);

        if (savedTestCases) {
          const parsedTestCases = JSON.parse(savedTestCases);
          setTestCases(parsedTestCases);
          
          if (savedActiveTestCase) {
            setActiveTestCase(savedActiveTestCase);
          }
          
          if (savedActiveExecution) {
            setActiveExecution(savedActiveExecution);
          }
          
          if (savedComparisonSets) {
            setComparisonSets(JSON.parse(savedComparisonSets));
          }
          
          if (savedView) {
            setView(savedView);
          }
          
          if (savedAutoSave !== null) {
            setAutoSave(JSON.parse(savedAutoSave));
          }
          
          setLastSaved(new Date());
          setDataLoaded(true);
        } else {
          // Initialize with default test case if no saved data
          const defaultTestCase = createNewTestCase();
          setTestCases([defaultTestCase]);
          setActiveTestCase(defaultTestCase.id);
          setActiveExecution(defaultTestCase.executions[0].id);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Initialize with default on error
        const defaultTestCase = createNewTestCase();
        setTestCases([defaultTestCase]);
        setActiveTestCase(defaultTestCase.id);
        setActiveExecution(defaultTestCase.executions[0].id);
        setDataLoaded(true);
      }
    };

    loadFromStorage();
  }, []);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (autoSave && testCases.length > 0 && storageAvailable && dataLoaded) {
      const saveToStorage = () => {
        try {
          localStorage.setItem(STORAGE_KEYS.testCases, JSON.stringify(testCases));
          localStorage.setItem(STORAGE_KEYS.activeTestCase, activeTestCase || '');
          localStorage.setItem(STORAGE_KEYS.activeExecution, activeExecution || '');
          localStorage.setItem(STORAGE_KEYS.comparisonSets, JSON.stringify(comparisonSets));
          localStorage.setItem(STORAGE_KEYS.view, view);
          localStorage.setItem(STORAGE_KEYS.autoSave, JSON.stringify(autoSave));
          setLastSaved(new Date());
        } catch (error) {
          console.error('Error saving to localStorage:', error);
          // Could show a notification here if storage is full
        }
      };

      const timeoutId = setTimeout(saveToStorage, 500); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [testCases, activeTestCase, activeExecution, comparisonSets, view, autoSave, storageAvailable, dataLoaded]);

  // Helper Functions
  function createNewTestCase() {
    const id = Date.now().toString();
    return {
      id,
      name: `Test Case ${new Date().toLocaleString()}`,
      environment: {
        modelSKU: '',
        abVersion: '',
        tagVersion: '',
        fwVersion: '',
        assetPackVersion: '',
        payloadVersion: '',
        links: []
      },
      executions: [createNewExecution()],
      createdAt: new Date().toISOString()
    };
  }

  function createNewExecution() {
    return {
      id: Date.now().toString() + Math.random(),
      name: `Execution ${new Date().toLocaleTimeString()}`,
      tagNumbers: [],
      tagIds: [],
      timestamps: [],
      passCriteria: { enabled: false, maxLatency: 100 },
      notes: ''
    };
  }

  function createNewTimestamp() {
    return {
      id: Date.now().toString() + Math.random(),
      time: '',
      label: 'TagOff',
      note: '',
      stage: ''
    };
  }

  function parseTimeToMs(timeStr) {
    if (!timeStr) return null;
    
    // Handle formats: "12.345" (seconds.ms) or "12:345" (seconds:ms)
    const parts = timeStr.replace(':', '.').split('.');
    if (parts.length === 2) {
      const seconds = parseFloat(parts[0]);
      const ms = parseFloat(parts[1]);
      return seconds * 1000 + ms;
    }
    return parseFloat(timeStr) * 1000;
  }

  function formatMsToTime(ms) {
    if (ms === null || ms === undefined) return '-';
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.round(ms % 1000);
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
  }

  function calculateLatencies(timestamps) {
    const latencies = [];
    const sortedTimestamps = [...timestamps]
      .filter(ts => ts.time)
      .sort((a, b) => parseTimeToMs(a.time) - parseTimeToMs(b.time));

    for (let i = 1; i < sortedTimestamps.length; i++) {
      const prevTime = parseTimeToMs(sortedTimestamps[i - 1].time);
      const currTime = parseTimeToMs(sortedTimestamps[i].time);
      if (prevTime !== null && currTime !== null) {
        latencies.push({
          value: currTime - prevTime,
          from: sortedTimestamps[i - 1],
          to: sortedTimestamps[i]
        });
      }
    }

    return latencies;
  }

  function getStatistics(latencies) {
    if (latencies.length === 0) return { min: 0, max: 0, avg: 0, outliers: [] };
    
    const values = latencies.map(l => l.value);
    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Detect outliers using IQR method
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers = latencies.filter(l => 
      l.value < lowerBound || l.value > upperBound
    );
    
    return { min, max, avg, outliers };
  }

  // Current test case and execution helpers
  const currentTestCase = testCases.find(tc => tc.id === activeTestCase);
  const currentExecution = currentTestCase?.executions.find(ex => ex.id === activeExecution);

  // Event Handlers
  const handleAddTimestamp = () => {
    if (!currentExecution) return;
    
    const newTimestamp = createNewTimestamp();
    const updatedTestCases = testCases.map(tc => {
      if (tc.id === activeTestCase) {
        return {
          ...tc,
          executions: tc.executions.map(ex => {
            if (ex.id === activeExecution) {
              return { ...ex, timestamps: [...ex.timestamps, newTimestamp] };
            }
            return ex;
          })
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const handleTimestampChange = (timestampId, field, value) => {
    const updatedTestCases = testCases.map(tc => {
      if (tc.id === activeTestCase) {
        return {
          ...tc,
          executions: tc.executions.map(ex => {
            if (ex.id === activeExecution) {
              return {
                ...ex,
                timestamps: ex.timestamps.map(ts => {
                  if (ts.id === timestampId) {
                    return { ...ts, [field]: value };
                  }
                  return ts;
                })
              };
            }
            return ex;
          })
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const handleDeleteTimestamp = (timestampId) => {
    const updatedTestCases = testCases.map(tc => {
      if (tc.id === activeTestCase) {
        return {
          ...tc,
          executions: tc.executions.map(ex => {
            if (ex.id === activeExecution) {
              return {
                ...ex,
                timestamps: ex.timestamps.filter(ts => ts.id !== timestampId)
              };
            }
            return ex;
          })
        };
      }
      return tc;
    });
    setTestCases(updatedTestCases);
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n').filter(line => line.trim());
    
    if (lines.length > 0) {
      e.preventDefault();
      const newTimestamps = lines.map(line => {
        const parts = line.split('\t');
        return {
          id: Date.now().toString() + Math.random(),
          time: parts[0] || '',
          label: parts[1] || 'TagOff',
          note: parts[2] || '',
          stage: parts[3] || ''
        };
      });
      
      const updatedTestCases = testCases.map(tc => {
        if (tc.id === activeTestCase) {
          return {
            ...tc,
            executions: tc.executions.map(ex => {
              if (ex.id === activeExecution) {
                return {
                  ...ex,
                  timestamps: [...ex.timestamps, ...newTimestamps]
                };
              }
              return ex;
            })
          };
        }
        return tc;
      });
      setTestCases(updatedTestCases);
    }
  };

  const handleAddToComparison = (execution) => {
    const testCase = testCases.find(tc => 
      tc.executions.some(ex => ex.id === execution.id)
    );
    
    if (testCase && !comparisonSets.find(cs => cs.executionId === execution.id)) {
      setComparisonSets([...comparisonSets, {
        executionId: execution.id,
        testCaseName: testCase.name,
        executionName: execution.name,
        execution: execution,
        environment: testCase.environment
      }]);
    }
  };

  // Manual save function
  const manualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.testCases, JSON.stringify(testCases));
      localStorage.setItem(STORAGE_KEYS.activeTestCase, activeTestCase || '');
      localStorage.setItem(STORAGE_KEYS.activeExecution, activeExecution || '');
      localStorage.setItem(STORAGE_KEYS.comparisonSets, JSON.stringify(comparisonSets));
      localStorage.setItem(STORAGE_KEYS.view, view);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save data. Storage might be full.');
    }
  };

  // Clear all data function
  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all test data? This action cannot be undone.')) {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Reset to default state
      const defaultTestCase = createNewTestCase();
      setTestCases([defaultTestCase]);
      setActiveTestCase(defaultTestCase.id);
      setActiveExecution(defaultTestCase.executions[0].id);
      setComparisonSets([]);
      setView('execution');
      setLastSaved(null);
    }
  };

  // Export with localStorage backup
  const exportToExcel = () => {
    const data = {
      testCase: currentTestCase,
      execution: currentExecution,
      latencies: calculateLatencies(currentExecution?.timestamps || []),
      statistics: getStatistics(calculateLatencies(currentExecution?.timestamps || []))
    };
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `latency-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.testCase) {
            setTestCases([...testCases, data.testCase]);
            setActiveTestCase(data.testCase.id);
            if (data.execution) {
              setActiveExecution(data.execution.id);
            }
          }
        } catch (error) {
          alert('Failed to import file. Please ensure it\'s a valid export.');
        }
      };
      reader.readAsText(file);
    }
  };

  const exportToPDF = () => {
    // In a real implementation, you'd use a library like jsPDF
    window.print();
  };

  // Render Functions
  const renderExecutionView = () => {
    if (!currentExecution) return <div>No execution selected</div>;
    
    const latencies = calculateLatencies(currentExecution.timestamps);
    const stats = getStatistics(latencies);
    const passed = !currentExecution.passCriteria.enabled || 
                   stats.max <= currentExecution.passCriteria.maxLatency;

    return (
      <div className="space-y-6">
        {/* Test Info Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Execution</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddToComparison(currentExecution)}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add to Comparison
              </button>
              <button
                onClick={exportToExcel}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Test Case:</span>
              <span className="ml-2 font-medium">{currentTestCase?.name}</span>
            </div>
            <div>
              <span className="text-gray-500">Execution:</span>
              <span className="ml-2 font-medium">{currentExecution.name}</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-3">Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {formatMsToTime(stats.min)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Minimum</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {formatMsToTime(stats.avg)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Average</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {formatMsToTime(stats.max)}
              </div>
              <div className="text-xs text-gray-500 mt-1">Maximum</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>
                {passed ? <Check className="w-8 h-8 mx-auto" /> : <X className="w-8 h-8 mx-auto" />}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {currentExecution.passCriteria.enabled ? 'Pass/Fail' : 'No Criteria'}
              </div>
            </div>
          </div>
          
          {stats.outliers.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Outliers Detected:</span>
              </div>
              <div className="mt-2 text-sm text-yellow-700">
                {stats.outliers.map((outlier, idx) => (
                  <div key={idx}>
                    {formatMsToTime(outlier.value)} 
                    ({outlier.from.label} → {outlier.to.label})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Timestamps Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Timestamps</h3>
            <button
              onClick={handleAddTimestamp}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Timestamp
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">#</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Time (s.ms)</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Label</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Stage</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Note</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Latency</th>
                  <th className="pb-2 px-2 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody onPaste={handlePaste}>
                {currentExecution.timestamps.map((timestamp, index) => {
                  const prevTimestamp = index > 0 ? currentExecution.timestamps[index - 1] : null;
                  let latency = null;
                  if (prevTimestamp && timestamp.time && prevTimestamp.time) {
                    const curr = parseTimeToMs(timestamp.time);
                    const prev = parseTimeToMs(prevTimestamp.time);
                    if (curr !== null && prev !== null) {
                      latency = curr - prev;
                    }
                  }
                  
                  return (
                    <tr key={timestamp.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2 text-sm">{index + 1}</td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={timestamp.time}
                          onChange={(e) => handleTimestampChange(timestamp.id, 'time', e.target.value)}
                          placeholder="12.345"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={timestamp.label}
                          onChange={(e) => handleTimestampChange(timestamp.id, 'label', e.target.value)}
                          className="w-full px-2 py-1 text-sm border rounded"
                        >
                          <option value="TagOn">TagOn</option>
                          <option value="TagOff">TagOff</option>
                          <option value="Error">Error</option>
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={timestamp.stage}
                          onChange={(e) => handleTimestampChange(timestamp.id, 'stage', e.target.value)}
                          placeholder="Stage"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={timestamp.note}
                          onChange={(e) => handleTimestampChange(timestamp.id, 'note', e.target.value)}
                          placeholder="Note"
                          className="w-full px-2 py-1 text-sm border rounded"
                        />
                      </td>
                      <td className="py-2 px-2 text-sm font-medium">
                        {latency !== null ? formatMsToTime(latency) : '-'}
                      </td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => handleDeleteTimestamp(timestamp.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            💡 Tip: You can paste data from Excel directly into the table
          </div>
        </div>

        {/* Pass/Fail Criteria */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold mb-3">Pass/Fail Criteria</h3>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentExecution.passCriteria.enabled}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        executions: tc.executions.map(ex => {
                          if (ex.id === activeExecution) {
                            return {
                              ...ex,
                              passCriteria: { ...ex.passCriteria, enabled: e.target.checked }
                            };
                          }
                          return ex;
                        })
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">Enable Pass/Fail</span>
            </label>
            
            {currentExecution.passCriteria.enabled && (
              <div className="flex items-center gap-2">
                <span className="text-sm">Max Latency:</span>
                <input
                  type="number"
                  value={currentExecution.passCriteria.maxLatency}
                  onChange={(e) => {
                    const updatedTestCases = testCases.map(tc => {
                      if (tc.id === activeTestCase) {
                        return {
                          ...tc,
                          executions: tc.executions.map(ex => {
                            if (ex.id === activeExecution) {
                              return {
                                ...ex,
                                passCriteria: { ...ex.passCriteria, maxLatency: parseFloat(e.target.value) }
                              };
                            }
                            return ex;
                          })
                        };
                      }
                      return tc;
                    });
                    setTestCases(updatedTestCases);
                  }}
                  className="w-24 px-2 py-1 text-sm border rounded"
                />
                <span className="text-sm">ms</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderComparisonView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Test Comparison</h2>
          
          {comparisonSets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No test sets added for comparison</p>
              <p className="text-sm mt-2">Add executions from the Execution view</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Basic Comparison */}
              <div>
                <h3 className="text-lg font-medium mb-3">Summary Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left pb-2 text-sm font-medium text-gray-600">Test Set</th>
                        <th className="text-center pb-2 text-sm font-medium text-gray-600">Min</th>
                        <th className="text-center pb-2 text-sm font-medium text-gray-600">Avg</th>
                        <th className="text-center pb-2 text-sm font-medium text-gray-600">Max</th>
                        <th className="text-center pb-2 text-sm font-medium text-gray-600">Outliers</th>
                        <th className="text-center pb-2 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonSets.map((set, index) => {
                        const latencies = calculateLatencies(set.execution.timestamps);
                        const stats = getStatistics(latencies);
                        
                        return (
                          <tr key={set.executionId} className="border-b hover:bg-gray-50">
                            <td className="py-2 text-sm">
                              <div className="font-medium">{set.executionName}</div>
                              <div className="text-xs text-gray-500">{set.testCaseName}</div>
                            </td>
                            <td className="py-2 text-center text-sm font-medium text-blue-600">
                              {formatMsToTime(stats.min)}
                            </td>
                            <td className="py-2 text-center text-sm font-medium text-green-600">
                              {formatMsToTime(stats.avg)}
                            </td>
                            <td className="py-2 text-center text-sm font-medium text-orange-600">
                              {formatMsToTime(stats.max)}
                            </td>
                            <td className="py-2 text-center text-sm">
                              {stats.outliers.length > 0 ? (
                                <span className="text-yellow-600">{stats.outliers.length}</span>
                              ) : (
                                <span className="text-gray-400">0</span>
                              )}
                            </td>
                            <td className="py-2 text-center">
                              <button
                                onClick={() => {
                                  setComparisonSets(comparisonSets.filter(cs => cs.executionId !== set.executionId));
                                }}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Comparison */}
              {comparisonSets.length >= 2 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Detailed Analysis</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {(() => {
                      const allStats = comparisonSets.map(set => {
                        const latencies = calculateLatencies(set.execution.timestamps);
                        return getStatistics(latencies);
                      });
                      
                      const minMin = Math.min(...allStats.map(s => s.min));
                      const maxMax = Math.max(...allStats.map(s => s.max));
                      const avgAvg = allStats.reduce((sum, s) => sum + s.avg, 0) / allStats.length;
                      
                      return (
                        <>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600 font-medium">Best Minimum</div>
                            <div className="text-2xl font-bold text-blue-700 mt-1">
                              {formatMsToTime(minMin)}
                            </div>
                          </div>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="text-sm text-orange-600 font-medium">Worst Maximum</div>
                            <div className="text-2xl font-bold text-orange-700 mt-1">
                              {formatMsToTime(maxMax)}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-600 font-medium">Overall Average</div>
                            <div className="text-2xl font-bold text-green-700 mt-1">
                              {formatMsToTime(avgAvg)}
                            </div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm text-purple-600 font-medium">Variance</div>
                            <div className="text-2xl font-bold text-purple-700 mt-1">
                              {formatMsToTime(maxMax - minMin)}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettingsView = () => {
    if (!currentTestCase) return <div>No test case selected</div>;
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">Test Environment Settings</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model-SKU</label>
              <input
                type="text"
                value={currentTestCase.environment.modelSKU}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, modelSKU: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AB Version</label>
              <input
                type="text"
                value={currentTestCase.environment.abVersion}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, abVersion: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Version</label>
              <input
                type="text"
                value={currentTestCase.environment.tagVersion}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, tagVersion: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FW Version</label>
              <input
                type="text"
                value={currentTestCase.environment.fwVersion}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, fwVersion: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asset Pack Version</label>
              <input
                type="text"
                value={currentTestCase.environment.assetPackVersion}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, assetPackVersion: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payload Version</label>
              <input
                type="text"
                value={currentTestCase.environment.payloadVersion}
                onChange={(e) => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, payloadVersion: e.target.value }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Links</label>
            <div className="space-y-2">
              {currentTestCase.environment.links.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      const updatedTestCases = testCases.map(tc => {
                        if (tc.id === activeTestCase) {
                          const newLinks = [...tc.environment.links];
                          newLinks[index] = e.target.value;
                          return {
                            ...tc,
                            environment: { ...tc.environment, links: newLinks }
                          };
                        }
                        return tc;
                      });
                      setTestCases(updatedTestCases);
                    }}
                    placeholder="https://example.com/asset"
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                  <button
                    onClick={() => {
                      const updatedTestCases = testCases.map(tc => {
                        if (tc.id === activeTestCase) {
                          const newLinks = tc.environment.links.filter((_, i) => i !== index);
                          return {
                            ...tc,
                            environment: { ...tc.environment, links: newLinks }
                          };
                        }
                        return tc;
                      });
                      setTestCases(updatedTestCases);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const updatedTestCases = testCases.map(tc => {
                    if (tc.id === activeTestCase) {
                      return {
                        ...tc,
                        environment: { ...tc.environment, links: [...tc.environment.links, ''] }
                      };
                    }
                    return tc;
                  });
                  setTestCases(updatedTestCases);
                }}
                className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show loading state while checking storage */}
      {!dataLoaded ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading test data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Storage Warning */}
          {!storageAvailable && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Storage Unavailable:</span>
                <span>Data will not persist after closing this session. Export your data to save it.</span>
              </div>
            </div>
          )}
          
          {/* Data Restored Notification */}
          {dataLoaded && lastSaved && testCases.length > 1 && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-800 text-sm">
                  <Check className="w-4 h-4" />
                  <span>Previous session restored: {testCases.length} test cases loaded</span>
                </div>
                <button
                  onClick={() => {
                    const element = document.querySelector('.bg-blue-50');
                    if (element) element.style.display = 'none';
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Hardware Latency Tester</h1>
            {/* Save Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {autoSave ? (
                <div className="flex items-center gap-1 text-green-600">
                  <Cloud className="w-4 h-4" />
                  <span>Auto-save ON</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <HardDrive className="w-4 h-4" />
                  <span>Auto-save OFF</span>
                </div>
              )}
              {lastSaved && (
                <span className="text-gray-500 text-xs">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {/* Auto-save Toggle */}
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`px-3 py-2 rounded-md flex items-center gap-2 ${
                autoSave 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Toggle auto-save"
            >
              {autoSave ? <Cloud className="w-4 h-4" /> : <HardDrive className="w-4 h-4" />}
              Auto-save
            </button>
            {/* Manual Save */}
            {!autoSave && (
              <button
                onClick={manualSave}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            )}
            {/* Clear Data */}
            <button
              onClick={clearAllData}
              className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center gap-2"
              title="Clear all data"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
            <div className="border-l border-gray-300 mx-2"></div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-6">
          <button
            onClick={() => setView('execution')}
            className={`py-3 border-b-2 ${view === 'execution' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            Test Execution
          </button>
          <button
            onClick={() => setView('comparison')}
            className={`py-3 border-b-2 relative ${view === 'comparison' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            Comparison
            {comparisonSets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {comparisonSets.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setView('settings')}
            className={`py-3 border-b-2 ${view === 'settings' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600'}`}
          >
            Environment Settings
          </button>
        </div>
      </div>

      {/* Sidebar and Content */}
      <div className="flex">
        {/* Sidebar - Test Cases and Executions */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Test Cases</h3>
              <button
                onClick={() => {
                  const newTestCase = createNewTestCase();
                  setTestCases([...testCases, newTestCase]);
                  setActiveTestCase(newTestCase.id);
                  setActiveExecution(newTestCase.executions[0].id);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {testCases.map(tc => (
                <div key={tc.id} className="border rounded-md">
                  <button
                    onClick={() => {
                      setActiveTestCase(tc.id);
                      if (tc.executions.length > 0) {
                        setActiveExecution(tc.executions[0].id);
                      }
                    }}
                    className={`w-full text-left p-2 hover:bg-gray-50 ${activeTestCase === tc.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="text-sm font-medium">{tc.name}</div>
                    <div className="text-xs text-gray-500">{tc.executions.length} executions</div>
                  </button>
                  
                  {activeTestCase === tc.id && (
                    <div className="border-t">
                      <div className="px-2 py-1 bg-gray-50 text-xs font-medium text-gray-600">
                        Executions
                      </div>
                      {tc.executions.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => setActiveExecution(ex.id)}
                          className={`w-full text-left px-4 py-1.5 text-sm hover:bg-gray-100 ${activeExecution === ex.id ? 'bg-blue-100' : ''}`}
                        >
                          {ex.name}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const newExecution = createNewExecution();
                          const updatedTestCases = testCases.map(testCase => {
                            if (testCase.id === tc.id) {
                              return {
                                ...testCase,
                                executions: [...testCase.executions, newExecution]
                              };
                            }
                            return testCase;
                          });
                          setTestCases(updatedTestCases);
                          setActiveExecution(newExecution.id);
                        }}
                        className="w-full text-left px-4 py-1.5 text-sm hover:bg-gray-100 text-blue-600 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        New Execution
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {view === 'execution' && renderExecutionView()}
          {view === 'comparison' && renderComparisonView()}
          {view === 'settings' && renderSettingsView()}
        </div>
      </div>
      </>
      )}
    </div>
  );
};

export default LatencyTester;