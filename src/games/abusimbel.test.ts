import { describe, expect, it } from 'vitest';
import { beamReach, dayOfYear, daysFromFestival, SANCTUARY } from './abusimbel';

describe('abu simbel sun festival', () => {
  it('counts days of the year', () => {
    expect(dayOfYear(1, 1)).toBe(1);
    expect(dayOfYear(2, 22)).toBe(53);
    expect(dayOfYear(12, 31)).toBe(365);
  });
  it('lights the sanctuary only around 22 Feb and 22 Oct', () => {
    expect(beamReach(2, 22)).toBe('sanctuary');
    expect(beamReach(10, 23)).toBe('sanctuary');
    expect(beamReach(3, 1)).toBe('hall');
    expect(beamReach(6, 21)).toBe('door');
    expect(daysFromFestival(10, 22)).toBe(0);
  });
  it('never lights Ptah', () => {
    expect(SANCTUARY.find((s) => s.id === 'ptah')?.lit).toBe(false);
    expect(SANCTUARY.filter((s) => s.lit)).toHaveLength(3);
  });
});
