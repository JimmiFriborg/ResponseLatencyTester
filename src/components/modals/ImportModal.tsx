import React, { useState } from 'react';

interface ImportModalProps {
  title: string;
  description: string;
  placeholder: string;
  onClose: () => void;
  onSubmit: (content: string) => void;
  troubleshooting?: string[];
}

export const ImportModal: React.FC<ImportModalProps> = ({ title, description, placeholder, onClose, onSubmit, troubleshooting }) => {
  const [value, setValue] = useState('');

  return (
    <div className="modal-backdrop" role="dialog" aria-modal>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <p style={{ color: '#475569' }}>{description}</p>
        <textarea
          style={{ width: '100%', minHeight: 160, marginBottom: 12 }}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit(value)} className="active">Import</button>
        </div>
        {troubleshooting && troubleshooting.length > 0 ? (
          <div className="notice" style={{ marginTop: 12 }}>
            <strong>Troubleshooting tips</strong>
            <ul>
              {troubleshooting.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImportModal;
