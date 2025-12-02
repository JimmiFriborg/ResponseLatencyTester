import { describe, expect, it } from 'vitest';
import { deriveModuleLatencies } from '../src/domain/latencyCalculations';

describe('module-aware latency derivation', () => {
  it('uses yellow markers to set the active module under test', () => {
    const markers = [
      { name: 'Metadata', color: 'Yellow', comment: 'Input pipeline', timestampMs: 0 },
      { name: 'TagOff', timestampMs: 5 },
      { name: 'MotionStart', timestampMs: 55 },
      { name: 'Metadata', color: 'Yellow', comment: 'Output path', timestampMs: 60 },
      { name: 'TagOff', timestampMs: 65 },
      { name: 'MotionStart', timestampMs: 115 }
    ];

    const latencies = deriveModuleLatencies(markers);

    expect(latencies).toHaveLength(2);
    const inputModule = latencies.find((latency) => latency.moduleUnderTest === 'Input pipeline');
    const outputModule = latencies.find((latency) => latency.moduleUnderTest === 'Output path');
    expect(inputModule?.samples).toEqual([50]);
    expect(outputModule?.samples).toEqual([50]);
  });

  it('falls back to marker comments when no yellow metadata is available', () => {
    const markers = [
      { name: 'TagOff X+', timestampMs: 0, comment: 'Legacy axis path' },
      { name: 'MotionStart X+', timestampMs: 20 }
    ];

    const [latency] = deriveModuleLatencies(markers);
    expect(latency.moduleUnderTest).toBe('Legacy axis path');
    expect(latency.samples).toEqual([20]);
  });
});
