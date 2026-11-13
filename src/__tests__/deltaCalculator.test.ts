import { describe, it, expect } from 'vitest';
import { computePeriodDelta, formatPercent } from '../utils/deltaCalculator';

describe('Delta Calculator Utility', () => {
  it('correctly calculates positive period-over-period SLA improvement', () => {
    const res = computePeriodDelta(99.95, 99.88);
    expect(res.delta).toBe(0.07);
    expect(res.isPositive).toBe(true);
    expect(res.formatted).toBe('+0.07%');
    expect(res.statusClass).toContain('emerald');
  });

  it('correctly calculates negative period-over-period SLA drop', () => {
    const res = computePeriodDelta(99.80, 99.95);
    expect(res.delta).toBe(-0.15);
    expect(res.isPositive).toBe(false);
    expect(res.formatted).toBe('-0.15%');
    expect(res.statusClass).toContain('rose');
  });

  it('correctly handles zero delta baseline', () => {
    const res = computePeriodDelta(99.90, 99.90);
    expect(res.delta).toBe(0);
    expect(res.isZero).toBe(true);
    expect(res.formatted).toBe('0.00%');
  });

  it('formats percentages to 2 decimal places', () => {
    expect(formatPercent(99.91234)).toBe('99.91%');
    expect(formatPercent(100)).toBe('100.00%');
  });
});

