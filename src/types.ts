import { ModuleLatency } from './domain/latencyCalculations';
import { RequirementTemplate } from './domain/requirements';
import { SessionDiffData } from './domain/sessionDiff';

export type ViewKey =
  | 'execution'
  | 'hardware'
  | 'comparison'
  | 'traceability'
  | 'requirements'
  | 'report'
  | 'defects';

export interface ExecutionSession {
  testCaseId: string;
  executionId: string;
  name: string;
  hardwareProfileId: string;
  latencies: ModuleLatency[];
  datasetSource: 'manual-entry' | 'manual-import' | 'automation-report';
  fps: number;
  notes?: string;
}

export interface RequirementTemplateState {
  templates: RequirementTemplate[];
  unsavedChanges: boolean;
  lastReviewedRevision: number;
}

export interface ComparisonState {
  queue: string[];
  mode: 'full' | 'simple-tags';
  diffData?: SessionDiffData | null;
}
