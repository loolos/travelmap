import type { Era } from './schema';

/** The era a year falls in (start inclusive, end exclusive; the last era is open-ended). */
export function eraForYear(eras: Era[], year: number): Era | undefined {
  return eras.find((e) => year >= e.start && (e.end === undefined || year < e.end));
}

/** 前 2560 年 / 西元 969 年 */
export function formatYear(y: number): string {
  return y < 0 ? `前 ${-y} 年` : `西元 ${y} 年`;
}

/** 前 2686 – 前 2181 年 / 1952 年 – 今 */
export function formatSpan(e: Pick<Era, 'start' | 'end'>): string {
  const s = (y: number) => (y < 0 ? `前 ${-y}` : `${y}`);
  return `${s(e.start)} – ${e.end === undefined ? '今' : `${s(e.end)} 年`}`;
}
