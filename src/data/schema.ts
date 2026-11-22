import { z } from 'zod';

export const placeKinds = [
  'tomb',
  'temple',
  'city',
  'geology',
  'water',
  'ecology',
  'museum',
  'statue',
  'fortress',
  'mosque',
  'country',
] as const;

export const Coordinates = z.object({
  lat: z.number().min(21.5).max(32),
  lon: z.number().min(24.5).max(36),
});

/** Where to look on an image: centre (x, y) and radius r, in % of the image width/height. */
export const Spot = z.object({
  assetId: z.string().optional(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  r: z.number().min(1).max(50),
});

export const FindItem = z.object({
  id: z.string(),
  text: z.string(),
  /** Shown on tap: where / how to look. */
  hint: z.string().optional(),
  /** Optional circle on a photo (defaults to the place's hero image). */
  spot: Spot.optional(),
  assetId: z.string().optional(),
  deityId: z.string().optional(),
});

/** A notable object or spot inside a site (obelisk, hall, statue…): tile label on 重點, detail on tap. */
export const Highlight = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Tile label, 2–8 字. */
  name: z.string(),
  icon: z.string(),
  /** Detail shown on tap. */
  text: z.string(),
  assetId: z.string().optional(),
});

export const Place = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nameZh: z.string(),
  nameEn: z.string(),
  aliases: z.array(z.string()).default([]),
  regionId: z.string(),
  kind: z.enum(placeKinds),
  coordinates: Coordinates,
  onItinerary: z.boolean(),
  /** 'ready' = full light-template content; 'draft' = node + question only. */
  status: z.enum(['ready', 'draft']),
  /** Short label shown on the map at low zoom. */
  shortName: z.string().optional(),
  /** Show the label even when zoomed out. */
  major: z.boolean().default(false),
  parentId: z.string().optional(),
  question: z.string(),
  era: z.string().optional(),
  intro: z.string().optional(),
  heroAssetId: z.string().optional(),
  /** Facts may contain up to 3 inline links in the form [text](place:id). */
  facts: z.array(z.string()).default([]),
  /** Non-history facts (geography, nature, today), shown as icon chips and revealed on tap. */
  aspects: z.array(z.object({ kind: z.enum(['geo', 'nature', 'today']), text: z.string() })).default([]),
  findItems: z.array(FindItem).default([]),
  /** Notable objects / spots inside the site (看點), revealed on tap. */
  highlights: z.array(Highlight).default([]),
  /** Practical traveler tips (旅人手記 tab). */
  noteIds: z.array(z.string()).default([]),
  /** Background knowledge cards, listed under 重點 as 延伸知識. */
  readIds: z.array(z.string()).default([]),
  /** Year construction began / it opened (negative = BCE). Links the place into the history timeline. */
  builtYear: z.number().int().optional(),
  activityIds: z.array(z.string()).default([]),
  /** A few related knowledge pages (一天的身分, 神祇, 象形文字, 美食, 館藏…), shown as chips under 重點. */
  links: z
    .array(z.object({ kind: z.enum(['role', 'deity', 'glyph', 'food', 'artifact', 'arabic']), id: z.string() }))
    .max(3)
    .default([]),
  sourceIds: z.array(z.string()).default([]),
});

export const Region = z.object({
  id: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  order: z.number(),
});

export const Price = z.object({
  lowTwd: z.number(),
  highTwd: z.number(),
  lowUsd: z.number(),
  highUsd: z.number(),
  unit: z.string(),
  note: z.string(),
  asOf: z.string().regex(/^\d{4}-\d{2}$/),
  sourceIds: z.array(z.string()).min(1),
});

/** Site-wide note collections (used as Note.regionId besides real regions). */
/** 'tips' collections belong to 旅人手記 (practical); 'knowledge' ones to 知識 (background reading). */
export const noteCollections = [
  { id: 'general', title: '全站共用', icon: '🧳', kind: 'tips' },
  { id: 'souvenirs', title: '紀念品圖鑑', icon: '🎁', kind: 'tips' },
  { id: 'history', title: '歷史小卡', icon: '📜', kind: 'knowledge' },
  { id: 'culture', title: '城市與文化', icon: '🏙️', kind: 'knowledge' },
  { id: 'country', title: '埃及現況', icon: '🇪🇬', kind: 'knowledge' },
  { id: 'nile', title: '尼羅河', icon: '🌊', kind: 'knowledge' },
  { id: 'sahara', title: '撒哈拉沙漠', icon: '🏜️', kind: 'knowledge' },
  { id: 'redsea', title: '紅海', icon: '🪸', kind: 'knowledge' },
  { id: 'customs', title: '風土人情', icon: '🫖', kind: 'knowledge' },
] as const;

export const isKnowledge = (regionId: string) =>
  noteCollections.some((c) => c.id === regionId && c.kind === 'knowledge');

export const Note = z.object({
  id: z.string(),
  /** Region id, or a noteCollections id for site-wide cards. */
  regionId: z.string(),
  icon: z.string().default('🧳'),
  title: z.string(),
  body: z.string(),
  price: Price.optional(),
  /** Optional photo (e.g. a dish in 美食圖鑑). */
  assetId: z.string().optional(),
  /** Sub-heading inside a collection (e.g. 全國 / 努比亞 in 風土人情). */
  area: z.string().optional(),
});

/** 美食圖鑑 categories, in tab order. */
export const foodCategories = [
  { id: 'staple', title: '主食與麵包', icon: '🍞' },
  { id: 'veg', title: '豆類與蔬菜', icon: '🫘' },
  { id: 'meat', title: '肉類', icon: '🍖' },
  { id: 'seafood', title: '海鮮', icon: '🐟' },
  { id: 'sweet', title: '甜點', icon: '🍯' },
  { id: 'drink', title: '飲料', icon: '🫖' },
] as const;

