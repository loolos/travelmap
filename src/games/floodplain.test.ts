import { describe, expect, it } from 'vitest';
import { BAND_SHARE, FLOODS, STAGES, bandState, outcome, villagesFlooded, villagesRuined, waterReach, wateredShare } from './floodplain';

const stage = (p: string) => STAGES.find((s) => s.phase === p)!;

describe('floodplain', () => {
  it('band shares add up to all farmland', () => {
    expect(BAND_SHARE.reduce((a, b) => a + b, 0)).toBeCloseTo(1);
  });

  it('a bigger flood waters more land, up to all of it', () => {
    const shares = FLOODS.map(wateredShare);
    for (let i = 1; i < shares.length; i++) expect(shares[i]).toBeGreaterThanOrEqual(shares[i - 1]);
    expect(shares[0]).toBeLessThan(0.3);
    expect(wateredShare(FLOODS[3])).toBeCloseTo(1);
  });

  it('water is in the channel in the low season and highest at the peak', () => {
    for (const f of FLOODS) {
      expect(waterReach(f, stage('low'))).toBe(0);
      expect(waterReach(f, stage('peak'))).toBe(f.reach);
      expect(waterReach(f, stage('rising'))).toBeLessThanOrEqual(f.reach);
    }
  });

  it('only watered land is sown; the rest lies fallow', () => {
    const low = FLOODS[0];
    expect(bandState(1, low, stage('growing'))).toBe('green');
    expect(bandState(4, low, stage('growing'))).toBe('fallow');
    expect(bandState(4, FLOODS[3], stage('harvest'))).toBe('gold');
    expect(bandState(2, FLOODS[3], stage('peak'))).toBe('water');
  });

  it('only an excessive flood reaches the villages', () => {
    for (const f of FLOODS.slice(0, 4)) {
      STAGES.forEach((s) => expect(villagesFlooded(f, s)).toBe(false));
      STAGES.forEach((s) => expect(villagesRuined(f, s)).toBe(false));
    }
    const big = FLOODS[4];
    expect(villagesFlooded(big, stage('peak'))).toBe(true);
    expect(villagesRuined(big, stage('harvest'))).toBe(true);
  });

  it('the best harvest comes from a good flood, not the biggest', () => {
    const sheaves = FLOODS.map((f) => outcome(f).sheaves);
    const best = sheaves.indexOf(Math.max(...sheaves));
    expect(FLOODS[best].key).toBe('good');
    expect(outcome(FLOODS[0]).harvest).toBe('famine');
    expect(outcome(FLOODS[4]).harvest).toBe('deluge');
    expect(outcome(FLOODS[4]).sheaves).toBeLessThan(outcome(FLOODS[3]).sheaves);
  });
});
