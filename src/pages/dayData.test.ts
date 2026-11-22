import { describe, expect, it } from 'vitest';
import { dayRoles } from './dayData';
import { resolveDayLink } from './dayLinks';
import { buildNavIndex, matches } from '../app/navIndex';

describe('古埃及人的一天', () => {
  it('every link points at existing content', () => {
    for (const r of dayRoles)
      for (const m of r.moments)
        for (const l of m.links ?? []) expect(resolveDayLink(l), `${r.id}: ${l.kind}:${l.id}`).toBeDefined();
  });
  it('keeps the default screen short', () => {
    for (const r of dayRoles) {
      expect(r.moments.length).toBeGreaterThanOrEqual(4);
      expect(r.tag.length).toBeLessThanOrEqual(6);
      for (const m of r.moments) {
        expect(m.title.length, m.title).toBeLessThanOrEqual(14);
        expect((m.links ?? []).length).toBeLessThanOrEqual(2);
      }
      const ts = r.moments.map((m) => m.t);
      expect([...ts].sort((a, b) => a - b)).toEqual(ts);
    }
  });
  it('is reachable from the nav search', () => {
    const items = buildNavIndex().flatMap((g) => g.sections.flatMap((s) => s.items));
    expect(items.filter((i) => matches(i, '書記')).map((i) => i.to)).toContain('/day');
  });
});
