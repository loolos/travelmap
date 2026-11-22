import { describe, expect, it } from 'vitest';
import { places } from '../data/content';
import { resolveDayLink } from '../pages/dayLinks';
import { dayRoles } from '../pages/dayData';

describe('place → knowledge links', () => {
  it('every link points at existing content', () => {
    for (const p of places) for (const l of p.links) expect(resolveDayLink(l), `${p.id}: ${l.kind}:${l.id}`).toBeDefined();
  });
  it('every 古埃及人的一天 role is reachable from some place', () => {
    const linked = new Set(places.flatMap((p) => p.links.filter((l) => l.kind === 'role').map((l) => l.id)));
    for (const r of dayRoles) expect(linked.has(r.id), r.id).toBe(true);
  });
});
