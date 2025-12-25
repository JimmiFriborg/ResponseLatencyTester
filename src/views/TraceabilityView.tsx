import React from 'react';
import { ExecutionSession } from '../types';
import { DeviceProfile } from '../domain/deviceNormalization';

interface TraceabilityViewProps {
  sessions: ExecutionSession[];
  profiles: DeviceProfile[];
}

export const TraceabilityView: React.FC<TraceabilityViewProps> = ({ sessions, profiles }) => (
  <div className="grid">
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Device Traceability</h2>
      <p style={{ color: '#475569' }}>
        Terminology is simplified: the former hardware bank/devices concept is now the Device Library, and execution linkage is
        expressed as device traceability.
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Execution</th>
            <th>Device Profile</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => {
            const profileId = session.deviceProfileId || (session as any).hardwareProfileId;
            const profile = profiles.find((p) => p.id === profileId);
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
