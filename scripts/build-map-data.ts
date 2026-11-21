/**
 * One-off generator for src/map/egypt-geo.json (committed).
 * Source: Natural Earth 1:10m (Egypt) / 1:50m (neighbours) admin-0 countries via the `world-atlas` package (public domain).
 * Keeps Egypt and neighbours, rounds coordinates to 3 decimals.
 * Run: npx tsx scripts/build-map-data.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';

type Topo = Topology<{ countries: GeometryCollection<{ name: string }> }>;
const load = (res: string) =>
  JSON.parse(readFileSync(`node_modules/world-atlas/countries-${res}.json`, 'utf8')) as Topo;
const hi = load('10m');
const lo = load('50m');
const keep = new Set(['Egypt', 'Libya', 'Sudan', 'Israel', 'Palestine', 'Jordan', 'Saudi Arabia', 'Chad']);
const pick = (t: Topo, egypt: boolean) =>
  feature(t, t.objects.countries).features.filter(
    (f) => keep.has(f.properties!.name) && (f.properties!.name === 'Egypt') === egypt,
  );
const fc = { features: [...pick(lo, false), ...pick(hi, true)] };
const round = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(round) : typeof v === 'number' ? Math.round(v * 1000) / 1000 : v;
const features = fc.features
  .filter((f) => keep.has(f.properties!.name))
  .map((f) => ({
    type: 'Feature',
    properties: { name: f.properties!.name, egypt: f.properties!.name === 'Egypt' },
    geometry: { type: f.geometry.type, coordinates: round((f.geometry as { coordinates: unknown }).coordinates) },
  }));
writeFileSync('src/map/egypt-geo.json', JSON.stringify({ type: 'FeatureCollection', features }));
console.log('features', features.map((f) => f.properties.name));
