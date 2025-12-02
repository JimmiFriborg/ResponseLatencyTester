import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import CardsDataView, { AxisCard, AxisSelection, UniqueSelectedAxes } from '../src/components/comparison/CardsDataView';

describe('CardsDataView', () => {
  const baseCards: AxisCard[] = [
    {
      key: 'case-1-run-a-x+',
      testCaseName: 'Case 1',
      executionName: 'Run A',
      axis: 'X',
      direction: '+',
      stats: { min: 10, avg: 15.25, max: 22.1, total: 5 },
      distanceLabel: '500mm'
    },
    {
      key: 'case-1-run-a-y-',
      testCaseName: 'Case 1',
      executionName: 'Run A',
      axis: 'Y',
      direction: '-',
      stats: { min: 8, avg: 9.9, max: 14.5, total: 5 }
    }
  ];

  const selections: AxisSelection[] = [
    { axis: 'X', direction: '+' },
    { axis: 'Y', direction: '-' },
    { axis: 'X', direction: '+' }
  ];

  it('deduplicates selected axes via UniqueSelectedAxes', () => {
    const unique = UniqueSelectedAxes(selections);
    expect(unique).toHaveLength(2);
    expect(unique.map((axis) => `${axis.axis}${axis.direction}`)).toEqual(['X+', 'Y-']);
  });

  it('renders cards without crashing for common comparison state', async () => {
    const user = userEvent.setup();
    const onFocusAxis = vi.fn();

    render(<CardsDataView cards={baseCards} selectedAxes={selections} onFocusAxis={onFocusAxis} />);

    expect(screen.getByLabelText('Cards Data View')).toBeInTheDocument();
    expect(screen.getByTestId('unique-axes-count').textContent).toContain('2 unique axes');
    expect(screen.getAllByText('Case 1')).toHaveLength(2);
    expect(screen.getByText(/X \(\+\)/)).toBeInTheDocument();
    expect(screen.getAllByText(/Avg:/)).toHaveLength(2);

    await user.click(screen.getAllByText('Focus card')[0]);
    expect(onFocusAxis).toHaveBeenCalledWith('X+');
  });
});
