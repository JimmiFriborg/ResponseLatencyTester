import { describe, expect, it } from 'vitest';
import { computeSessionDiffData, SessionDiffData } from '../src/domain/sessionDiff';

describe('computeSessionDiffData', () => {
  it('returns null when missing inputs', () => {
    const result = computeSessionDiffData({ baseline: null, candidate: null });
    expect(result).toBeNull();
  });

  it('produces diff rows when provided baseline and candidate', () => {
    const baseline: SessionDiffData['baseline'] = {
      testCaseId: 'case-1',
      executionId: 'run-1',
      testCaseName: 'Case 1',
      executionName: 'Run 1',
      moduleStats: { foo: { min: 1, avg: 2, max: 3, total: 3 } },
      fps: 60,
      deviceSummary: 'Rig A'
    };
    const candidate: SessionDiffData['candidate'] = {
      testCaseId: 'case-2',
      executionId: 'run-2',
      testCaseName: 'Case 2',
      executionName: 'Run 2',
      moduleStats: { foo: { min: 2, avg: 3, max: 4, total: 3 } },
      fps: 62,
      deviceSummary: 'Rig B'
    };

    const diff = computeSessionDiffData({ baseline, candidate });
    expect(diff?.modules[0].delta.avg).toBe(1);
    expect(diff?.deviceDiffers).toBe(true);
  });
});
