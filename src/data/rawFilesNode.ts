import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { RawContent } from './validate';

const root = join(import.meta.dirname, '..', 'content');
const read = (f: string) => JSON.parse(readFileSync(join(root, f), 'utf8'));

export function readRawContent(): RawContent {
  const places = readdirSync(join(root, 'places'))
    .filter((f) => f.endsWith('.json'))
    .sort()
    .flatMap((f) => read(join('places', f)) as unknown[]);
  return {
    places,
    regions: read('regions.json'),
    notes: read('notes.json'),
    assets: read('assets.json'),
    sources: read('sources.json'),
    activities: read('activities.json'),
    deities: read('deities.json'),
    glyphs: read('glyphs.json'),
    eras: read('eras.json'),
  };
}

export const publicFileExists = (p: string) => existsSync(join(import.meta.dirname, '..', '..', 'public', p));
