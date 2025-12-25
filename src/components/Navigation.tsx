import React from 'react';
import { ViewKey } from '../types';

interface NavigationProps {
  active: ViewKey;
  onNavigate: (view: ViewKey) => void;
  comparisonMode: 'full' | 'simple-tags';
}

const NAV_ITEMS: { key: ViewKey; label: string }[] = [
  { key: 'execution', label: 'Execution' },
  { key: 'devices', label: 'Device Library' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'traceability', label: 'Device Traceability' },
  { key: 'requirements', label: 'Requirements' },
  { key: 'report', label: 'Report' },
  { key: 'defects', label: 'Defects' }
];

export const Navigation: React.FC<NavigationProps> = ({ active, onNavigate, comparisonMode }) => (
  <div className="navbar">
    {NAV_ITEMS.map((item) => (
      <button key={item.key} className={active === item.key ? 'active' : ''} onClick={() => onNavigate(item.key)}>
        {item.label}
      </button>
    ))}
    <span className="badge" title="Simple-tag mode disables comparison">Comparison mode: {comparisonMode}</span>
  </div>
);

export default Navigation;
