import { computeStats, StatsResult } from './statistics';

export interface MarkerEvent {
  name: string;
  timestampMs: number;
  axis?: string;
  color?: string;
  comment?: string;
}

export interface AxisLatency {
  axis: string;
  samples: number[];
  stats: StatsResult;
  warnings: string[];
}

const START_MARKERS = ['tagoff', 'input', 'press'];
const END_MARKERS = ['motionstart', 'output', 'response'];

const extractAxisFromText = (text: string): string => {
  const match = text.match(/([XYZ])(\+|-)?/i);
  if (!match) return 'Unspecified';
  const [, axis, direction] = match;
  return direction ? `${axis.toUpperCase()}${direction}` : axis.toUpperCase();
};

export const deriveAxisLatencies = (markers: MarkerEvent[]): AxisLatency[] => {
  const sorted = markers.filter((m) => m.timestampMs != null).sort((a, b) => a.timestampMs - b.timestampMs);
  const pendingStart: Record<string, MarkerEvent | null> = {};
  const byAxis: Record<string, number[]> = {};
  const warnings: string[] = [];

  for (const marker of sorted) {
    const axis = marker.axis || extractAxisFromText(marker.name);
    const lower = marker.name.toLowerCase();
    if (START_MARKERS.some((token) => lower.includes(token))) {
      pendingStart[axis] = marker;
      continue;
    }
    if (END_MARKERS.some((token) => lower.includes(token))) {
      if (!pendingStart[axis]) {
        warnings.push(`Found ${marker.name} without a preceding start marker on ${axis}.`);
        continue;
      }
      const latency = marker.timestampMs - (pendingStart[axis] as MarkerEvent).timestampMs;
      byAxis[axis] = byAxis[axis] || [];
      byAxis[axis].push(latency);
      pendingStart[axis] = null;
    }
  }

  return Object.entries(byAxis).map(([axis, samples]) => ({
    axis,
    samples,
    stats: computeStats(samples),
    warnings
  }));
};