/** A dish or drink in the 美食圖鑑 (photo tile; details on tap). */
export const Food = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  category: z.enum(foodCategories.map((c) => c.id) as [string, ...string[]]),
  nameZh: z.string(),
  nameEn: z.string(),
  /** Arabic name, to show when ordering. */
  nameAr: z.string(),
  icon: z.string(),
  /** What it is, in one line. */
  look: z.string(),
  /** The story behind it (shown on tap). */
  story: z.string(),
  /** How to eat or order it. */
  tip: z.string().optional(),
  /** Vegetarian (may contain egg or dairy). */
  veg: z.boolean().default(false),
  /** Rough price level: 1 street food, 2 restaurant dish, 3 pricier. */
  budget: z.number().int().min(1).max(3),
  /** Places on the map that are known for it (regional specialties). */
  placeIds: z.array(z.string()).default([]),
  assetId: z.string().optional(),
  sourceIds: z.array(z.string()).min(1),
});

/** A museum object in the 館藏圖鑑 (tap a tile for the details). */
export const Artifact = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  /** Museum (place) that shows it. */
  placeId: z.string(),
  /** Where in the museum, used as the section heading. */
  hall: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  icon: z.string(),
  /** Dynasty / date line. */
  era: z.string(),
  /** Year it was made (negative = BCE); links into the history timeline. */
  year: z.number().int().optional(),
  /** What to look at (one sentence). */
  look: z.string(),
  /** The story behind it (shown on tap). */
  story: z.string(),
  assetId: z.string().optional(),
  /** Optional related interaction. */
  activityId: z.string().optional(),
  sourceIds: z.array(z.string()).min(1),
});

export const Asset = z.object({
  id: z.string(),
  /** Path relative to public/, e.g. media/giza/khufu.webp (essential, stored in repo). */
  path: z.string().optional(),
  /** Online URL for non-essential images. */
  url: z.string().url().optional(),
  alt: z.string(),
  credit: z.string(),
  license: z.string(),
  sourceUrl: z.string().optional(),
  kind: z.enum(['photo', 'reconstruction', 'illustration', 'ai-illustration']),
  essential: z.boolean(),
});

export const Deity = z.object({
  id: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  icon: z.string(),
  /** How to recognise it on a wall (shown on tap). */
  look: z.string(),
  role: z.string(),
  /** Picture of the god (statue, relief or drawing). */
  assetId: z.string().optional(),
});

export const Glyph = z.object({
  id: z.string(),
  /** One Unicode Egyptian hieroglyph (must be in the bundled font subset). */
  glyph: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  meaning: z.string(),
  where: z.string(),
});

export const Source = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
});

export const Activity = z.object({
  id: z.string(),
  placeId: z.string(),
  component: z.enum(['ParameterLab', 'StepTimeline', 'LockSim', 'CartoucheMaker', 'HotspotDiagram', 'IdentifyQuiz', 'EvidenceReveal', 'SailLab']),
  title: z.string(),
  /** Card label in the place template (2–6 chars). */
  label: z.string(),
  icon: z.string(),
  question: z.string(),
  durationMin: z.number(),
  sourceIds: z.array(z.string()).default([]),
  /** Real photos of what the diagram shows; offered behind a 「實景照片」 toggle. */
  photoIds: z.array(z.string()).default([]),
});

/** Coarse territory zones drawn on the era map (shapes live in src/timeline/zones.ts; all 示意). */
export const eraZones = [
  'egypt-nile',
  'sinai',
  'lower-nubia',
  'upper-nubia',
  'sudan',
  'levant',
  'cyrenaica',
  'cyprus',
  'hejaz',
  'yemen',
  'north-africa',
  'modern-egypt',
] as const;

export const Era = z.object({
  id: z.string(),
  nameZh: z.string(),
  nameEn: z.string(),
  /** Calendar years; negative = BCE. `end` of the last era may be omitted (present). */
  start: z.number().int(),
  end: z.number().int().optional(),
  /** Dynasties / rulers line, e.g. 第 18–20 王朝. */
  rulers: z.string(),
  capital: z.string(),
  /** One or two sentences; shown only after tapping. */
  summary: z.string(),
  /** What the shaded map shows, in words (also covers short-lived conquests that are not drawn). */
  extent: z.string(),
  zones: z.array(z.enum(eraZones)).min(1),
  /** true when Egypt was a province ruled from elsewhere. */
  ruledFrom: z.string().optional(),
  sourceIds: z.array(z.string()).min(1),
});

export type Era = z.infer<typeof Era>;
export type Artifact = z.infer<typeof Artifact>;
export type Food = z.infer<typeof Food>;
export type Place = z.infer<typeof Place>;
export type Region = z.infer<typeof Region>;
export type Note = z.infer<typeof Note>;
export type Asset = z.infer<typeof Asset>;
export type Source = z.infer<typeof Source>;
export type Deity = z.infer<typeof Deity>;
export type Glyph = z.infer<typeof Glyph>;
export type Activity = z.infer<typeof Activity>;
export type FindItem = z.infer<typeof FindItem>;
export type PlaceKind = (typeof placeKinds)[number];

export interface ContentBundle {
  places: Place[];
  regions: Region[];
  notes: Note[];
  assets: Asset[];
  sources: Source[];
  activities: Activity[];
  deities: Deity[];
  glyphs: Glyph[];
  eras: Era[];
  artifacts: Artifact[];
  foods: Food[];
}
