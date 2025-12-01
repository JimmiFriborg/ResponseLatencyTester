export interface StatsResult {
  min: number | null;
  avg: number | null;
  max: number | null;
  total: number;
}

export const computeStats = (values: number[]): StatsResult => {
  if (!values || values.length === 0) {
    return { min: null, avg: null, max: null, total: 0 };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((acc, value) => acc + value, 0);
  const avg = sum / values.length;
  return { min, avg, max, total: values.length };
};

export const formatMs = (value: number | null, suffix = ' ms'): string => {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value.toFixed(2)}${suffix}`;
};

export const describeDelta = (value: number | null, suffix = ' ms'): string => {
  if (value == null || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}${suffix}`;
};
