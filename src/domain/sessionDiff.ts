export interface AxisStats {
  min: number;
  avg: number;
  max: number;
  total: number;
}

export interface SessionSummary {
  testCaseId: string;
  executionId: string;
  testCaseName: string;
  executionName: string;
  datasetSource?: string;
  fps?: number | null;
  hardwareSummary?: string | null;
  axisStats?: Record<string, AxisStats>;
}

export interface AxisDiffRow {
  axisKey: string;
  baselineStats: AxisStats | null;
  candidateStats: AxisStats | null;
  delta: {
    min: number | null;
    avg: number | null;
    max: number | null;
  };
  fpsDelta: number | null;
  hardwareDiff: { baseline: string | null; candidate: string | null } | null;
}

export interface SessionDiffData {
  baseline: SessionSummary;
  candidate: SessionSummary;
  axes: AxisDiffRow[];
  axisMap: Record<string, AxisDiffRow>;
  axisAggregate: Record<string, { plus: AxisDiffRow | null; minus: AxisDiffRow | null }>;
  fpsDelta: number | null;
  hardwareDiffers: boolean;
}

export const DEFAULT_AXIS_KEYS = ['X+', 'X-', 'Y+', 'Y-', 'Z+', 'Z-'] as const;
export const DEFAULT_AXES = ['X', 'Y', 'Z'] as const;

export const encodeExecutionKey = (testCaseId?: string, executionId?: string): string => {
  if (!testCaseId || !executionId) return '';
  return `${testCaseId}::${executionId}`;
};

export const decodeExecutionKey = (value?: string | null): { testCaseId: string; executionId: string } | null => {
  if (!value || typeof value !== 'string') return null;
  const [testCaseId, executionId] = value.split('::');
  if (!testCaseId || !executionId) return null;
  return { testCaseId, executionId };
};

const safeMetric = (stats: AxisStats | null | undefined, metric: keyof AxisStats): number | null => {
  if (!stats || stats.total === 0) return null;
  return stats[metric];
};

export const computeSessionDiffData = ({
  baseline,
  candidate,
  axisKeys = DEFAULT_AXIS_KEYS,
  axes = DEFAULT_AXES
}: {
  baseline?: SessionSummary | null;
  candidate?: SessionSummary | null;
  axisKeys?: readonly string[];
  axes?: readonly string[];
}): SessionDiffData | null => {
  if (!baseline || !candidate) return null;
  const uniqueAxisKeys = Array.from(new Set(axisKeys)).sort((a, b) => a.localeCompare(b));
  const axesRows: AxisDiffRow[] = uniqueAxisKeys.map((axisKey) => {
    const baselineStats = (baseline.axisStats || {})[axisKey] || null;
    const candidateStats = (candidate.axisStats || {})[axisKey] || null;
    const delta = {
      min:
        safeMetric(candidateStats, 'min') != null && safeMetric(baselineStats, 'min') != null
          ? (safeMetric(candidateStats, 'min') as number) - (safeMetric(baselineStats, 'min') as number)
          : null,
      avg:
        safeMetric(candidateStats, 'avg') != null && safeMetric(baselineStats, 'avg') != null
          ? (safeMetric(candidateStats, 'avg') as number) - (safeMetric(baselineStats, 'avg') as number)
          : null,
      max:
        safeMetric(candidateStats, 'max') != null && safeMetric(baselineStats, 'max') != null
          ? (safeMetric(candidateStats, 'max') as number) - (safeMetric(baselineStats, 'max') as number)
          : null
    };
    const fpsDelta = baseline.fps != null && candidate.fps != null ? candidate.fps - baseline.fps : null;
    const hardwareDiffers = (baseline.hardwareSummary || null) !== (candidate.hardwareSummary || null);
    return {
      axisKey,
      baselineStats,
      candidateStats,
      delta,
      fpsDelta,
      hardwareDiff: hardwareDiffers
        ? { baseline: baseline.hardwareSummary || null, candidate: candidate.hardwareSummary || null }
        : null
    };
  });
  const axisMap = axesRows.reduce<Record<string, AxisDiffRow>>((acc, row) => {
    acc[row.axisKey] = row;
    return acc;
  }, {});
  const axisAggregate = axes.reduce<Record<string, { plus: AxisDiffRow | null; minus: AxisDiffRow | null }>>((acc, axis) => {
    const plusKey = `${axis}+`;
    const minusKey = `${axis}-`;
    if (axisMap[plusKey] || axisMap[minusKey]) {
      acc[axis] = {
        plus: axisMap[plusKey] || null,
        minus: axisMap[minusKey] || null
      };
    }
    return acc;
  }, {});

  return {
    baseline,
    candidate,
    axes: axesRows,
    axisMap,
    axisAggregate,
    fpsDelta: baseline.fps != null && candidate.fps != null ? candidate.fps - baseline.fps : null,
    hardwareDiffers: (baseline.hardwareSummary || null) !== (candidate.hardwareSummary || null)
  };
};

export const deriveSessionDiffStatus = ({
  selection,
  diffData,
  baselineAvailable,
  candidateAvailable,
  hasExecutions
}: {
  selection?: { baseline: { testCaseId: string; executionId: string } | null; candidate: { testCaseId: string; executionId: string } | null } | null;
  diffData?: SessionDiffData | null;
  baselineAvailable: boolean;
  candidateAvailable: boolean;
  hasExecutions: boolean;
}): { status: 'idle' | 'loading' | 'ready' | 'error'; message: string } => {
  if (!selection || !selection.baseline || !selection.candidate) {
    return {
      status: 'idle',
      message: 'Select a baseline and candidate dataset to calculate differences.'
    };
  }
  if (!hasExecutions) {
    return { status: 'loading', message: 'Loading session data…' };
  }
  if (!baselineAvailable && !candidateAvailable) {
    return {
      status: 'error',
      message: 'Selected sessions are no longer available. Choose a new baseline and candidate.'
    };
  }
  if (!baselineAvailable) {
    return { status: 'error', message: 'The baseline session is no longer available. Pick another dataset.' };
  }
  if (!candidateAvailable) {
    return { status: 'error', message: 'The candidate session is no longer available. Pick another dataset.' };
  }
  if (!diffData) {
    return { status: 'loading', message: 'Calculating session deltas…' };
  }
  if (Array.isArray(diffData.axes) && diffData.axes.length === 0) {
    return { status: 'error', message: 'No comparable axis measurements were detected between the selected sessions.' };
  }
  return { status: 'ready', message: '' };
};

export default {
  DEFAULT_AXIS_KEYS,
  DEFAULT_AXES,
  encodeExecutionKey,
  decodeExecutionKey,
  computeSessionDiffData,
  deriveSessionDiffStatus
};
