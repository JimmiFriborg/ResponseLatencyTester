import React from 'react';
import { SessionDiffData } from '../../domain/sessionDiff';

interface CompareSessionsSummaryProps {
  sessionDiffData: SessionDiffData | null;
  sessionDiffState: { status: 'idle' | 'loading' | 'ready' | 'error'; message: string };
  copyDiffStatus: string;
  onOpenModal: () => void;
  onCopyDiff: () => void;
  describeDatasetSource: (value?: string) => string;
  diffAnnotations: Record<string, string>;
  onAnnotateAxis: (axis: string) => void;
  formatStat: (stats: any, metric: 'min' | 'avg' | 'max') => string;
  formatDeltaMs: (value: number | null, suffix?: string) => string;
  getDeltaBadgeClasses: (value: number) => string;
  Icon?: React.FC<{ name: string }>;
}

export const CompareSessionsSummary: React.FC<CompareSessionsSummaryProps> = ({
  sessionDiffData,
  sessionDiffState,
  copyDiffStatus,
  onOpenModal,
  onCopyDiff,
  describeDatasetSource,
  diffAnnotations,
  onAnnotateAxis,
  formatStat,
  formatDeltaMs,
  getDeltaBadgeClasses,
  Icon
}) => {
  const showSummary = sessionDiffState?.status === 'ready' && !!sessionDiffData;
  const statusMessage = sessionDiffState?.message || '';
  const statusTone = sessionDiffState?.status === 'error' ? 'text-red-600' : 'text-gray-600';
  const canCopy = showSummary;

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Compare Sessions</h2>
          <p style={{ margin: 0, color: '#475569' }}>
            Pick baseline vs. candidate datasets (manual imports or automation reports) to calculate per-axis deltas.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={onOpenModal} className="active">
            {Icon ? <Icon name="link" /> : null} Choose Sessions
          </button>
          <button onClick={onCopyDiff} disabled={!canCopy}>
            {Icon ? <Icon name="copy" /> : null} Copy Diff Output
          </button>
        </div>
      </div>
      {copyDiffStatus ? <p style={{ color: '#16a34a', margin: '8px 0 0 0' }}>{copyDiffStatus}</p> : null}
      {!showSummary && statusMessage ? <p className={statusTone}>{statusMessage}</p> : null}
      {showSummary ? (
        <>
          <div className="grid two">
            <div className="card" style={{ background: '#f8fafc' }}>
              <h4 style={{ marginTop: 0, marginBottom: 4 }}>Baseline</h4>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {sessionDiffData.baseline.testCaseName} · {sessionDiffData.baseline.executionName}
              </p>
              <p style={{ margin: '4px 0', color: '#475569' }}>{describeDatasetSource(sessionDiffData.baseline.datasetSource)}</p>
              <p style={{ margin: '2px 0', color: '#475569' }}>FPS: {sessionDiffData.baseline.fps ?? '—'}</p>
              <p style={{ margin: '2px 0', color: '#475569' }}>
                Hardware: {sessionDiffData.baseline.hardwareSummary || '—'}
              </p>
            </div>
            <div className="card" style={{ background: '#f8fafc' }}>
              <h4 style={{ marginTop: 0, marginBottom: 4 }}>Candidate</h4>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {sessionDiffData.candidate.testCaseName} · {sessionDiffData.candidate.executionName}
              </p>
              <p style={{ margin: '4px 0', color: '#475569' }}>
                {describeDatasetSource(sessionDiffData.candidate.datasetSource)}
              </p>
              <p style={{ margin: '2px 0', color: '#475569' }}>FPS: {sessionDiffData.candidate.fps ?? '—'}</p>
              <p style={{ margin: '2px 0', color: '#475569' }}>
                Hardware: {sessionDiffData.candidate.hardwareSummary || '—'}
              </p>
            </div>
          </div>
          {sessionDiffData.fpsDelta != null ? (
            <p style={{ fontSize: 13, color: '#475569' }}>
              Overall FPS Δ:{' '}
              <span className={`badge ${getDeltaBadgeClasses(sessionDiffData.fpsDelta)}`}>
                {formatDeltaMs(sessionDiffData.fpsDelta, ' fps')}
              </span>
            </p>
          ) : null}
          {sessionDiffData.hardwareDiffers ? (
            <p style={{ color: '#92400e', fontSize: 13 }}>Hardware notes differ between the selected sessions.</p>
          ) : null}
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Axis</th>
                  <th style={{ textAlign: 'right' }}>Baseline</th>
                  <th style={{ textAlign: 'right' }}>Candidate</th>
                  <th style={{ textAlign: 'right' }}>Delta</th>
                  <th>Annotations</th>
                </tr>
              </thead>
              <tbody>
                {sessionDiffData.axes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 12 }}>
                      No axis data available for the selected sessions.
                    </td>
                  </tr>
                ) : (
                  sessionDiffData.axes.map((row) => (
                    <tr key={row.axisKey}>
                      <td style={{ fontWeight: 600 }}>{row.axisKey}</td>
                      <td style={{ textAlign: 'right', fontSize: 13, color: '#475569' }}>
                        <div>Min: {formatStat(row.baselineStats, 'min')}</div>
                        <div>Avg: {formatStat(row.baselineStats, 'avg')}</div>
                        <div>Max: {formatStat(row.baselineStats, 'max')}</div>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 13, color: '#475569' }}>
                        <div>Min: {formatStat(row.candidateStats, 'min')}</div>
                        <div>Avg: {formatStat(row.candidateStats, 'avg')}</div>
                        <div>Max: {formatStat(row.candidateStats, 'max')}</div>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: 13, color: '#475569' }}>
                        <div>Δ Min {formatDeltaMs(row.delta.min)}</div>
                        <div>Δ Avg {formatDeltaMs(row.delta.avg)}</div>
                        <div>Δ Max {formatDeltaMs(row.delta.max)}</div>
                      </td>
                      <td>
                        <button onClick={() => onAnnotateAxis(row.axisKey)}>
                          {Icon ? <Icon name="pin" /> : null} {diffAnnotations[row.axisKey] ? 'Edit note' : 'Add note'}
                        </button>
                        {diffAnnotations[row.axisKey] ? (
                          <p style={{ color: '#92400e', fontStyle: 'italic' }}>{diffAnnotations[row.axisKey]}</p>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default CompareSessionsSummary;
