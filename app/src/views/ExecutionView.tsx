import React, { useMemo, useState } from 'react';
import { parseCsv, CsvParseIssue } from '../domain/csvParser';
import { deriveAxisLatencies } from '../domain/latencyCalculations';
import { ExecutionSession } from '../types';
import ImportModal from '../components/modals/ImportModal';

interface ExecutionViewProps {
  sessions: ExecutionSession[];
  onAddSession: (session: ExecutionSession) => void;
  onReplaceSessions: (sessions: ExecutionSession[]) => void;
}

const describeIssue = (issue: CsvParseIssue) => `${issue.type === 'error' ? 'Error' : 'Warning'}: ${issue.message}${issue.hint ? ` (${issue.hint})` : ''}`;

export const ExecutionView: React.FC<ExecutionViewProps> = ({ sessions, onAddSession, onReplaceSessions }) => {
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [issues, setIssues] = useState<CsvParseIssue[]>([]);
  const [troubleshooting, setTroubleshooting] = useState<string[]>([]);
  const [lastImportSummary, setLastImportSummary] = useState<string>('');

  const sessionTable = useMemo(
    () =>
      sessions.map((session) => ({
        id: `${session.testCaseId}::${session.executionId}`,
        name: session.name,
        axes: session.latencies.map((latency) => `${latency.axis} (${latency.stats.avg?.toFixed(1) ?? '—'}ms)`).join(', '),
        datasetSource: session.datasetSource
      })),
    [sessions]
  );

  const handleCsvImport = (content: string) => {
    const parsed = parseCsv(content);
    setIssues(parsed.issues);
    setTroubleshooting(parsed.troubleshooting);
    const hasError = parsed.issues.some((issue) => issue.type === 'error');
    if (hasError) return;

    const markerEvents = parsed.records
      .filter((record) => record.timestampMs != null)
      .map((record) => ({
        name: record.marker,
        timestampMs: record.timestampMs as number,
        axis: record.comment || undefined
      }));
    const latencies = deriveAxisLatencies(markerEvents);
    const newSession: ExecutionSession = {
      testCaseId: `csv-${Date.now()}`,
      executionId: 'import',
      name: 'Imported CSV Session',
      hardwareProfileId: 'default',
      latencies,
      datasetSource: 'manual-import',
      fps: 60,
      notes: `Mapped via ${parsed.mappingUsed.marker}/${parsed.mappingUsed.timecode}`
    };
    onAddSession(newSession);
    setLastImportSummary(
      `${parsed.records.length} markers parsed with ${parsed.mappingUsed.marker}/${parsed.mappingUsed.timecode} columns. ${latencies.length} axes detected.`
    );
    setShowCsvModal(false);
  };

  const handleJsonImport = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (!Array.isArray(parsed)) throw new Error('JSON session payload should be an array of executions.');
      const imported = parsed.map((entry, index) => ({
        testCaseId: entry.testCaseId || `json-${index}`,
        executionId: entry.executionId || `run-${index}`,
        name: entry.name || `JSON Session ${index + 1}`,
        hardwareProfileId: entry.hardwareProfileId || 'default',
        latencies: entry.latencies || [],
        datasetSource: 'manual-entry',
        fps: entry.fps || 60,
        notes: entry.notes
      }));
      onReplaceSessions(imported);
      setLastImportSummary(`Loaded ${imported.length} sessions from saved JSON.`);
      setIssues([]);
      setShowJsonModal(false);
    } catch (error: any) {
      setIssues([
        { type: 'error', message: error.message || 'Unable to parse JSON.', hint: 'Confirm the saved session schema matches the UI export.' }
      ]);
    }
  };

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Execution</h2>
        <p style={{ color: '#475569' }}>
          Keep CSV imports and saved session loads clearly separated to avoid accidental overwrites.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => setShowCsvModal(true)} className="active">
            Import CSV from DaVinci
          </button>
          <button onClick={() => setShowJsonModal(true)}>Load saved JSON session</button>
        </div>
        {lastImportSummary ? <p style={{ marginTop: 8, color: '#16a34a' }}>{lastImportSummary}</p> : null}
        {issues.length > 0 ? (
          <div className="notice" style={{ marginTop: 12 }}>
            <strong>Import validation</strong>
            <ul>
              {issues.map((issue) => (
                <li key={issue.message}>{describeIssue(issue)}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Sessions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Test Case</th>
              <th>Axes</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {sessionTable.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.axes || '—'}</td>
                <td>{row.datasetSource}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCsvModal ? (
        <ImportModal
          title="Import CSV from DaVinci"
          description="Paste CSV content from DaVinci Resolve. Column mapping is centralized and will surface actionable errors when markers, colours, or expected patterns are missing."
          placeholder="Marker Name, Color, Timecode, Comment"
          troubleshooting={troubleshooting}
          onClose={() => setShowCsvModal(false)}
          onSubmit={handleCsvImport}
        />
      ) : null}

      {showJsonModal ? (
        <ImportModal
          title="Load saved JSON session"
          description="Restore a previously saved latency-testing session without touching CSV imports."
          placeholder='[{ "testCaseId": "case-1", "executionId": "run-1", ... }]'
          onClose={() => setShowJsonModal(false)}
          onSubmit={handleJsonImport}
        />
      ) : null}
    </div>
  );
};

export default ExecutionView;
