import { describe, expect, it } from 'vitest';
import { AFTER, BEFORE, FLOOD_LINE, fieldsFlooded, nilometer, season } from './nile';

describe('nile year', () => {
  it('has 12 months and peaks in September before the dam', () => {
    expect(BEFORE).toHaveLength(12);
    expect(AFTER).toHaveLength(12);
    expect(BEFORE.indexOf(Math.max(...BEFORE))).toBe(8);
    expect(BEFORE.indexOf(Math.min(...BEFORE))).toBe(4);
  });

  it('floods the fields only in the inundation season, and never after the dam', () => {
    for (let m = 0; m < 12; m++) {
      if (fieldsFlooded(m, false)) expect(season(m)).toBe('akhet');
      expect(fieldsFlooded(m, true)).toBe(false);
    }
    expect(Math.max(...AFTER)).toBeLessThan(FLOOD_LINE);
  });

  it('maps months to the three seasons', () => {
    expect(season(7)).toBe('akhet');
    expect(season(0)).toBe('peret');
    expect(season(4)).toBe('shemu');
  });
});

describe('nilometer', () => {
  it('follows the scale from famine to plenty, and too much is bad again', () => {
    expect(nilometer(12).harvest).toBe('famine');
    expect(nilometer(14).harvest).toBe('ok');
    expect(nilometer(16)).toEqual({ harvest: 'plenty', tax: 3 });
    expect(nilometer(19).harvest).toBe('deluge');
    expect(nilometer(12).tax).toBeLessThan(nilometer(16).tax);
  });
});
