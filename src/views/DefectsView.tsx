import React, { useEffect, useState } from 'react';

interface DefectsViewProps {
  canonicalPath: string;
}

interface DefectRecord {
  id: string;
  title: string;
  status: string;
}

export const DefectsView: React.FC<DefectsViewProps> = ({ canonicalPath }) => {
  const [defects, setDefects] = useState<DefectRecord[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setStatus(`Fetching canonical register from ${canonicalPath}…`);
    fetch(canonicalPath)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error('Unable to load defect register'))))
      .then((json) => {
        const list = Array.isArray(json.defects) ? json.defects : [];
        setDefects(list);
        setStatus(`Canonical defect register: ${canonicalPath}`);
      })
      .catch((error) => setStatus(error.message));
  }, [canonicalPath]);

  return (
    <div className="grid">
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Defects</h2>
        <p style={{ color: '#475569' }}>
          The UI and fetch path are aligned: {canonicalPath}. Exporting uses the exact same canonical reference.
        </p>
        <p>{status}</p>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {defects.map((defect) => (
              <tr key={defect.id}>
                <td>{defect.id}</td>
                <td>{defect.title}</td>
                <td>{defect.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DefectsView;
