import { describe, expect, it } from 'vitest';
import { dig, LAYERS, seasonsLeft, SPOTS, startDig } from './tut';

describe('tutankhamun dig', () => {
  it('only the huts hide the tomb', () => {
    expect(SPOTS.filter((s) => s.tomb).map((s) => s.id)).toEqual(['huts']);
    let s = dig(startDig(), 'kv57');
    expect(s.found).toBe(false);
    s = dig(s, 'huts');
    expect(s.found).toBe(true);
  });
  it('uses a season per new spot and ignores repeats and digs after the find', () => {
    let s = dig(startDig(), 'bedrock');
    s = dig(s, 'bedrock');
    expect(seasonsLeft(s)).toBe(4);
    s = dig(dig(s, 'huts'), 'rubble');
    expect(s.dug).toEqual(['bedrock', 'huts']);
  });
  it('opens six layers ending with the mask', () => {
    expect(LAYERS).toHaveLength(6);
    expect(LAYERS.at(-1)?.id).toBe('mask');
  });
});
