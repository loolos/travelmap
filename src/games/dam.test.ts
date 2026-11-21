import { describe, expect, it } from 'vitest';
import { CAPACITY, simulateDam } from './dam';

describe('dam model', () => {
  it('without a dam the river floods every summer and runs short in spring', () => {
    const r = simulateDam(6, false);
    expect(r.floodMonths).toBeGreaterThanOrEqual(6);
    expect(r.dryMonths).toBeGreaterThan(0);
    expect(r.verdict).toBe('both');
  });

  it('a steady middle release carries the farms through both drought years', () => {
    const r = simulateDam(6.5);
    expect(r.verdict).toBe('ok');
    expect(r.months.every((m) => m.storage >= 0 && m.storage <= CAPACITY)).toBe(true);
  });

  it('releasing too much empties the lake in the drought', () => {
    const r = simulateDam(9);
    expect(r.verdict).toBe('dry');
    expect(r.months.at(-1)!.storage).toBeLessThan(1);
  });

  it('releasing too little fills the lake and the spill floods downstream', () => {
    const r = simulateDam(4);
    expect(r.spilled).toBeGreaterThan(0);
    expect(r.verdict).toBe('flood');
  });

  it('keeps the water balance', () => {
    const r = simulateDam(7);
    const inflow = r.months.reduce((s, m) => s + m.inflow, 0);
    const out = r.months.reduce((s, m) => s + m.outflow, 0);
    expect(80 + inflow - out - r.evaporated).toBeCloseTo(r.months.at(-1)!.storage, 6);
  });
});
