import { describe, expect, it } from 'vitest';
import { ALL_GLYPHS, transliterate } from './cartouche';

const glyphs = (s: string) => transliterate(s).map((x) => x.glyph).join('');

describe('cartouche transliteration', () => {
  it('writes Cleopatra with lion for L and a basket for C', () => {
    const t = transliterate('Cleopatra');
    expect(t.map((x) => x.nameZh)).toEqual(['提籃', '獅子', '蘆葦', '繩套', '凳子', '禿鷲', '麵包', '嘴', '禿鷲']);
  });

  it('handles digraphs, accents, case and junk', () => {
    expect(transliterate('Shu Chen').map((x) => x.latin)).toEqual(['sh', 'u', 'ch', 'e', 'n']);
    expect(glyphs('José-Ana 1')).toBe(glyphs('joseana'));
    expect(transliterate('Philip').map((x) => x.nameZh)[0]).toBe('角蝰');
  });

  it('writes doubled letters once', () => {
    expect(transliterate('Anna')).toHaveLength(3);
  });

  it('only outputs glyphs from the bundled set', () => {
    const all = new Set(ALL_GLYPHS);
    for (const g of transliterate('the quick brown fox jumps over lazy dogs')) expect(all.has(g.glyph)).toBe(true);
  });

  it('caps the length', () => {
    expect(transliterate('abcdefghijklmnopqrstuvwxyz').length).toBeLessThanOrEqual(14);
  });
});
