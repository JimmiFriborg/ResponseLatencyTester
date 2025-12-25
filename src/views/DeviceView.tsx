import React from 'react';
import { DeviceProfile, buildTraceabilitySummary, normalizeDeviceProfile } from '../domain/deviceNormalization';

interface DeviceViewProps {
  profiles: DeviceProfile[];
}

export const DeviceView: React.FC<DeviceViewProps> = ({ profiles }) => {
  const library = profiles.map(normalizeDeviceProfile);
  const traceability = buildTraceabilitySummary(library);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Device Library</h2>
        <p style={{ color: '#475569' }}>Curate device profiles with clear tag, firmware, and accessory context.</p>
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
        <h3 style={{ marginTop: 0 }}>Device Traceability</h3>
        <p style={{ color: '#475569' }}>Each execution references a device profile, so audit history stays intact.</p>
        <p>{traceability}</p>
      </div>
    </div>
  );
};

export default DeviceView;
