/**
 * The Nile's year before and after the Aswan High Dam, and what a Nilometer reading meant.
 * Levels are relative (0 = lowest, 1 = flood peak) and only show the shape of the year.
 */
export type Season = 'akhet' | 'peret' | 'shemu';

/** Pre-dam relative level per month, Jan..Dec (low in May–Jun, peak in Sep). */
export const BEFORE = [0.25, 0.18, 0.12, 0.08, 0.05, 0.08, 0.3, 0.75, 1, 0.85, 0.5, 0.35];
/** With the High Dam the river stays in its banks all year; summer releases run a bit higher for irrigation. */
export const AFTER = [0.32, 0.32, 0.34, 0.36, 0.4, 0.44, 0.46, 0.44, 0.4, 0.36, 0.34, 0.32];

/** Fields are under water above this level. */
export const FLOOD_LINE = 0.55;

export function season(month: number): Season {
  if (month >= 6 && month <= 9) return 'akhet';
  if (month >= 2 && month <= 5) return 'shemu';
  return 'peret';
}

export const level = (month: number, dam: boolean) => (dam ? AFTER : BEFORE)[((month % 12) + 12) % 12];
export const fieldsFlooded = (month: number, dam: boolean) => level(month, dam) > FLOOD_LINE;

export type Harvest = 'famine' | 'hunger' | 'ok' | 'good' | 'plenty' | 'deluge';

/** Flood height in cubits (cubit ≈ 0.52 m), after the scale Pliny the Elder reports for Memphis. */
export function nilometer(cubits: number): { harvest: Harvest; tax: 0 | 1 | 2 | 3 } {
  if (cubits <= 12) return { harvest: 'famine', tax: 0 };
  if (cubits <= 13) return { harvest: 'hunger', tax: 1 };
  if (cubits <= 14) return { harvest: 'ok', tax: 2 };
  if (cubits <= 15) return { harvest: 'good', tax: 2 };
  if (cubits <= 17) return { harvest: 'plenty', tax: 3 };
  return { harvest: 'deluge', tax: 1 };
}
