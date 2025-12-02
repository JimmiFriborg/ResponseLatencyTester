export interface ModuleStats {
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
  moduleStats?: Record<string, ModuleStats>;
}

export interface ModuleDiffRow {
  moduleKey: string;
  baselineStats: ModuleStats | null;
  candidateStats: ModuleStats | null;
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
  modules: ModuleDiffRow[];
  moduleMap: Record<string, ModuleDiffRow>;
  fpsDelta: number | null;
  hardwareDiffers: boolean;
}

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

const safeMetric = (stats: ModuleStats | null | undefined, metric: keyof ModuleStats): number | null => {
  if (!stats || stats.total === 0) return null;
  return stats[metric];
};

export const computeSessionDiffData = ({
  baseline,
  candidate,
  moduleKeys
}: {
  baseline?: SessionSummary | null;
  candidate?: SessionSummary | null;
  moduleKeys?: readonly string[];
}): SessionDiffData | null => {
  if (!baseline || !candidate) return null;
  const baselineKeys = Object.keys(baseline.moduleStats || {});
  const candidateKeys = Object.keys(candidate.moduleStats || {});
  const keys = moduleKeys || Array.from(new Set([...baselineKeys, ...candidateKeys]));
  const uniqueModuleKeys = keys.sort((a, b) => a.localeCompare(b));
  const modules: ModuleDiffRow[] = uniqueModuleKeys.map((moduleKey) => {
    const baselineStats = (baseline.moduleStats || {})[moduleKey] || null;
    const candidateStats = (candidate.moduleStats || {})[moduleKey] || null;
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
      moduleKey,
      baselineStats,
      candidateStats,
      delta,
      fpsDelta,
      hardwareDiff: hardwareDiffers
        ? { baseline: baseline.hardwareSummary || null, candidate: candidate.hardwareSummary || null }
        : null
    };
  });
  return {
    baseline,
    candidate,
    modules,
    moduleMap: modules.reduce<Record<string, ModuleDiffRow>>((acc, row) => {
      acc[row.moduleKey] = row;
      return acc;
    }, {}),
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
  if (Array.isArray(diffData.modules) && diffData.modules.length === 0) {
    return { status: 'error', message: 'No comparable module measurements were detected between the selected sessions.' };
  }
  return { status: 'ready', message: '' };
};

export default {
  encodeExecutionKey,
  decodeExecutionKey,
  computeSessionDiffData,
  deriveSessionDiffStatus
};
