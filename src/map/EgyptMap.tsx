import { useEffect, useMemo, useRef, useState } from 'react';
import { geoMercator, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import geo from './egypt-geo.json';
import { delta, lakeNasser, line, nileDamietta, nileMain, nileRosetta, ring } from './water';
import { clusterNodes, ringLayout } from './cluster';
import { places, regionById } from '../data/content';
import type { Place } from '../data/schema';
import { isLit, useProgress } from '../progress/store';
import { KindMarker } from './KindMarker';
import styles from './EgyptMap.module.css';

const MAX_K = 120;
const SPREAD_K = 6;
const CLUSTER_R = 26;
const FOCUS_K = 20;

const extent: GeoPermissibleObjects = {
  type: 'MultiPoint',
  coordinates: [
    [24.9, 21.9],
    [35.0, 31.6],
  ],
};

// Higher-priority nodes anchor clusters: major places first, then children last.
const ordered = [...places].sort(
  (a, b) => Number(b.major) - Number(a.major) || Number(!!a.parentId) - Number(!!b.parentId),
);

export interface MapInset {
  right: number;
  bottom: number;
}

interface Props {
  selectedId?: string;
  onSelect: (id: string) => void;
  inset: MapInset;
}

export function EgyptMap({ selectedId, onSelect, inset }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [highlight, setHighlight] = useState(false);
  const progress = useProgress();

  useEffect(() => {
    const el = wrapRef.current!;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const projection = useMemo(() => {
    const pad = 24;
    return geoMercator().fitExtent(
      [
        [pad, pad + 8],
        [Math.max(pad + 1, size.w - pad), Math.max(pad + 9, size.h - pad)],
      ],
      extent,
    );
  }, [size.w, size.h]);

  const paths = useMemo(() => {
    const p = geoPath(projection);
    return {
      land: geo.features.map((f) => ({
        name: f.properties.name,
        egypt: f.properties.egypt,
        d: p(f as GeoPermissibleObjects) ?? '',
      })),
      nile: [nileMain, nileRosetta, nileDamietta].map((l) => p(line(l)) ?? ''),
      lake: p(ring(lakeNasser)) ?? '',
      delta: p(ring(delta)) ?? '',
    };
  }, [projection]);

  // d3-zoom: pan/pinch/wheel/dblclick.
  useEffect(() => {
    if (!size.w) return;
    const svg = select(svgRef.current!);
    const z = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, MAX_K])
      .translateExtent([
        [-size.w * 0.5, -size.h * 0.5],
        [size.w * 1.5, size.h * 1.5],
      ])
      .on('zoom', (e: { transform: ZoomTransform }) => setT(e.transform));
    zoomRef.current = z;
    svg.call(z);
    return () => {
      svg.on('.zoom', null);
    };
  }, [size.w, size.h]);

  const project = (p: Place) => projection([p.coordinates.lon, p.coordinates.lat]) ?? [0, 0];

  // Bring the selected place into view if it is hidden (e.g. chosen from the menu).
  useEffect(() => {
    if (!selectedId || !size.w || !zoomRef.current) return;
    const place = places.find((p) => p.id === selectedId);
    if (!place) return;
    const [px, py] = project(place);
    const cur = t;
    const [sx, sy] = cur.apply([px, py]);
    const visW = size.w - inset.right;
    const visH = size.h - inset.bottom;
    const margin = 40;
    // Zoom in far enough that the place is not hidden inside a collapsed cluster.
    const crowded = places.some((o) => {
      if (o.id === place.id) return false;
      const [ox, oy] = project(o);
      return Math.hypot(ox - px, oy - py) * cur.k < CLUSTER_R;
    });
    const k = crowded && cur.k < FOCUS_K ? FOCUS_K : Math.max(cur.k, 1);
    if (sx > margin && sx < visW - margin && sy > margin && sy < visH - margin && k === cur.k) return;
    const next = zoomIdentity.translate(visW / 2 - px * k, visH / 2 - py * k).scale(k);
    select(svgRef.current!).transition().duration(600).call(zoomRef.current.transform, next);
    // Only re-run when the selection or layout changes, not on every pan.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, size.w, size.h, inset.right, inset.bottom]);

  const zoomToFit = (pts: [number, number][]) => {
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const dx = Math.max(...xs) - Math.min(...xs) || 1;
    const dy = Math.max(...ys) - Math.min(...ys) || 1;
    const visW = size.w - inset.right;
    const visH = size.h - inset.bottom;
    const k = Math.min(40, Math.max(t.k * 3, Math.min(visW / dx, visH / dy) * 0.4));
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const next = zoomIdentity.translate(visW / 2 - cx * k, visH / 2 - cy * k).scale(k);
    select(svgRef.current!).transition().duration(600).call(zoomRef.current!.transform, next);
  };

  const resetView = () => {
    select(svgRef.current!).transition().duration(600).call(zoomRef.current!.transform, zoomIdentity);
  };

  const screen = ordered.map((p) => {
    const [x, y] = t.apply(project(p));
    return { item: p, x, y };
  });
  const clusters = clusterNodes(screen, t.k >= SPREAD_K ? CLUSTER_R * 2 : CLUSTER_R);
  const collapsed = clusters.filter((c) => c.members.length > 1 && t.k < SPREAD_K);
  const regionLabel = (c: (typeof clusters)[number]) =>
    [...new Set(c.members.map((m) => regionById.get(m.item.regionId)?.nameZh))].join('·');
  const labelCounts = new Map<string, number>();
  collapsed.forEach((c) => labelCounts.set(regionLabel(c), (labelCounts.get(regionLabel(c)) ?? 0) + 1));
  const clusterLabel = (c: (typeof clusters)[number]) => {
    const r = regionLabel(c);
    if ((labelCounts.get(r) ?? 0) < 2) return r;
    const first = c.members[0].item;
    return `${first.shortName ?? first.nameZh}等`;
  };
  const egyptPath = paths.land.find((l) => l.egypt)?.d;

  const nodeLabel = (p: Place) => p.shortName ?? p.nameZh;

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <svg ref={svgRef} className={styles.svg} width={size.w} height={size.h} role="img" aria-label="埃及地圖">
        <rect width={size.w} height={size.h} className={styles.sea} />
        <g transform={t.toString()}>
          {paths.land.map((l) => (
            <path key={l.name} d={l.d} className={l.egypt ? styles.egypt : styles.neighbour} />
          ))}
          <clipPath id="egypt-clip">
            <path d={egyptPath} />
          </clipPath>
          <path d={paths.delta} className={styles.delta} clipPath="url(#egypt-clip)" />
          {paths.nile.map((d, i) => (
            <path key={`v${i}`} d={d} className={styles.valley} />
          ))}
          <path d={paths.lake} className={styles.lake} />
          {paths.nile.map((d, i) => (
            <path key={`n${i}`} d={d} className={styles.nile} />
          ))}
        </g>
        <g className={styles.labels} aria-hidden="true">
          <text x={t.applyX(projection([33.9, 26.6])![0])} y={t.applyY(projection([33.9, 26.6])![1])} className={styles.seaLabel}>
            紅海
          </text>
          <text x={t.applyX(projection([29.0, 31.85])![0])} y={t.applyY(projection([29.0, 31.85])![1])} className={styles.seaLabel}>
            地中海
          </text>
        </g>
        <g>
          {clusters.map((c) => {
            if (c.members.length > 1 && t.k < SPREAD_K) {
              const regionNames = clusterLabel(c);
              const anyLit = c.members.some((m) => isLit(m.item, progress));
              return (
                <g
                  key={c.members[0].item.id}
                  className={styles.cluster}
                  transform={`translate(${c.cx},${c.cy})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${regionNames}：${c.members.length} 個地點，放大`}
                  onClick={() => zoomToFit(c.members.map((m) => project(m.item)))}
                  onKeyDown={(e) => e.key === 'Enter' && zoomToFit(c.members.map((m) => project(m.item)))}
                >
                  <circle r={22} className={styles.hit} />
                  <circle r={14} className={anyLit ? styles.clusterLit : styles.clusterDot} />
                  <text className={styles.clusterCount} dy="0.35em">
                    {c.members.length}
                  </text>
                  <text className={styles.label} x={18} dy="0.35em">
                    {regionNames}
                  </text>
                </g>
              );
            }
            const pos = ringLayout(c.members.length, c.cx, c.cy);
            const spread = c.members.length > 1;
            return c.members.map((m, i) => {
              const p = m.item;
              const { x, y } = pos[i];
              const selected = p.id === selectedId;
              const showLabel = spread || selected || p.major || t.k >= 3;
              return (
                <g key={p.id}>
                  {spread && <line x1={m.x} y1={m.y} x2={x} y2={y} className={styles.leader} />}
                  {spread && <circle cx={m.x} cy={m.y} r={2.5} className={styles.anchor} />}
                  <g
                    transform={`translate(${x},${y})`}
                    className={styles.node}
                    role="button"
                    tabIndex={0}
                    aria-label={p.nameZh}
                    aria-pressed={selected}
                    data-place={p.id}
                    onClick={() => onSelect(p.id)}
                    onKeyDown={(e) => e.key === 'Enter' && onSelect(p.id)}
                  >
                    <circle r={22} className={styles.hit} />
                    {highlight && p.onItinerary && <circle r={15} className={styles.itinerary} />}
                    <KindMarker
                      kind={p.kind}
                      lit={isLit(p, progress)}
                      selected={selected}
                      opened={!!progress.opened[p.id]}
                      visited={!!progress.visited[p.id]}
                    />
                    {showLabel && (
                      <text
                        className={styles.label}
                        x={spread && x < c.cx - 1 ? -13 : 13}
                        textAnchor={spread && x < c.cx - 1 ? 'end' : 'start'}
                        dy="0.35em"
                      >
                        {nodeLabel(p)}
                      </text>
                    )}
                  </g>
                </g>
              );
            });
          })}
        </g>
      </svg>
      <div className={styles.controls} style={{ bottom: inset.bottom + 12 }}>
        <button type="button" onClick={resetView} aria-label="回到全境">
          ⤢ 全境
        </button>
        <button type="button" aria-pressed={highlight} onClick={() => setHighlight((h) => !h)}>
          ★ 行程地點
        </button>
      </div>
    </div>
  );
}
