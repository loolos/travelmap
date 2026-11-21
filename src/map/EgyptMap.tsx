import { useEffect, useMemo, useRef, useState } from 'react';
import { geoGraticule, geoMercator, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior, type ZoomTransform } from 'd3-zoom';
import 'd3-transition';
import geo from './egypt-geo.json';
import { delta, lakeNasser, line, nileDamietta, nileMain, nileRosetta, ring } from './water';
import { clusterNodes, ringLayout } from './cluster';
import { hills, mapLabels, oases, type LL } from './decor';
import { places, regionById } from '../data/content';
import type { Place } from '../data/schema';
import { isLit, useProgress } from '../progress/store';
import { KindMarker } from './KindMarker';
import styles from './EgyptMap.module.css';

const MAX_K = 120;
const SPREAD_K = 6;
const CLUSTER_R = 26;
const FOCUS_K = 20;

const ellipse = (c: LL, rx: number, ry: number) =>
  ring(Array.from({ length: 16 }, (_, i) => [c[0] + rx * Math.cos((i / 16) * 2 * Math.PI), c[1] + ry * Math.sin((i / 16) * 2 * Math.PI)] as LL));

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
  /** Zoom to fit this region's places (breadcrumb → region). */
  focusRegionId?: string;
  /** Changes when the user asks for the whole map (logo / 埃及全境). */
  resetSignal?: number;
  onSelect: (id: string) => void;
  inset: MapInset;
}

/** Rough text width so the label area can be tapped too (CJK ≈ 1em, Latin ≈ 0.55em). */
const textW = (s: string, em = 12.5) => [...s].reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? em : em * 0.58), 0);
const labelHit = (text: string, x: number, end: boolean) => {
  const w = textW(text) + 8;
  return <rect className={styles.hit} x={end ? x - w + 4 : x - 4} y={-12} width={w} height={24} />;
};

const HINT_KEY = 'map-hint-dismissed';
const readHint = () => {
  try {
    return localStorage.getItem(HINT_KEY) === '1';
  } catch {
    return false;
  }
};

