import { z } from 'zod';
import { isKnowledge, noteCollections, Activity, Asset, Deity, Era, Glyph, Note, Place, Region, Source, type ContentBundle } from './schema';
import { eraForYear } from './eras';
import { charCount, parseInline, plainText } from './inline';

export interface RawContent {
  places: unknown[];
  regions: unknown;
  notes: unknown;
  assets: unknown;
  sources: unknown;
  activities: unknown;
  deities: unknown;
  glyphs: unknown;
  eras: unknown;
}

export interface ValidationResult {
  errors: string[];
  warnings: string[];
  bundle?: ContentBundle;
}

/** Common simplified-only characters (each has a different traditional form). */
const SIMPLIFIED = '这们个为说时国发会来对么过还边门见东车书长问间开关线无从应当现实学经进动头体样点种两电业让图马鸟鱼岛龙风云们馆读写买卖观览际纪钟银铁乐园远运过陆灯热' ;

const DEFAULT_SCREEN_MAX = 60;

export function validateContent(raw: RawContent, fileExists?: (publicPath: string) => boolean): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parse = <T>(schema: z.ZodType<T>, data: unknown, label: string): T | undefined => {
    const r = schema.safeParse(data);
    if (!r.success) {
      errors.push(`${label}: ${r.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
      return undefined;
    }
    return r.data;
  };
  const places = raw.places.map((p, i) => parse(Place, p, `place[${i}]`)).filter((p): p is Place => !!p);
  const regions = parse(z.array(Region), raw.regions, 'regions') ?? [];
  const notes = parse(z.array(Note), raw.notes, 'notes') ?? [];
  const assets = parse(z.array(Asset), raw.assets, 'assets') ?? [];
  const sources = parse(z.array(Source), raw.sources, 'sources') ?? [];
  const activities = parse(z.array(Activity), raw.activities, 'activities') ?? [];
  const deities = parse(z.array(Deity), raw.deities, 'deities') ?? [];
  const glyphs = parse(z.array(Glyph), raw.glyphs, 'glyphs') ?? [];
  const eras = parse(z.array(Era), raw.eras, 'eras') ?? [];

  const ids = new Map<string, string>();
  const unique = (id: string, label: string) => {
    if (ids.has(id)) errors.push(`duplicate id "${id}" (${label} vs ${ids.get(id)})`);
    ids.set(id, label);
  };
  places.forEach((p) => unique(p.id, 'place'));
  places.forEach((p) => p.findItems.forEach((f) => unique(f.id, `find item of ${p.id}`)));
  notes.forEach((n) => unique(n.id, 'note'));
  assets.forEach((a) => unique(a.id, 'asset'));
  sources.forEach((s) => unique(s.id, 'source'));
  activities.forEach((a) => unique(a.id, 'activity'));
  deities.forEach((d) => unique(d.id, 'deity'));
  glyphs.forEach((g) => unique(`glyph:${g.id}`, 'glyph'));
  eras.forEach((e) => unique(`era:${e.id}`, 'era'));

  const placeIds = new Set(places.map((p) => p.id));
  const regionIds = new Set(regions.map((r) => r.id));
  const noteIds = new Set(notes.map((n) => n.id));
  const assetIds = new Set(assets.map((a) => a.id));
  const sourceIds = new Set(sources.map((s) => s.id));
  const activityIds = new Set(activities.map((a) => a.id));
  const deityIds = new Set(deities.map((d) => d.id));

  const checkText = (label: string, text: string) => {
    const bad = [...text].filter((c) => SIMPLIFIED.includes(c));
    if (bad.length) errors.push(`${label}: simplified characters found: ${[...new Set(bad)].join('')}`);
  };

  for (const p of places) {
    const L = `place ${p.id}`;
    if (!regionIds.has(p.regionId)) errors.push(`${L}: unknown region ${p.regionId}`);
    if (p.parentId && !placeIds.has(p.parentId)) errors.push(`${L}: unknown parent ${p.parentId}`);
    const qLen = charCount(p.question);
    if (qLen < 8 || qLen > 35) warnings.push(`${L}: question length ${qLen} (target 15–35)`);
    const defaultScreen = charCount(p.nameZh) + charCount(p.nameEn) + qLen;
    if (defaultScreen > DEFAULT_SCREEN_MAX)
      errors.push(`${L}: default screen has ~${defaultScreen} 字 (max ${DEFAULT_SCREEN_MAX})`);
    for (const s of [p.nameZh, p.question, p.intro ?? '', p.era ?? '', ...p.facts, ...p.findItems.flatMap((f) => [f.text, f.hint ?? '']), ...p.aliases])
      checkText(L, s);

    let links = 0;
    for (const f of [...p.facts, ...p.findItems.map((x) => x.hint ?? '')])
      for (const seg of parseInline(f)) {
        if (seg.type !== 'link') continue;
        links++;
        const ok =
          seg.kind === 'place' ? placeIds.has(seg.id) : seg.kind === 'note' ? noteIds.has(seg.id) : activityIds.has(seg.id);
        if (!ok) errors.push(`${L}: inline link to unknown ${seg.kind} ${seg.id}`);
      }
    if (links > 3) errors.push(`${L}: ${links} inline links (max 3)`);

    p.noteIds.forEach((n) => noteIds.has(n) || errors.push(`${L}: unknown note ${n}`));
    p.readIds.forEach((n) => noteIds.has(n) || errors.push(`${L}: unknown knowledge card ${n}`));
    const noteRegion = new Map(notes.map((n) => [n.id, n.regionId]));
    p.noteIds.forEach((n) => isKnowledge(noteRegion.get(n) ?? '') && errors.push(`${L}: ${n} is knowledge, list it in readIds`));
    p.readIds.forEach((n) => noteRegion.has(n) && !isKnowledge(noteRegion.get(n)!) && errors.push(`${L}: ${n} is a travel tip, list it in noteIds`));
    p.sourceIds.forEach((s) => sourceIds.has(s) || errors.push(`${L}: unknown source ${s}`));
    p.activityIds.forEach((a) => activityIds.has(a) || errors.push(`${L}: unknown activity ${a}`));
    if (p.heroAssetId && !assetIds.has(p.heroAssetId)) errors.push(`${L}: unknown hero asset ${p.heroAssetId}`);
    p.findItems.forEach((f) => f.assetId && !assetIds.has(f.assetId) && errors.push(`${L}: unknown asset ${f.assetId}`));
    p.findItems.forEach((f) => f.deityId && !deityIds.has(f.deityId) && errors.push(`${L}: unknown deity ${f.deityId}`));
    // Card labels: 重點, (找找看), 手記 + activities  ≤ 4
    if (2 + Number(p.findItems.length > 0) + p.activityIds.length > 4) errors.push(`${L}: too many card labels`);

    if (p.status === 'ready') {
      if (p.facts.length !== 3) errors.push(`${L}: needs exactly 3 facts (has ${p.facts.length})`);
      if (p.findItems.length > 3) errors.push(`${L}: at most 3 find items (has ${p.findItems.length})`);
      if (!p.heroAssetId) errors.push(`${L}: missing hero image`);
      if (!p.intro) errors.push(`${L}: missing intro`);
      if (p.noteIds.length < 1) errors.push(`${L}: needs at least 1 traveler note`);
      if (p.sourceIds.length < 1) errors.push(`${L}: needs at least 1 source`);
      p.facts.forEach((f) => {
        const n = charCount(f);
        if (n < 12 || n > 45) warnings.push(`${L}: fact length ${n} (target 15–40): ${plainText(f)}`);
      });
      p.findItems.forEach((f) => {
        const n = charCount(f.text);
        if (n < 8 || n > 30) warnings.push(`${L}: find item length ${n} (target 10–30)`);
        if (!f.hint) errors.push(`${L}: find item ${f.id} needs a hint`);
        else if (charCount(f.hint) > 40) warnings.push(`${L}: hint for ${f.id} is ${charCount(f.hint)} 字 (max ~40)`);
        if (f.spot) {
          const a = f.spot.assetId ?? p.heroAssetId;
          if (!a || !assetIds.has(a)) errors.push(`${L}: spot for ${f.id} has no image`);
          else if (assets.find((x) => x.id === a)?.kind === 'illustration' || assets.find((x) => x.id === a)?.kind === 'ai-illustration')
            warnings.push(`${L}: spot for ${f.id} is drawn on an illustration`);
        }
      });
    }
  }

  for (const n of notes) {
    if (!noteCollections.some((c) => c.id === n.regionId) && !regionIds.has(n.regionId)) errors.push(`note ${n.id}: unknown region ${n.regionId}`);
    checkText(`note ${n.id}`, n.title + n.body);
    const len = charCount(n.body);
    if (len > 90) warnings.push(`note ${n.id}: body ${len} 字 (target 30–80)`);
    if (n.assetId && !assetIds.has(n.assetId)) errors.push(`note ${n.id}: unknown asset ${n.assetId}`);
    n.price?.sourceIds.forEach((s) => sourceIds.has(s) || errors.push(`note ${n.id}: unknown source ${s}`));
  }

  for (const a of assets) {
    if (a.essential && !a.path) errors.push(`asset ${a.id}: essential asset must have a repo path`);
    if (!a.path && !a.url) errors.push(`asset ${a.id}: needs path or url`);
    if (a.path && fileExists && !fileExists(a.path)) errors.push(`asset ${a.id}: file missing public/${a.path}`);
    checkText(`asset ${a.id}`, a.alt);
  }
  for (const a of activities) {
    if (!placeIds.has(a.placeId)) errors.push(`activity ${a.id}: unknown place ${a.placeId}`);
    a.sourceIds.forEach((s) => sourceIds.has(s) || errors.push(`activity ${a.id}: unknown source ${s}`));
    const n = charCount(a.label);
    if (n < 2 || n > 6) errors.push(`activity ${a.id}: label "${a.label}" must be 2–6 字`);
  }
  const findable = new Set(places.flatMap((p) => p.findItems.map((f) => f.deityId)));
  for (const d of deities) {
    checkText(`deity ${d.id}`, `${d.nameZh}${d.look}${d.role}`);
    if (d.assetId && !assetIds.has(d.assetId)) errors.push(`deity ${d.id}: unknown asset ${d.assetId}`);
    if (!findable.has(d.id)) warnings.push(`deity ${d.id} is not in any find list yet`);
  }
  for (const g of glyphs) {
    checkText(`glyph ${g.id}`, `${g.nameZh}${g.meaning}${g.where}`);
    if ([...g.glyph].length !== 1 || !/[\u{13000}-\u{1342F}]/u.test(g.glyph)) errors.push(`glyph ${g.id}: must be one Egyptian hieroglyph`);
  }
  eras.forEach((e, i) => {
    checkText(`era ${e.id}`, `${e.nameZh}${e.rulers}${e.capital}${e.summary}${e.extent}${e.ruledFrom ?? ''}`);
    e.sourceIds.forEach((s) => sourceIds.has(s) || errors.push(`era ${e.id}: unknown source ${s}`));
    const next = eras[i + 1];
    if (next && e.end !== next.start) errors.push(`era ${e.id}: must end where ${next.id} starts`);
    if (!next && e.end !== undefined) errors.push(`era ${e.id}: the last era runs to the present (no end)`);
    if (e.end !== undefined && e.end <= e.start) errors.push(`era ${e.id}: end before start`);
  });
  for (const p of places) {
    if (p.builtYear !== undefined && eras.length && !eraForYear(eras, p.builtYear))
      errors.push(`place ${p.id}: builtYear ${p.builtYear} is outside the timeline`);
  }
  // Every hero/essential asset must be referenced at most... (unused assets are only a warning)
  const used = new Set([
    ...places.map((p) => p.heroAssetId),
    ...places.flatMap((p) => p.findItems.map((f) => f.assetId)),
    ...deities.map((d) => d.assetId),
    ...notes.map((n) => n.assetId),
  ]);
  assets.forEach((a) => used.has(a.id) || warnings.push(`asset ${a.id} is not used`));

  return {
    errors,
    warnings,
    bundle: errors.length ? undefined : { places, regions, notes, assets, sources, activities, deities, glyphs, eras },
  };
}
