/**
 * One-off generator for src/timeline/region-geo.json (committed): low-res base map for the
 * history timeline (North Africa, Levant, Arabia). Source: Natural Earth 1:110m via `world-atlas` (public domain).
 * Run: npx tsx scripts/build-era-map.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

type Topo = Topology<{ countries: GeometryCollection<{ name: string }> }>;
const t = JSON.parse(readFileSync('node_modules/world-atlas/countries-110m.json', 'utf8')) as Topo;
const round = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(round) : typeof v === 'number' ? Math.round(v * 100) / 100 : v;
const inBox = (c: unknown): boolean =>
  Array.isArray(c) && typeof c[0] === 'number'
    ? (c[0] as number) > 0 && (c[0] as number) < 56 && (c[1] as number) > 5 && (c[1] as number) < 44
    : Array.isArray(c) && c.some(inBox);
const features = feature(t, t.objects.countries)
  .features.filter((f) => inBox((f.geometry as { coordinates: unknown }).coordinates))
  .map((f) => ({
    type: 'Feature',
    properties: { name: f.properties!.name },
    geometry: { type: f.geometry.type, coordinates: round((f.geometry as { coordinates: unknown }).coordinates) },
  }));
writeFileSync('src/timeline/region-geo.json', JSON.stringify({ type: 'FeatureCollection', features }));
console.log(features.length, features.map((f) => f.properties.name).join(', '));
