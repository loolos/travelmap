import { describe, expect, it } from 'vitest';
import { allPhrases, fromArabicDigits, numberWords, phraseGroups, toArabicDigits } from './arabicData';
import { buildNavIndex, matches } from '../app/navIndex';

describe('survival Arabic', () => {
  it('converts digits both ways', () => {
    expect(toArabicDigits('250')).toBe('٢٥٠');
    expect(fromArabicDigits('٢٥٠')).toBe('250');
    expect(fromArabicDigits(toArabicDigits('1234567890'))).toBe('1234567890');
  });
  it('has unique ids and complete lines', () => {
    const ids = allPhrases.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.some((id) => /^n\d+$/.test(id))).toBe(false); // n<digits> is reserved for number cards
    for (const p of allPhrases) {
      for (const l of [p, ...(p.alt ?? [])]) {
        expect(l.ar).toMatch(/[؀-ۿ]/);
        expect(l.latin).not.toBe('');
        expect(l.say).not.toBe('');
      }
    }
    expect(phraseGroups.every((g) => g.phrases.length > 0)).toBe(true);
    expect(numberWords.map((w) => w.n)).toContain(100);
  });
  it('is searchable from the top menu', () => {
    const items = buildNavIndex().flatMap((g) => g.sections.flatMap((s) => s.items));
    const find = (q: string) => items.filter((i) => matches(i, q)).map((i) => i.id);
    expect(find('多少錢')).toContain('arabic');
    expect(find('shukran')).toContain('arabic');
  });
});
