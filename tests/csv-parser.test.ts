import { describe, expect, it } from 'vitest';
import { DEFAULT_COLUMN_MAPPING, parseCsv, parseTimecodeToMs } from '../src/domain/csvParser';

describe('csv parser', () => {
  it('flags missing required columns with actionable hints', () => {
    const { issues } = parseCsv('Marker,Note\nA,B');
    const error = issues.find((issue) => issue.type === 'error');
    expect(error?.message).toMatch(/expected/i);
  });

  it('parses timecodes into milliseconds and surfaces missing markers', () => {
    const csv = `Marker Name,Color,Timecode,Comment\nTagOff,Red,00:00:01:00,\nMotionStart,Blue,00:00:01:20,`;
    const result = parseCsv(csv, DEFAULT_COLUMN_MAPPING);
    expect(result.records[0].timestampMs).toBe(parseTimecodeToMs('00:00:01:00'));
    const warning = result.issues.find((issue) => issue.type === 'warning');
    expect(warning?.message).toMatch(/Expected marker names/);
  });
});
