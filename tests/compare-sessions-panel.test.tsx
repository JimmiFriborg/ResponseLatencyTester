import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CompareSessionsSummary from '../src/components/comparison/CompareSessionsSummary';
import { SessionDiffData } from '../src/domain/sessionDiff';

describe('CompareSessionsSummary', () => {
  it('renders session titles and warnings', () => {
    const sampleDiff: SessionDiffData = {
      baseline: {
        testCaseId: 'case-1',
        executionId: 'run-1',
        testCaseName: 'Case 1',
        executionName: 'Run 1',
        datasetSource: 'manual-entry',
        fps: 60,
        deviceSummary: 'Rig A',
        moduleStats: { module: { min: 1, avg: 2, max: 3, total: 3 } }
      },
      candidate: {
        testCaseId: 'case-2',
        executionId: 'run-2',
        testCaseName: 'Case 2',
        executionName: 'Run 2',
        datasetSource: 'manual-entry',
        fps: 60,
        deviceSummary: 'Rig B',
        moduleStats: { module: { min: 1, avg: 2, max: 3, total: 3 } }
      },
      modules: [],
      moduleMap: {},
      fpsDelta: 0,
      deviceDiffers: true
    };

    render(
      <CompareSessionsSummary
        sessionDiffData={sampleDiff}
        sessionDiffState={{ status: 'ready', message: '' }}
        copyDiffStatus=""
        onOpenModal={() => undefined}
        onCopyDiff={() => undefined}
        describeDatasetSource={(value) => value || ''}
        diffAnnotations={{}}
        onAnnotateModule={() => undefined}
        formatStat={() => ''}
        formatDeltaMs={() => ''}
        getDeltaBadgeClasses={() => ''}
      />
    );

    expect(screen.getByText(/Case 1 · Run 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Device notes differ/i)).toBeInTheDocument();
  });
});
