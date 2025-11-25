import React from 'react';
import PrintLayout from '../components/PrintLayout';
import { ExecutionSession } from '../types';

interface ReportViewProps {
  sessions: ExecutionSession[];
}

export const ReportView: React.FC<ReportViewProps> = ({ sessions }) => (
  <div className="grid">
    <div className="card no-print">
      <h2 style={{ marginTop: 0 }}>Report</h2>
      <p style={{ color: '#475569' }}>
        A lightweight print/report layout keeps spacing predictable. Use the browser print dialog for PDFs.
      </p>
    </div>
    <PrintLayout
      title="Latency Execution Report"
      summary="Compiled from the current workspace. Metrics are normalized before printing to avoid layout drift."
    >
      <table className="table">
        <thead>
          <tr>
            <th>Execution</th>
            <th>Axes</th>
            <th>FPS</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={`${session.testCaseId}::${session.executionId}`}>
              <td>{session.name}</td>
              <td>{session.latencies.map((latency) => `${latency.axis}: ${latency.stats.avg?.toFixed(2) ?? '—'}ms`).join(', ')}</td>
              <td>{session.fps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PrintLayout>
  </div>
);

export default ReportView;
