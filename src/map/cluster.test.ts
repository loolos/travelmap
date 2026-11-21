import { describe, expect, it } from 'vitest';
import { clusterNodes, ringLayout } from './cluster';

describe('clusterNodes', () => {
  it('groups nearby nodes and keeps distant ones apart', () => {
    const c = clusterNodes(
      [
        { item: 'a', x: 0, y: 0 },
        { item: 'b', x: 5, y: 5 },
        { item: 'c', x: 100, y: 0 },
      ],
      20,
    );
    expect(c).toHaveLength(2);
    expect(c[0].members.map((m) => m.item)).toEqual(['a', 'b']);
    expect(c[0].cx).toBe(2.5);
  });
  it('ring layout spreads members without overlap', () => {
    const pts = ringLayout(5, 0, 0);
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++)
        expect(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)).toBeGreaterThan(20);
  });
});
