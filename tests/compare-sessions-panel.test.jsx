import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CompareSessionsSummary from '../release-candidates/js/compare-sessions-panel.jsx';

afterEach(() => cleanup());

const buildProps = (overrides = {}) => {
  const overrideDiff = overrides.sessionDiffData;
  const overrideState = overrides.sessionDiffState;

  const sessionDiffData = overrideDiff === null ? null : {
    baseline: {
      testCaseName: 'Baseline Case',
      executionName: 'Run 1',
      datasetSource: 'manual-entry',
      fps: 60,
      hardwareSummary: 'Rig A'
    },
    candidate: {
      testCaseName: 'Candidate Case',
      executionName: 'Run 2',
      datasetSource: 'manual-import',
      fps: 58,
      hardwareSummary: 'Rig B'
    },
    axes: [
      {
        axisKey: 'X+',
        baselineStats: { min: 10, avg: 12, max: 13, total: 3 },
        candidateStats: { min: 11, avg: 13, max: 14, total: 3 },
        delta: { min: 1, avg: 1, max: 1 }
      }
    ],
    fpsDelta: -2,
    hardwareDiffers: true,
    ...(overrideDiff || {})
  };

  const sessionDiffState = {
    status: 'ready',
    message: '',
    ...(overrideState || {})
  };

  return {
    sessionDiffData,
    sessionDiffState,
    copyDiffStatus: '',
    onOpenModal: vi.fn(),
    onCopyDiff: vi.fn(),
    describeDatasetSource: () => 'Manual Session',
    diffAnnotations: {},
    onAnnotateAxis: vi.fn(),
    formatStat: () => '10.00ms',
    formatDeltaMs: () => '+1.00ms',
    getDeltaBadgeClasses: () => 'bg-gray-100 text-gray-800',
    Icon: ({ name }) => <span data-icon={name} />,
    ...overrides
  };
};

describe('CompareSessionsSummary', () => {
  it('renders baseline and candidate details when sessions are ready', () => {
    const props = buildProps();
    render(<CompareSessionsSummary {...props} />);

    expect(screen.getByText(/Baseline Case · Run 1/)).toBeInTheDocument();
    expect(screen.getByText(/Candidate Case · Run 2/)).toBeInTheDocument();
    expect(screen.getByText(/Add note/)).toBeInTheDocument();
  });

  it('surfaces loading or error messaging when data is unavailable', async () => {
    const user = userEvent.setup();
    const props = buildProps({
      sessionDiffData: null,
      sessionDiffState: { status: 'error', message: 'Baseline missing.' }
    });
    render(
      <CompareSessionsSummary
        {...props}
      />
    );

    expect(screen.getByText(/Baseline missing/i)).toBeInTheDocument();
    const chooseButton = screen.getByRole('button', { name: /choose sessions/i });
    await user.click(chooseButton);
    expect(props.onOpenModal).toHaveBeenCalled();
  });
});
