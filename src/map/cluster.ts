export interface ScreenNode<T> {
  item: T;
  x: number;
  y: number;
}
export interface Cluster<T> {
  members: ScreenNode<T>[];
  cx: number;
  cy: number;
}

/** Greedy screen-space clustering. Input order = priority (first item anchors its cluster). */
export function clusterNodes<T>(nodes: ScreenNode<T>[], radius: number): Cluster<T>[] {
  const clusters: (Cluster<T> & { ax: number; ay: number })[] = [];
  for (const n of nodes) {
    const c = clusters.find((c) => Math.hypot(c.ax - n.x, c.ay - n.y) < radius);
    if (c) c.members.push(n);
    else clusters.push({ members: [n], cx: n.x, cy: n.y, ax: n.x, ay: n.y });
  }
  for (const c of clusters) {
    c.cx = c.members.reduce((s, m) => s + m.x, 0) / c.members.length;
    c.cy = c.members.reduce((s, m) => s + m.y, 0) / c.members.length;
  }
  return clusters.map(({ members, cx, cy }) => ({ members, cx, cy }));
}

/** Positions for spreading a cluster's members in a ring around its centre. */
export function ringLayout(n: number, cx: number, cy: number): { x: number; y: number }[] {
  if (n === 1) return [{ x: cx, y: cy }];
  const r = 24 + n * 4;
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}
