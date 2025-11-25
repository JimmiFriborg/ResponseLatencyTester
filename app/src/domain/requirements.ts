import { StatsResult } from './statistics';

export interface RequirementTemplate {
  id: string;
  name: string;
  description: string;
  thresholds: RequirementThreshold[];
  revision: number;
}

export interface RequirementThreshold {
  axis: string;
  maxMs: number;
  label?: string;
}

export interface RequirementEvaluation {
  axis: string;
  measured: StatsResult;
  threshold: RequirementThreshold;
  passed: boolean;
}

export const evaluateRequirements = (
  statsByAxis: Record<string, StatsResult>,
  template: RequirementTemplate
): RequirementEvaluation[] =>
  template.thresholds.map((threshold) => {
    const measured = statsByAxis[threshold.axis] || { min: null, avg: null, max: null, total: 0 };
    const value = measured.max ?? measured.avg ?? measured.min;
    const passed = value == null ? false : value <= threshold.maxMs;
    return { axis: threshold.axis, measured, threshold, passed };
  });

export const describeTemplateRevision = (template: RequirementTemplate): string =>
  `Rev ${template.revision} · ${template.thresholds.length} thresholds`;
