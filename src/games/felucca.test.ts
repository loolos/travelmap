import { describe, expect, it } from 'vitest';
import { sail } from './felucca';

describe('felucca model', () => {
  it('goes south only with the sail up in a north wind', () => {
    expect(sail('south', 'up', 'north')).toMatchObject({ ok: true, zigzag: false });
    expect(sail('south', 'down', 'north').ok).toBe(false);
    expect(sail('south', 'up', 'calm').ok).toBe(false);
    expect(sail('south', 'down', 'calm').net).toBeLessThan(0);
  });

  it('always reaches the north because the river flows that way', () => {
    for (const s of ['up', 'down'] as const)
      for (const w of ['north', 'calm'] as const) expect(sail('north', s, w).ok).toBe(true);
  });

  it('tacks (zigzag) only when sailing north into the wind', () => {
    expect(sail('north', 'up', 'north').zigzag).toBe(true);
    expect(sail('north', 'up', 'north').net).toBeLessThan(sail('north', 'down', 'north').net);
    expect(sail('north', 'up', 'calm').zigzag).toBe(false);
  });
});
