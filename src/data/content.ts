import { z } from 'zod';
import { Activity, Artifact, Asset, Deity, Era, Glyph, Note, Place, Region, Source } from './schema';
import regionsRaw from '../content/regions.json';
import notesRaw from '../content/notes.json';
import assetsRaw from '../content/assets.json';
import sourcesRaw from '../content/sources.json';
import activitiesRaw from '../content/activities.json';
import deitiesRaw from '../content/deities.json';
import glyphsRaw from '../content/glyphs.json';
import erasRaw from '../content/eras.json';
import artifactsRaw from '../content/artifacts.json';

const placeFiles = import.meta.glob<unknown[]>('../content/places/*.json', { eager: true, import: 'default' });

export const regions = z.array(Region).parse(regionsRaw).sort((a, b) => a.order - b.order);
export const places = Object.keys(placeFiles)
  .sort()
  .flatMap((k) => placeFiles[k])
  .map((p) => Place.parse(p));
export const notes = z.array(Note).parse(notesRaw);
export const assets = z.array(Asset).parse(assetsRaw);
export const sources = z.array(Source).parse(sourcesRaw);
export const activities = z.array(Activity).parse(activitiesRaw);
export const deities = z.array(Deity).parse(deitiesRaw);
export const glyphs = z.array(Glyph).parse(glyphsRaw);
export const eras = z.array(Era).parse(erasRaw);
export const artifacts = z.array(Artifact).parse(artifactsRaw);

const byId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
export const placeById = byId(places);
export const regionById = byId(regions);
export const noteById = byId(notes);
export const assetById = byId(assets);
export const sourceById = byId(sources);
export const activityById = byId(activities);
export const deityById = byId(deities);
export const eraById = byId(eras);

export const placesByRegion = regions.map((r) => ({
  region: r,
  places: places.filter((p) => p.regionId === r.id),
}));

export function assetUrl(id: string | undefined): string | undefined {
  const a = id ? assetById.get(id) : undefined;
  if (!a) return undefined;
  return a.path ? import.meta.env.BASE_URL + a.path : a.url;
}

export const kindLabel: Record<Asset['kind'], string> = {
  photo: '照片',
  reconstruction: '復原',
  illustration: '示意',
  'ai-illustration': '示意',
};
