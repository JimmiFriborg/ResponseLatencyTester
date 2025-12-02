import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import ComparisonView from '../src/views/ComparisonView';
import { ExecutionSession } from '../src/types';

const buildSession = (id: string, name: string, samples: number[]): ExecutionSession => ({
  testCaseId: id,
  executionId: `${id}-run`,
  name,
  hardwareProfileId: 'rig-a',
  latencies: [
    {
      moduleUnderTest: 'Input module',
      samples,
      stats: {
        min: Math.min(...samples),
        avg: samples.reduce((acc, value) => acc + value, 0) / samples.length,
        max: Math.max(...samples),
        total: samples.length
      },
      warnings: []
    }
  ],
  datasetSource: 'manual-entry',
  fps: 60
});

describe('ComparisonView integration', () => {
  it('hydrates queued selection and renders compare panel once session data is available', async () => {
    const baseline = buildSession('case-1', 'Baseline Execution', [10, 12, 14]);
    const candidate = buildSession('case-2', 'Candidate Execution', [12, 14, 16]);

    const Harness: React.FC = () => {
      const [sessions, setSessions] = React.useState<ExecutionSession[]>([]);
      const [queue, setQueue] = React.useState<string[]>([]);
      const [mode, setMode] = React.useState<'full' | 'simple-tags'>('full');

      return (
        <div>
          <button onClick={() => setSessions([baseline, candidate])}>Load session data</button>
          <ComparisonView
            sessions={sessions}
            queue={queue}
            mode={mode}
            onUpdateQueue={setQueue}
            onUpdateMode={setMode}
          />
        </div>
      );
    };

    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByText(/Select a baseline and candidate dataset/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /load session data/i }));

    await waitFor(() => {
      expect(screen.getByText(/Baseline Execution · case-1-run/i)).toBeInTheDocument();
      expect(screen.getByText(/Candidate Execution · case-2-run/i)).toBeInTheDocument();
    });
  });
});
