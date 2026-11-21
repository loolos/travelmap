/**
 * Abu Simbel sun festival model. Twice a year the rising sun shines down the ~60 m axis of the
 * Great Temple and lights the sanctuary statues; Ptah, god of the underworld, stays in the dark.
 * Today this happens around 22 February and 22 October (often said to be a day later than before the
 * 1960s move). Outside a few days around those dates the beam falls on the walls instead.
 */
export const SANCTUARY = [
  { id: 'ptah', nameZh: '普塔', lit: false },
  { id: 'amun', nameZh: '阿蒙', lit: true },
  { id: 'ramesses', nameZh: '拉美西斯二世', lit: true },
  { id: 'ra', nameZh: '拉－荷拉克提', lit: true },
] as const;

export const FESTIVALS = [
  { month: 2, day: 22 },
  { month: 10, day: 22 },
] as const;

const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
export const dayOfYear = (month: number, day: number) => DAYS.slice(0, month - 1).reduce((a, b) => a + b, 0) + day;

/** Days from the nearest festival date (0 on the day). */
export function daysFromFestival(month: number, day: number): number {
  const d = dayOfYear(month, day);
  return Math.min(
    ...FESTIVALS.map((f) => {
      const diff = Math.abs(d - dayOfYear(f.month, f.day));
      return Math.min(diff, 365 - diff);
    }),
  );
}

/** How far the beam gets: 'sanctuary' within a day of the festival, 'hall' within ~2 weeks, else 'door'. */
export function beamReach(month: number, day: number): 'sanctuary' | 'hall' | 'door' {
  const n = daysFromFestival(month, day);
  return n <= 1 ? 'sanctuary' : n <= 14 ? 'hall' : 'door';
}

/** Relocation numbers (Wikipedia, UNESCO). */
export const MOVE = { years: '1964–1968', higherM: 65, backM: 200, avgTonnes: 20, maxTonnes: 30 } as const;
