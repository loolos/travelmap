import { describe, expect, it } from 'vitest';
import { buildNavIndex, matches } from './navIndex';
import { activities, notes, places } from '../data/content';

const items = buildNavIndex().flatMap((g) => g.sections.flatMap((s) => s.items));

describe('nav index', () => {
  it('lists every place, activity and notes region', () => {
    for (const p of places) expect(items.some((i) => i.id === `place:${p.id}`)).toBe(true);
    for (const a of activities) expect(items.some((i) => i.id === `activity:${a.id}`)).toBe(true);
    for (const n of notes)
      expect(items.some((i) => i.id === `notes:${n.regionId}` || i.id === `knowledge:${n.regionId}`)).toBe(true);
    expect(items.some((i) => i.to === '/deities')).toBe(true);
  });
  it('searches Chinese, English and aliases', () => {
    const find = (q: string) => items.filter((i) => matches(i, q)).map((i) => i.id);
    expect(find('胡夫')).toContain('place:giza-khufu');
    expect(find('cheops')).toContain('place:giza-khufu');
    expect(find('哈夫拉')).toContain('place:giza-khafre');
    expect(find('karnak')).toContain('place:karnak');
  });
});