export function EgyptMap({ selectedId, focusRegionId, resetSignal, onSelect, inset }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [t, setT] = useState<ZoomTransform>(zoomIdentity);
  const [highlight, setHighlight] = useState(false);
  const [hintGone, setHintGone] = useState(readHint);
  const hideHint = () => {
    setHintGone(true);
    try {
      localStorage.setItem(HINT_KEY, '1');
    } catch {
      /* private mode: hint just comes back next time */
    }
  };
  const select_ = (id: string) => {
    hideHint();
    onSelect(id);
  };
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
      graticule: p(geoGraticule().step([2, 2]).extent([[22, 20], [38, 34]])()) ?? '',
      oases: oases.map((o) => p(ellipse(o.at, o.rx, o.ry)) ?? ''),
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

  // Breadcrumb region link: frame all of that region's places.
  useEffect(() => {
    if (!focusRegionId || !size.w || !zoomRef.current) return;
    const pts = places.filter((p) => p.regionId === focusRegionId && p.kind !== 'country').map(project);
    if (!pts.length) return;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const visW = size.w - inset.right;
    const visH = size.h - inset.bottom;
    const dx = Math.max(...xs) - Math.min(...xs) || 1;
    const dy = Math.max(...ys) - Math.min(...ys) || 1;
    const k = Math.max(1, Math.min(MAX_K / 3, Math.min(visW / dx, visH / dy) * 0.6));
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
    const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const next = zoomIdentity.translate(visW / 2 - cx * k, visH / 2 - cy * k).scale(k);
    select(svgRef.current!).transition().duration(600).call(zoomRef.current.transform, next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusRegionId, size.w, size.h]);

  useEffect(() => {
    if (resetSignal && zoomRef.current) resetView();
  }, [resetSignal]);

  const screen = ordered.map((p) => {
    const [x, y] = t.apply(project(p));
    return { item: p, x, y };
  });
  const clusters = clusterNodes(screen, t.k >= SPREAD_K ? CLUSTER_R * 2 : CLUSTER_R);
  const collapsed = clusters.filter((c) => c.members.length > 1 && t.k < SPREAD_K);
  const regionLabel = (c: (typeof clusters)[number]) =>
    [...new Set(c.members.map((m) => regionById.get(m.item.regionId)?.nameZh.split('與')[0]))].join('·');
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
        <defs>
          <linearGradient id="tm-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a9d0d6" />
            <stop offset="1" stopColor="#8fc0c9" />
          </linearGradient>
          <radialGradient id="tm-land" cx="0.5" cy="0.45" r="0.7">
            <stop offset="0" stopColor="#f1e3c2" />
            <stop offset="1" stopColor="#e4cfa4" />
          </radialGradient>
          <pattern id="tm-waves" width="36" height="14" patternUnits="userSpaceOnUse">
            <path d="M2 9 q5 -4 10 0 t10 0" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
          </pattern>
          <pattern id="tm-dunes" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="4" r="0.9" fill="#b89462" fillOpacity="0.25" />
            <circle cx="12" cy="12" r="0.7" fill="#b89462" fillOpacity="0.2" />
          </pattern>
          <pattern id="tm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#bfb092" strokeOpacity="0.35" strokeWidth="1" />
          </pattern>
          <clipPath id="egypt-clip">
            <path d={egyptPath} transform={t.toString()} />
          </clipPath>
        </defs>
        <rect width={size.w} height={size.h} fill="url(#tm-sea)" />
        <rect width={size.w} height={size.h} fill="url(#tm-waves)" />
        <path d={paths.graticule} transform={t.toString()} className={styles.graticule} />
        <g transform={t.toString()}>
          {paths.land.map((l) => (
            <path key={`c${l.name}`} d={l.d} className={styles.coast} />
          ))}
          {paths.land.map((l) => (
            <path key={l.name} d={l.d} className={l.egypt ? styles.egypt : styles.neighbour} fill={l.egypt ? 'url(#tm-land)' : undefined} />
          ))}
          {paths.land
            .filter((l) => !l.egypt)
            .map((l) => (
              <path key={`h${l.name}`} d={l.d} fill="url(#tm-hatch)" />
            ))}
        </g>
        <rect width={size.w} height={size.h} fill="url(#tm-dunes)" clipPath="url(#egypt-clip)" />
        <g transform={t.toString()}>
          <path d={paths.delta} className={styles.delta} style={{ opacity: t.k > 6 ? 0.3 : 0.75 }} clipPath="url(#egypt-clip-local)" />
          <clipPath id="egypt-clip-local">
            <path d={egyptPath} />
          </clipPath>
          {paths.oases.map((d, i) => (
            <path key={`o${i}`} d={d} className={styles.oasis} />
          ))}
          {paths.nile.map((d, i) => (
            <path key={`v${i}`} d={d} className={styles.valley} />
          ))}
          <path d={paths.lake} className={styles.lake} />
          {paths.nile.map((d, i) => (
            <path key={`n${i}`} d={d} className={styles.nile} />
          ))}
        </g>
        <g aria-hidden="true">
          {hills.map((h, i) => {
            const [x, y] = t.apply(projection(h)!);
            return <path key={i} d={`M${x - 7},${y + 4} L${x},${y - 5} L${x + 7},${y + 4}`} className={styles.hill} />;
          })}
          {mapLabels
            .filter((l) => !l.maxK || t.k <= l.maxK)
            .map((l) => {
              const [x, y] = t.apply(projection(l.at)!);
              return (
                <text
                  key={l.text}
                  x={x}
                  y={y}
                  transform={l.rotate ? `rotate(${l.rotate} ${x} ${y})` : undefined}
                  className={`${styles.mapLabel} ${styles[`ml_${l.kind}`]}`}
                >
                  {l.text}
                  {l.en && l.kind !== 'river' && (
                    <tspan x={x} dy="1.25em" className={styles.mapLabelEn}>
                      {l.en}
                    </tspan>
                  )}
                </text>
              );
            })}
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
                  {labelHit(regionNames, c.cx > size.w - 130 ? -18 : 18, c.cx > size.w - 130)}
                  <text
                    className={styles.label}
                    x={c.cx > size.w - 130 ? -18 : 18}
                    textAnchor={c.cx > size.w - 130 ? 'end' : 'start'}
                    dy="0.35em"
                  >
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
                    onClick={() => select_(p.id)}
                    onKeyDown={(e) => e.key === 'Enter' && select_(p.id)}
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
                    {showLabel && labelHit(nodeLabel(p), spread && x < c.cx - 1 ? -13 : 13, spread && x < c.cx - 1)}
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
      <svg className={styles.compass} width="30" height="50" viewBox="0 0 30 50" aria-hidden="true">
        <text x="15" y="10" textAnchor="middle" fontSize="11" fontWeight="700" fill="#292720">
          N
        </text>
        <polygon points="15,14 20,31 15,28 10,31" fill="#292720" />
        <polygon points="15,28 20,31 15,47 10,31" fill="#b88b43" opacity="0.7" />
      </svg>
      {!hintGone && !selectedId && (
        <div className={styles.hint} role="note">
          <span>點任一地點或名稱即可展開</span>
          <button type="button" onClick={hideHint} aria-label="關閉提示">
            ✕
          </button>
        </div>
      )}
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
