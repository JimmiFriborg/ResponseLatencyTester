import React from 'react';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { useHashRoute } from '../src/routing/useHashRoute';

describe('hash routing', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  afterEach(() => cleanup());

  const Probe: React.FC = () => {
    const [view] = useHashRoute();
    return <div data-testid="view">{view}</div>;
  };

  it('normalizes empty hashes to #execution', async () => {
    render(<Probe />);
    await waitFor(() => expect(window.location.hash).toBe('#execution'));
    expect(screen.getByTestId('view').textContent).toBe('execution');
  });

  it('corrects unknown hashes back to a valid view', async () => {
    window.location.hash = '#unknown';
    render(<Probe />);
    await waitFor(() => expect(window.location.hash).toBe('#execution'));
    expect(screen.getByTestId('view').textContent).toBe('execution');
  });

  it('accepts the canonical #devices hash', async () => {
    window.location.hash = '#devices';
    render(<Probe />);
    await waitFor(() => expect(window.location.hash).toBe('#devices'));
    expect(screen.getByTestId('view').textContent).toBe('devices');
  });

  it('redirects legacy #hardware hashes to #devices', async () => {
    window.location.hash = '#hardware';
    render(<Probe />);
    await waitFor(() => expect(window.location.hash).toBe('#devices'));
    expect(screen.getByTestId('view').textContent).toBe('devices');
  });
});
