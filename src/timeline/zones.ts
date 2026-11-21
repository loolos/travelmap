import type { LL } from '../map/decor';
import type { Era } from '../data/schema';

type Zone = Era['zones'][number];

/**
 * Coarse, hand-drawn territory shapes (lon, lat) for the history timeline. These are 示意 only:
 * each era's own sources describe the real extent; the shapes just show "roughly where".
 * The Nile zones follow the river valley, not the desert either side.
 */
export const zoneShapes: Record<Exclude<Zone, 'modern-egypt'>, LL[]> = {
  // Delta + valley from the Mediterranean to the First Cataract (Aswan).
  'egypt-nile': [
    [29.6, 31.2], [30.4, 31.6], [31.6, 31.6], [32.4, 31.3], [31.9, 30.6], [31.5, 29.9], [31.4, 29.0], [31.2, 28.0],
    [31.6, 27.0], [32.4, 26.4], [33.0, 25.9], [33.1, 25.0], [33.1, 24.0], [32.7, 24.0], [32.6, 25.0], [32.4, 25.9],
    [31.6, 26.4], [30.8, 27.3], [30.5, 28.4], [30.4, 29.2], [30.6, 29.7], [30.6, 30.2], [29.9, 30.8],
  ],
  // First to Second Cataract (Aswan → Wadi Halfa / Semna), now under Lake Nasser.
  'lower-nubia': [
    [32.7, 24.0], [33.1, 24.0], [33.0, 23.3], [32.2, 22.6], [31.5, 21.9], [31.1, 21.4], [30.7, 21.6],
    [31.1, 22.2], [31.9, 23.0], [32.5, 23.6],
  ],
  // Second Cataract to Napata / Jebel Barkal below the Fourth Cataract.
  'upper-nubia': [
    [30.7, 21.6], [31.1, 21.4], [30.9, 20.6], [30.8, 19.6], [31.6, 18.9], [32.4, 19.2], [32.5, 18.7], [31.8, 18.2],
    [30.9, 18.5], [30.2, 19.3], [30.3, 20.6],
  ],
  // Egyptian Sudan under Muhammad Ali: Khartoum, Sennar, Kordofan (beyond Upper Nubia).
  sudan: [
    [30.2, 19.3], [32.5, 18.7], [34.0, 17.5], [36.0, 15.5], [35.5, 12.5], [33.0, 11.0], [29.0, 11.5], [28.0, 13.5],
    [28.5, 16.5],
  ],
  sinai: [
    [32.4, 31.3], [34.2, 31.3], [34.9, 29.5], [34.3, 27.8], [33.6, 28.3], [32.6, 29.9],
  ],
  // Palestine, Lebanon and Syria up to the Euphrates bend.
  levant: [
    [34.2, 31.3], [34.9, 32.8], [35.6, 34.5], [35.8, 35.9], [36.2, 36.6], [37.5, 36.9], [38.3, 36.7], [38.6, 35.8],
    [38.2, 34.4], [37.0, 32.8], [36.2, 31.0], [35.0, 29.5],
  ],
  cyrenaica: [
    [19.9, 30.4], [19.9, 31.4], [20.4, 32.4], [21.6, 32.9], [23.2, 32.6], [25.1, 31.8], [25.1, 30.4],
  ],
  cyprus: [
    [32.3, 34.8], [32.4, 35.1], [33.0, 35.4], [34.6, 35.7], [34.0, 35.0], [33.0, 34.6],
  ],
  // Western Arabia with Mecca and Medina.
  hejaz: [
    [35.0, 29.4], [36.4, 29.0], [38.6, 26.0], [40.5, 22.0], [41.2, 19.6], [40.2, 19.4], [38.8, 21.5], [37.2, 24.5],
    [35.6, 27.4],
  ],
  yemen: [
    [42.7, 16.6], [43.4, 12.8], [44.8, 12.8], [46.2, 14.0], [45.4, 16.4], [43.6, 17.3],
  ],
  // Coastal North Africa west of Cyrenaica (Tripolitania, Ifriqiya).
  'north-africa': [
    [8.6, 36.9], [10.3, 37.3], [11.1, 36.8], [11.0, 35.2], [10.1, 34.0], [11.5, 33.0], [15.2, 32.3], [19.0, 30.3],
    [19.9, 30.4], [19.9, 29.6], [15.0, 30.8], [11.0, 31.6], [9.0, 33.0], [8.0, 35.0],
  ],
};

/** Map labels for orientation (lon, lat). */
export const eraCities: { name: string; at: LL }[] = [
  { name: '孟斐斯', at: [31.25, 29.85] },
  { name: '底比斯', at: [32.64, 25.7] },
  { name: '亞歷山卓', at: [29.92, 31.2] },
  { name: '納帕塔', at: [31.83, 18.53] },
  { name: '耶路撒冷', at: [35.23, 31.78] },
];

/** The Nile south of the map's Egypt section, for drawing (Khartoum → Aswan). */
export const nubianNile: LL[] = [
  [32.53, 15.6], [33.9, 17.7], [33.6, 18.9], [32.6, 19.4], [31.83, 18.53], [30.9, 18.9], [30.5, 19.8],
  [30.9, 20.9], [31.35, 21.8], [32.2, 22.6], [32.9, 23.97], [32.9, 24.1], [32.6, 25.7], [31.0, 27.2],
  [31.2, 30.05],
];
