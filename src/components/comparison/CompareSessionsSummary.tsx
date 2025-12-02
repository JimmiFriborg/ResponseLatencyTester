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
  onAnnotateModule: (moduleKey: string) => void;
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
  onAnnotateModule,
  formatStat,
  formatDeltaMs,
  getDeltaBadgeClasses,
  Icon
}) => {
  const hasCompleteSessions = !!(sessionDiffData && sessionDiffData.baseline && sessionDiffData.candidate);
  const modules = Array.isArray(sessionDiffData?.modules) ? sessionDiffData.modules : [];
  const showSummary = sessionDiffState?.status === 'ready' && hasCompleteSessions;
  const statusMessage = sessionDiffState?.message || '';
  const statusTone = sessionDiffState?.status === 'error' ? 'text-red-600' : 'text-gray-600';
  const canCopy = showSummary;
  const isLoading = sessionDiffState?.status === 'loading';
  const isIdle = sessionDiffState?.status === 'idle';

  const renderStatusNotice = () => {
    if (!statusMessage || showSummary) return null;
    const isError = sessionDiffState?.status === 'error';
    return (
      <div className={`notice ${isError ? 'bg-amber-50' : ''}`} role={isError ? 'alert' : 'status'} style={{ marginTop: 12 }}>
        <p style={{ margin: 0, color: isError ? '#991b1b' : '#475569' }}>{statusMessage}</p>
      </div>
    );
  };

  if (sessionDiffData && !hasCompleteSessions) {
    return (
      <div className="card">
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Compare Sessions</h2>
            <p style={{ margin: 0, color: '#475569' }}>
              Pick baseline vs. candidate datasets (manual imports or automation reports) to calculate per-module deltas.
            </p>
          </div>
        </div>
        <div className="notice" role="alert" style={{ marginTop: 12 }}>
          Unable to render comparison details because required session data is missing.
        </div>
      </div>
    );
  }

  if (isLoading || isIdle) {
    return (
      <div className="card" aria-busy={isLoading} aria-live="polite">
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0 }}>Compare Sessions</h2>
            <p style={{ margin: 0, color: '#475569' }}>
              Pick baseline vs. candidate datasets (manual imports or automation reports) to calculate per-module deltas.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={onOpenModal} className="active">
              {Icon ? <Icon name="link" /> : null} Choose Sessions
            </button>
            <button onClick={onCopyDiff} disabled>
              {Icon ? <Icon name="copy" /> : null} Copy Diff Output
            </button>
          </div>
        </div>
        {statusMessage ? <p className={statusTone} style={{ marginTop: 12 }}>{statusMessage}</p> : null}
        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          <div style={{ background: '#f8fafc', borderRadius: 6, padding: 12 }}>
            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '60%' }} />
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 6, padding: 12 }}>
            <div className="skeleton" style={{ height: 14, width: '35%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '50%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0 }}>Compare Sessions</h2>
          <p style={{ margin: 0, color: '#475569' }}>
            Pick baseline vs. candidate datasets (manual imports or automation reports) to calculate per-module deltas.
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
      {renderStatusNotice()}
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
                  <th>Module Under Test</th>
                  <th style={{ textAlign: 'right' }}>Baseline</th>
                  <th style={{ textAlign: 'right' }}>Candidate</th>
                  <th style={{ textAlign: 'right' }}>Delta</th>
                  <th>Annotations</th>
                </tr>
              </thead>
              <tbody>
                {modules.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 12 }}>
                      No module data available for the selected sessions.
                    </td>
                  </tr>
                ) : (
                  modules.map((row) => (
                    <tr key={row.moduleKey}>
                      <td style={{ fontWeight: 600 }}>{row.moduleKey}</td>
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
                        <button onClick={() => onAnnotateModule(row.moduleKey)}>
                          {Icon ? <Icon name="pin" /> : null} {diffAnnotations[row.moduleKey] ? 'Edit note' : 'Add note'}
                        </button>
                        {diffAnnotations[row.moduleKey] ? (
                          <p style={{ color: '#92400e', fontStyle: 'italic' }}>{diffAnnotations[row.moduleKey]}</p>
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
