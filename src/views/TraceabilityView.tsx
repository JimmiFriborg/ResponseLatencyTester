import React from 'react';
import { ExecutionSession } from '../types';
import { HardwareProfile } from '../domain/hardwareNormalization';

interface TraceabilityViewProps {
  sessions: ExecutionSession[];
  profiles: HardwareProfile[];
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({ sessions, profiles }) => (
  <div className="grid">
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Hardware Traceability</h2>
      <p style={{ color: '#475569' }}>
        Terminology is simplified: the former hardware bank/devices concept is now a Hardware Library, and execution linkage is
        expressed as hardware traceability.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Execution</th>
            <th>Hardware Profile</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const profile = profiles.find((p) => p.id === session.hardwareProfileId);
            return (
              <tr key={`${session.testCaseId}::${session.executionId}`}>
                <td>{session.name}</td>
                <td>{profile ? profile.name : 'Unassigned'}</td>
                <td>{profile?.notes || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default TraceabilityView;
