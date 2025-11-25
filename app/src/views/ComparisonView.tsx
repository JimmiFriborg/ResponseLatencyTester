import React, { useMemo, useState } from 'react';
import CompareSessionsSummary from '../components/comparison/CompareSessionsSummary';
import {
  computeSessionDiffData,
  deriveSessionDiffStatus,
  encodeExecutionKey,
  decodeExecutionKey,
  SessionSummary
} from '../domain/sessionDiff';
import { describeDelta, formatMs } from '../domain/statistics';
import { ExecutionSession } from '../types';

interface ComparisonViewProps {
  sessions: ExecutionSession[];
  queue: string[];
  mode: 'full' | 'simple-tags';
  onUpdateQueue: (queue: string[]) => void;
  onUpdateMode: (mode: 'full' | 'simple-tags') => void;
}

const toSummary = (session: ExecutionSession): SessionSummary => ({
  testCaseId: session.testCaseId,
  executionId: session.executionId,
  testCaseName: session.name,
  executionName: session.executionId,
  datasetSource: session.datasetSource,
  fps: session.fps,
  hardwareSummary: session.hardwareProfileId,
  axisStats: session.latencies.reduce((acc, latency) => {
    acc[latency.axis] = {
      min: latency.stats.min ?? 0,
      avg: latency.stats.avg ?? 0,
      max: latency.stats.max ?? 0,
      total: latency.stats.total
    };
    return acc;
  }, {} as Record<string, any>)
});

const datasetLabel = (source?: string) => {
  switch (source) {
    case 'manual-entry':
      return 'Manual Session';
    case 'manual-import':
      return 'DaVinci Import';
    case 'automation-report':
      return 'Automation Report';
    default:
      return 'Unknown source';
  }
};

export const ComparisonView: React.FC<ComparisonViewProps> = ({ sessions, queue, mode, onUpdateQueue, onUpdateMode }) => {
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [copyStatus, setCopyStatus] = useState('');
  const [selection, setSelection] = useState<{ baseline: string; candidate: string } | null>(() => {
    if (queue.length >= 2) return { baseline: queue[0], candidate: queue[1] };
    return null;
  });

  const baseline = useMemo(() => sessions.find((session) => encodeExecutionKey(session.testCaseId, session.executionId) === selection?.baseline), [selection, sessions]);
  const candidate = useMemo(() => sessions.find((session) => encodeExecutionKey(session.testCaseId, session.executionId) === selection?.candidate), [selection, sessions]);

  const diffData = useMemo(() => {
    if (mode === 'simple-tags') return null;
    if (!baseline || !candidate) return null;
    return computeSessionDiffData({ baseline: toSummary(baseline), candidate: toSummary(candidate), axisKeys: baseline.latencies.map((latency) => latency.axis) });
  }, [baseline, candidate, mode]);

  const sessionDiffState = deriveSessionDiffStatus({
    selection: selection
      ? { baseline: decodeExecutionKey(selection.baseline), candidate: decodeExecutionKey(selection.candidate) }
      : null,
    diffData,
    baselineAvailable: !!baseline,
    candidateAvailable: !!candidate,
    hasExecutions: sessions.length > 0
  });

  const updateSelection = (value: string, role: 'baseline' | 'candidate') => {
    setSelection((prev) => ({ ...(prev || { baseline: '', candidate: '' }), [role]: value }));
  };

  const toggleQueue = (id: string) => {
    if (queue.includes(id)) {
      onUpdateQueue(queue.filter((value) => value !== id));
    } else {
      onUpdateQueue([...queue, id]);
    }
  };

  const annotateAxis = (axis: string) => {
    const note = window.prompt('Add comparison note for ' + axis, annotations[axis] || '');
    if (note != null) {
      setAnnotations({ ...annotations, [axis]: note });
    }
  };

  const copyDiff = () => {
    if (!diffData) return;
    const lines = diffData.axes.map((row) => `${row.axisKey}: Δ ${describeDelta(row.delta.avg)}`);
    navigator.clipboard.writeText(lines.join('\n')).then(() => setCopyStatus('Diff copied to clipboard.'));
  };

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Comparison</h2>
        <p style={{ color: '#475569' }}>
          Persisted comparison queue and mode live in versioned storage. Simple-tag mode disables comparison because only a
          single marker is captured per axis and deltas cannot be derived.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label>
            Mode:{' '}
            <select value={mode} onChange={(event) => onUpdateMode(event.target.value as 'full' | 'simple-tags')}>
              <option value="full">Full comparison</option>
              <option value="simple-tags">Simple-tag (no deltas)</option>
            </select>
          </label>
        </div>
        {mode === 'simple-tags' ? (
          <div className="notice" style={{ marginTop: 10 }}>
            Simple-tag mode records only tag toggles. Comparison is disabled because there is no paired motion marker to
            measure latency. Switch back to full mode to enable deltas.
          </div>
        ) : null}
        <div style={{ marginTop: 12 }}>
          <strong>Queue</strong>
          <ul>
            {sessions.map((session) => {
              const id = encodeExecutionKey(session.testCaseId, session.executionId);
              return (
                <li key={id}>
                  <label style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={queue.includes(id)} onChange={() => toggleQueue(id)} /> {session.name}{' '}
                    <span className="badge">{session.datasetSource}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="grid two">
          <div>
            <label>Baseline session</label>
            <select value={selection?.baseline || ''} onChange={(event) => updateSelection(event.target.value, 'baseline')}>
              <option value="">Choose</option>
              {queue.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Candidate session</label>
            <select value={selection?.candidate || ''} onChange={(event) => updateSelection(event.target.value, 'candidate')}>
              <option value="">Choose</option>
              {queue.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <CompareSessionsSummary
        sessionDiffData={diffData}
        sessionDiffState={sessionDiffState}
        copyDiffStatus={copyStatus}
        onOpenModal={() => alert('Use the selectors above to change baseline/candidate.')}
        onCopyDiff={copyDiff}
        describeDatasetSource={datasetLabel}
        diffAnnotations={annotations}
        onAnnotateAxis={annotateAxis}
        formatStat={(stats, metric) => formatMs(stats?.[metric] ?? null)}
        formatDeltaMs={(value, suffix = ' ms') => describeDelta(value, suffix)}
        getDeltaBadgeClasses={(value) => (value > 0 ? 'bg-amber-100' : 'bg-emerald-100')}
      />
    </div>
  );
};

export default ComparisonView;
