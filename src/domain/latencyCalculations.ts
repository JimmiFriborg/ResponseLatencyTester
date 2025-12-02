import { computeStats, StatsResult } from './statistics';

export interface MarkerEvent {
  name: string;
  timestampMs: number;
  axis?: string;
  color?: string;
  comment?: string;
  moduleUnderTest?: string;
}

export interface ModuleLatency {
  moduleUnderTest: string;
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

const deriveModuleKey = (marker: MarkerEvent, currentModule: string): string => {
  if (marker.color && marker.color.toLowerCase().includes('yellow')) {
    const fromComment = marker.comment?.trim();
    const fromName = marker.name?.trim();
    return fromComment?.length ? fromComment : fromName || currentModule || 'Unspecified module';
  }
  if (marker.moduleUnderTest) return marker.moduleUnderTest;
  if (marker.comment?.trim()) return marker.comment.trim();
  if (currentModule && currentModule !== 'Unspecified module') return currentModule;
  if (marker.axis) return marker.axis;
  return currentModule || extractAxisFromText(marker.name);
};

export const deriveModuleLatencies = (markers: MarkerEvent[]): ModuleLatency[] => {
  const sorted = markers.filter((m) => m.timestampMs != null).sort((a, b) => a.timestampMs - b.timestampMs);
  const pendingStart: Record<string, MarkerEvent | null> = {};
  const byModule: Record<string, number[]> = {};
  const warnings: string[] = [];
  let currentModule = '';

  for (const marker of sorted) {
    currentModule = deriveModuleKey(marker, currentModule);
    const moduleUnderTest = currentModule || 'Unspecified module';
    const lower = marker.name.toLowerCase();
    if (START_MARKERS.some((token) => lower.includes(token))) {
      pendingStart[moduleUnderTest] = { ...marker, moduleUnderTest };
      continue;
    }
    if (END_MARKERS.some((token) => lower.includes(token))) {
      if (!pendingStart[moduleUnderTest]) {
        warnings.push(`Found ${marker.name} without a preceding start marker for ${moduleUnderTest}.`);
        continue;
      }
      const latency = marker.timestampMs - (pendingStart[moduleUnderTest] as MarkerEvent).timestampMs;
      byModule[moduleUnderTest] = byModule[moduleUnderTest] || [];
      byModule[moduleUnderTest].push(latency);
      pendingStart[moduleUnderTest] = null;
    }
  }

  return Object.entries(byModule).map(([moduleUnderTest, samples]) => ({
    moduleUnderTest,
    samples,
    stats: computeStats(samples),
    warnings
  }));
};

export const deriveAxisLatencies = deriveModuleLatencies;
