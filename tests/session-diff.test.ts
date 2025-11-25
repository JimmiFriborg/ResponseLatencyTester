import { describe, expect, it } from 'vitest';
import { computeSessionDiffData, decodeExecutionKey, deriveSessionDiffStatus, encodeExecutionKey } from '../src/domain/sessionDiff';

const baseline = {
  testCaseId: 'case-a',
  executionId: 'run-1',
  testCaseName: 'Case A',
  executionName: 'Run 1',
  fps: 60,
  hardwareSummary: 'Rig A',
  axisStats: {
    'X+': { min: 10, avg: 12, max: 14, total: 4 },
    'Y-': { min: 20, avg: 22, max: 24, total: 4 }
  }
};

const candidate = {
  testCaseId: 'case-b',
  executionId: 'run-1',
  testCaseName: 'Case B',
  executionName: 'Run 1',
  fps: 58,
  hardwareSummary: 'Rig B',
  axisStats: {
    'X+': { min: 11, avg: 13, max: 15, total: 4 },
    'Y-': { min: 18, avg: 20, max: 21, total: 4 }
  }
};

describe('session diff utilities', () => {
  it('computes axis deltas for baseline and candidate summaries', () => {
    const diff = computeSessionDiffData({ baseline, candidate, axisKeys: ['X+', 'Y-'], axes: ['X', 'Y'] });

    expect(diff?.axes).toHaveLength(2);
    const xAxis = diff?.axisMap['X+'];
    expect(xAxis?.delta.min).toBeCloseTo(1);
    expect(xAxis?.delta.avg).toBeCloseTo(1);
    expect(diff?.fpsDelta).toBeCloseTo(-2);
    expect(diff?.hardwareDiffers).toBe(true);
  });

  it('derives ready status when both selections and diff data exist', () => {
    const selection = {
      baseline: decodeExecutionKey(encodeExecutionKey('case-a', 'run-1')),
      candidate: decodeExecutionKey(encodeExecutionKey('case-b', 'run-2'))
    };
    const diffData = {
      axes: [{ axisKey: 'X+' }]
    } as any;

    const status = deriveSessionDiffStatus({
      selection,
      diffData,
      baselineAvailable: true,
      candidateAvailable: true,
      hasExecutions: true
    });

    expect(status.status).toBe('ready');
    expect(status.message).toBe('');
  });

  it('surfaces actionable errors when selections disappear', () => {
    const selection = {
      baseline: { testCaseId: 'missing', executionId: 'lost' },
      candidate: { testCaseId: 'case-b', executionId: 'run-2' }
    };

    const status = deriveSessionDiffStatus({
      selection,
      diffData: null,
      baselineAvailable: false,
      candidateAvailable: true,
      hasExecutions: true
    });

    expect(status.status).toBe('error');
    expect(status.message).toMatch(/baseline session is no longer available/i);
  });
});
