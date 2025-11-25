import React from 'react';

interface PrintLayoutProps {
  title: string;
  summary: string;
  children: React.ReactNode;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ title, summary, children }) => (
  <div className="print-layout">
    <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: 8, marginBottom: 12 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      <p style={{ margin: '6px 0 0 0', color: '#475569' }}>{summary}</p>
    </header>
    <div>{children}</div>
    <footer style={{ borderTop: '1px solid #e2e8f0', marginTop: 12, paddingTop: 8, fontSize: 12, color: '#475569' }}>
      Printed output is normalized for predictable spacing and page breaks.
    </footer>
  </div>
);

export default PrintLayout;
