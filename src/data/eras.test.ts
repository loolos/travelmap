import { describe, expect, it } from 'vitest';
import { eraForYear, formatSpan, formatYear } from './eras';
import type { Era } from './schema';

const mk = (id: string, start: number, end?: number) => ({ id, start, end }) as Era;
const eras = [mk('a', -3000, -1000), mk('b', -1000, 500), mk('c', 500)];

describe('eras', () => {
  it('finds the era with start inclusive and end exclusive', () => {
    expect(eraForYear(eras, -3000)?.id).toBe('a');
    expect(eraForYear(eras, -1000)?.id).toBe('b');
    expect(eraForYear(eras, 2025)?.id).toBe('c');
    expect(eraForYear(eras, -4000)).toBeUndefined();
  });
  it('formats BCE and CE years', () => {
    expect(formatYear(-2560)).toBe('前 2560 年');
    expect(formatYear(969)).toBe('西元 969 年');
    expect(formatSpan({ start: -2686, end: -2181 })).toBe('前 2686 – 前 2181 年');
    expect(formatSpan({ start: 1952 })).toBe('1952 – 今');
  });
});
