import { useMemo } from 'react';
import { geoMercator, geoPath, type GeoPermissibleObjects } from 'd3-geo';
import geo from './region-geo.json';
import type { Era } from '../data/schema';
import { line, nileDamietta, nileRosetta, ring } from '../map/water';
import { eraCities, nubianNile, zoneShapes } from './zones';

const W = 320;
const H = 250;
const frame: GeoPermissibleObjects = {
  type: 'MultiPoint',
  coordinates: [
    [8, 11],
    [46, 38],
  ],
};
const projection = geoMercator().fitExtent(
  [
    [4, 4],
    [W - 4, H - 4],
  ],
  frame,
);
const path = geoPath(projection);
const countries = (geo as GeoJSON.FeatureCollection).features.map((f) => ({
  name: (f.properties as { name: string }).name,
  d: path(f) ?? '',
}));
const egyptPath = countries.find((c) => c.name === 'Egypt')?.d ?? '';
const rivers = [nubianNile, nileRosetta, nileDamietta].map((l) => path(line(l)) ?? '');
const zonePaths = Object.fromEntries(Object.entries(zoneShapes).map(([k, pts]) => [k, path(ring(pts)) ?? '']));

/** Small regional map with the era's (approximate) territory shaded. */
export function EraMap({ era }: { era: Era }) {
  const zones = useMemo(() => era.zones.map((z) => (z === 'modern-egypt' ? egyptPath : zonePaths[z])), [era]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${era.nameZh}的疆域示意圖：${era.extent}`} style={{ width: '100%', display: 'block', borderRadius: 12 }}>
      <rect width={W} height={H} fill="#cfe3ec" />
      {countries.map((c) => (
        <path key={c.name} d={c.d} fill="#efe6d2" stroke="#cbbd9e" strokeWidth={0.5} />
      ))}
      <path d={egyptPath} fill="none" stroke="#a8946c" strokeWidth={0.8} strokeDasharray="3 2" />
      {zones.map((d, i) => (
        <path key={i} d={d} fill="#c0503f" fillOpacity={0.45} stroke="#a33b2f" strokeWidth={1} strokeLinejoin="round" />
      ))}
      {rivers.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#3f7fa6" strokeWidth={1.2} />
      ))}
      {eraCities.map((c) => {
        const [x, y] = projection(c.at)!;
        return (
          <g key={c.name}>
            <circle cx={x} cy={y} r={2.2} fill="#292720" />
            <text x={x + 4} y={y + 3} fontSize={9} fill="#292720" stroke="#fff" strokeWidth={2.5} paintOrder="stroke">
              {c.name}
            </text>
          </g>
        );
      })}
      <text x={8} y={14} fontSize={10} fill="#6b6457" stroke="#cfe3ec" strokeWidth={3} paintOrder="stroke">
        示意圖・虛線為今日埃及國界
      </text>
    </svg>
  );
}
