import { describe, expect, it } from 'vitest';
import { heightFraction, optimalShares, simulate } from './pyramid';

describe('pyramid model', () => {
  it('balanced crew finishes in about 20 years', () => {
    const r = simulate(optimalShares());
    expect(r.logisticsFactor).toBeCloseTo(1, 2);
    expect(r.years).toBeGreaterThan(19);
    expect(r.years).toBeLessThan(22);
  });
  it('the slowest stage is the bottleneck', () => {
    const r = simulate({ quarry: 10, transport: 40, build: 40, logistics: 15 });
    expect(r.bottleneck).toBe('quarry');
  });
  it('too little logistics slows everything', () => {
    const balanced = simulate(optimalShares());
    const starved = simulate({ ...optimalShares(), logistics: 0.001 });
    expect(starved.bottleneck).toBe('logistics');
    expect(starved.years).toBeGreaterThan(balanced.years * 3);
  });
  it('no builders means it never finishes', () => {
    expect(simulate({ quarry: 1, transport: 1, build: 0, logistics: 1 }).years).toBe(Infinity);
  });
  it('half the volume is reached at ~21% of the height', () => {
    expect(heightFraction(0.5)).toBeCloseTo(0.206, 2);
    expect(heightFraction(1)).toBe(1);
  });
});
