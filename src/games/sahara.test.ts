import { describe, expect, it } from 'vitest';
import { STAGES, greenness, hasLakes, nileShare } from './sahara';

describe('sahara', () => {
  it('stages run from the past to today', () => {
    for (let i = 1; i < STAGES.length; i++) expect(STAGES[i].yearsAgo).toBeLessThan(STAGES[i - 1].yearsAgo);
    expect(STAGES.at(-1)!.yearsAgo).toBe(0);
  });
  it('is green around 10,000 years ago and a desert at both ends', () => {
    expect(greenness(10000)).toBe(1);
    expect(greenness(20000)).toBeLessThan(0.1);
    expect(greenness(0)).toBeLessThan(0.1);
    expect(hasLakes(greenness(8000))).toBe(true);
    expect(hasLakes(greenness(0))).toBe(false);
  });
  it('interpolates between stages', () => {
    expect(greenness(15000)).toBeCloseTo(0.51, 2);
    expect(greenness(30000)).toBe(STAGES[0].green);
  });
  it('people move to the Nile as it dries', () => {
    expect(nileShare(greenness(5100))).toBeGreaterThan(nileShare(greenness(7000)));
  });
});
