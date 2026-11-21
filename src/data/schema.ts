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
  findItems: z.array(FindItem).default([]),
  noteIds: z.array(z.string()).default([]),
  activityIds: z.array(z.string()).default([]),
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
export const noteCollections = [
  { id: 'general', title: '全站共用', icon: '🧳' },
  { id: 'phrases', title: '實用短語', icon: '💬' },
  { id: 'food', title: '美食圖鑑', icon: '🍽️' },
  { id: 'history', title: '歷史小卡', icon: '📜' },
] as const;

export const Note = z.object({
  id: z.string(),
  /** Region id, or a noteCollections id for site-wide cards. */
  regionId: z.string(),
  icon: z.string().default('🧳'),
  title: z.string(),
  body: z.string(),
  price: Price.optional(),
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
});

export const Source = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
});

export const Activity = z.object({
  id: z.string(),
  placeId: z.string(),
  component: z.enum(['ParameterLab', 'StepTimeline', 'LockSim', 'CartoucheMaker']),
  title: z.string(),
  /** Card label in the place template (2–6 chars). */
  label: z.string(),
  icon: z.string(),
  question: z.string(),
  durationMin: z.number(),
  sourceIds: z.array(z.string()).default([]),
});

export type Place = z.infer<typeof Place>;
export type Region = z.infer<typeof Region>;
export type Note = z.infer<typeof Note>;
export type Asset = z.infer<typeof Asset>;
export type Source = z.infer<typeof Source>;
export type Deity = z.infer<typeof Deity>;
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
}
