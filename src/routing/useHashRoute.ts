import { useEffect, useState } from 'react';
import { ViewKey } from '../types';

const DEFAULT_VIEW: ViewKey = 'execution';
const VALID_VIEWS: ViewKey[] = ['execution', 'devices', 'comparison', 'traceability', 'requirements', 'report', 'defects'];
const LEGACY_VIEW_ALIASES: Record<string, ViewKey> = {
  hardware: 'devices',
  device: 'devices'
};

const normalizeHash = (hash: string): ViewKey => {
  const normalized = hash.replace('#', '').toLowerCase();
  const alias = LEGACY_VIEW_ALIASES[normalized];
  if (alias) return alias;
  return VALID_VIEWS.includes(normalized as ViewKey) ? (normalized as ViewKey) : DEFAULT_VIEW;
};

export const useHashRoute = (): [ViewKey, (view: ViewKey) => void] => {
  const [view, setView] = useState<ViewKey>(() => normalizeHash(window.location.hash || ''));

  useEffect(() => {
    const raw = window.location.hash || '';
    const normalized = normalizeHash(raw);
    const sanitized = raw.replace('#', '').toLowerCase();
    if (!raw || sanitized !== normalized) {
      window.location.hash = `#${normalized}`;
      setView(normalized);
    }
  }, []);

  useEffect(() => {
    const handler = () => setView(normalizeHash(window.location.hash || ''));
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const update = (next: ViewKey) => {
    window.location.hash = `#${next}`;
    setView(next);
  };

  return [view, update];
};
