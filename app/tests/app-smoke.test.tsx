import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../src/App';

describe('app shell', () => {
  it('renders navigation with visible requirements entry and report layout', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Requirements/i })).toBeInTheDocument();
    expect(screen.getByText(/Hardware Latency Tester v4.0/)).toBeInTheDocument();
  });
});
