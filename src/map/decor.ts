/** Decorative, schematic map features (not survey data). Coordinates are [lon, lat]. */
export type LL = [number, number];

export interface MapLabel {
  text: string;
  en?: string;
  at: LL;
  kind: 'sea' | 'region' | 'country' | 'river' | 'lake';
  rotate?: number;
  /** Hide when zoomed in past this scale. */
  maxK?: number;
}

export const mapLabels: MapLabel[] = [
  { text: '地中海', en: 'Mediterranean Sea', at: [28.6, 31.85], kind: 'sea' },
  { text: '紅海', en: 'Red Sea', at: [34.65, 26.3], kind: 'sea', rotate: 60 },
  { text: '西部沙漠', en: 'Western Desert', at: [27.1, 24.2], kind: 'region', maxK: 5 },
  { text: '東部沙漠', en: 'Eastern Desert', at: [31.95, 28.55], kind: 'region', maxK: 5 },
  { text: '西奈半島', en: 'Sinai', at: [33.9, 29.35], kind: 'region', maxK: 5 },
  { text: '利比亞', at: [25.2, 29.4], kind: 'country', maxK: 4 },
  { text: '蘇丹', at: [29.2, 21.97], kind: 'country', maxK: 4 },
  { text: '尼羅河', en: 'Nile', at: [30.7, 27.55], kind: 'river', rotate: -60, maxK: 8 },
  { text: '納瑟湖', at: [31.75, 22.85], kind: 'lake', maxK: 8 },
];

/** Oases (rough ellipses: centre, rx°, ry°). */
export const oases: { at: LL; rx: number; ry: number }[] = [
  { at: [28.85, 28.33], rx: 0.18, ry: 0.12 }, // Bahariya
  { at: [27.97, 27.06], rx: 0.12, ry: 0.08 }, // Farafra
  { at: [29.0, 25.5], rx: 0.35, ry: 0.1 }, // Dakhla
  { at: [30.55, 25.4], rx: 0.1, ry: 0.35 }, // Kharga
  { at: [25.5, 29.2], rx: 0.2, ry: 0.06 }, // Siwa
  { at: [30.8, 29.3], rx: 0.22, ry: 0.15 }, // Faiyum
];

/** Little hill symbols for the Red Sea Hills and southern Sinai. */
export const hills: LL[] = [
  [33.1, 27.2],
  [34.1, 25.1],
  [34.5, 24.4],
  [34.9, 23.6],
  [35.2, 23.0],
  [33.9, 24.6],
  [34.4, 23.4],
  [33.95, 28.6],
  [34.2, 28.35],
];
