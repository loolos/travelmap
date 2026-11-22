/**
 * Downloads the lead image of each listed Wikipedia article from Wikimedia Commons,
 * converts it to WebP (≤1280px, ~200 KB) and records author/licence in src/content/assets.json.
 * Needs internet access to *.wikipedia.org / *.wikimedia.org (runs in GitHub Actions).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

interface Entry { assetId: string; article: string; match?: string; dest: string; alt: string; width?: number }
const UA = 'travelmap-build/1.0 (https://github.com/loolos/travelmap)';
const cfg = JSON.parse(readFileSync('scripts/commons-images.json', 'utf8')) as { images: Entry[] };
const assetsPath = 'src/content/assets.json';
const assets = JSON.parse(readFileSync(assetsPath, 'utf8')) as Record<string, unknown>[];

const api = async (host: string, params: Record<string, string>) => {
  const url = `https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
};
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const FREE = /^(cc0|cc[ -]by|public domain|pd|cc-by-sa|attribution)/i;

let failures = 0;
for (const e of cfg.images) {
  try {
    let file: string | undefined;
    if (e.match) {
      const re = new RegExp(e.match, 'i');
      const imgs = await api('en.wikipedia.org', { action: 'query', prop: 'images', imlimit: '100', titles: e.article, redirects: '1' });
      const hit = ((imgs.query.pages[0]?.images ?? []) as { title: string }[]).find((r) => re.test(r.title));
      file = hit?.title.replace(/^File:/, '');
    } else {
      const page = await api('en.wikipedia.org', { action: 'query', prop: 'pageimages', piprop: 'name', titles: e.article, redirects: '1' });
      file = page.query.pages[0]?.pageimage as string | undefined;
    }
    if (!file) throw new Error('no lead image');
    const info = await api('commons.wikimedia.org', {
      action: 'query', prop: 'imageinfo', titles: `File:${file}`, iiprop: 'url|extmetadata', iiurlwidth: '1280',
    });
    const ii = info.query.pages[0]?.imageinfo?.[0];
    if (!ii) throw new Error(`File:${file} not on Commons`);
    const md = ii.extmetadata ?? {};
    const license = strip(md.LicenseShortName?.value);
    if (!FREE.test(license)) throw new Error(`licence not free: ${license}`);
    const img = await fetch(ii.thumburl ?? ii.url, { headers: { 'User-Agent': UA } });
    if (!img.ok) throw new Error(`download ${img.status}`);
    const out = join('public', e.dest);
    mkdirSync(dirname(out), { recursive: true });
    await sharp(Buffer.from(await img.arrayBuffer()))
      .resize({ width: e.width ?? 1280, height: e.width ?? 1280, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(out);
    const rec = {
      id: e.assetId,
      path: e.dest,
      alt: e.alt,
      credit: strip(md.Artist?.value) || 'Wikimedia Commons',
      license,
      sourceUrl: ii.descriptionurl,
      kind: 'photo',
      essential: true,
    };
    const i = assets.findIndex((a) => a.id === e.assetId);
    if (i >= 0) assets[i] = rec;
    else assets.push(rec);
    console.log(`✓ ${e.assetId} ← ${file} (${license})`);
  } catch (err) {
    failures++;
    console.error(`✗ ${e.assetId} (${e.article}): ${(err as Error).message}`);
  }
}
writeFileSync(assetsPath, JSON.stringify(assets, null, 2) + '\n');
if (failures) console.warn(`${failures} image(s) kept their previous version.`);
