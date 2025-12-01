import React from 'react';
import { HardwareProfile, buildTraceabilitySummary, normalizeHardwareProfile } from '../domain/hardwareNormalization';

interface HardwareViewProps {
  profiles: HardwareProfile[];
}

export const HardwareView: React.FC<HardwareViewProps> = ({ profiles }) => {
  const library = profiles.map(normalizeHardwareProfile);
  const traceability = buildTraceabilitySummary(library);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Hardware Library</h2>
        <p style={{ color: '#475569' }}>Curate profiles with clear tag, firmware, and accessory context.</p>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tag</th>
              <th>Firmware</th>
              <th>Accessories</th>
            </tr>
          </thead>
          <tbody>
            {library.map((profile) => (
              <tr key={profile.id}>
                <td>{profile.name}</td>
                <td>{profile.tagType}</td>
                <td>{profile.firmware || '—'}</td>
                <td>{profile.accessories?.join(', ') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Hardware Traceability</h3>
        <p style={{ color: '#475569' }}>Each execution references a profile, so audit history stays intact.</p>
        <p>{traceability}</p>
      </div>
    </div>
  );
};

export default HardwareView;
