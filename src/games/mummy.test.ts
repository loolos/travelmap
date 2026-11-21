import { describe, expect, it } from 'vitest';
import { isComplete, MUMMY_STEPS, pick, shuffled, startOrder } from './mummy';

describe('mummification order', () => {
  it('accepts the steps only in order', () => {
    let s = pick(startOrder(), 'natron');
    expect(s.placed).toEqual([]);
    expect(s.mistakes).toBe(1);
    expect(s.wrong).toBe('natron');
    for (const st of MUMMY_STEPS) s = pick(s, st.id);
    expect(isComplete(s)).toBe(true);
    expect(s.mistakes).toBe(1);
  });
  it('keeps the heart: organs come before the jars and drying', () => {
    const ids = MUMMY_STEPS.map((x) => x.id);
    expect(ids.indexOf('organs')).toBeLessThan(ids.indexOf('natron'));
    expect(MUMMY_STEPS.find((x) => x.id === 'organs')?.text).toContain('心臟留在');
  });
  it('shuffles deterministically without losing cards', () => {
    const a = shuffled(MUMMY_STEPS);
    expect(a).toHaveLength(8);
    expect(new Set(a.map((x) => x.id)).size).toBe(8);
    expect(a.map((x) => x.id)).not.toEqual(MUMMY_STEPS.map((x) => x.id));
  });
});
