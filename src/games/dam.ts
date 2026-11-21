/**
 * 「水壩調度」教學模型（簡化單位，不是實際水文資料）。
 * 每月：儲量 = 前期 + 流入 − 放水 − 蒸發；超過容量的部分只能溢流到下游。
 */

/** Inflow at Aswan in an ordinary year, Jan–Dec (simplified units ≈ billion m³). */
export const NORMAL_YEAR = [4, 3, 3, 3, 3, 4, 12, 20, 18, 8, 5, 4] as const;
/** The four-year scenario: ordinary, big flood, drought, drought. */
export const YEARS = [
  { label: '一般年', factor: 1 },
  { label: '大洪水', factor: 1.4 },
  { label: '乾旱', factor: 0.6 },
  { label: '乾旱', factor: 0.6 },
] as const;
export const CAPACITY = 160;
export const START_STORAGE = 80;
/** Share of the stored water lost to evaporation each month. */
export const EVAPORATION = 0.006;
/** Downstream flow above this floods fields and villages; below DRY the farms go short. */
export const FLOOD = 10;
export const DRY = 4;

export interface Month {
  year: number;
  month: number;
  inflow: number;
  outflow: number;
  storage: number;
  flood: boolean;
  dry: boolean;
}

export interface DamResult {
  months: Month[];
  floodMonths: number;
  dryMonths: number;
  spilled: number;
  evaporated: number;
  verdict: 'both' | 'flood' | 'dry' | 'ok';
}

export function inflows(): number[] {
  return YEARS.flatMap((y) => NORMAL_YEAR.map((v) => v * y.factor));
}

/** Run four years with a constant monthly release, or with no dam at all. */
export function simulateDam(release: number, withDam = true): DamResult {
  let storage = withDam ? START_STORAGE : 0;
  let spilled = 0;
  let evaporated = 0;
  const months = inflows().map((inflow, i) => {
    let outflow: number;
    if (!withDam) {
      outflow = inflow;
    } else {
      const evap = storage * EVAPORATION;
      evaporated += evap;
      storage += inflow - evap;
      outflow = Math.min(release, storage);
      storage -= outflow;
      if (storage > CAPACITY) {
        const spill = storage - CAPACITY;
        spilled += spill;
        outflow += spill;
        storage = CAPACITY;
      }
    }
    return {
      year: Math.floor(i / 12),
      month: i % 12,
      inflow,
      outflow,
      storage,
      flood: outflow > FLOOD,
      dry: outflow < DRY - 1e-9,
    };
  });
  const floodMonths = months.filter((m) => m.flood).length;
  const dryMonths = months.filter((m) => m.dry).length;
  return {
    months,
    floodMonths,
    dryMonths,
    spilled,
    evaporated,
    verdict: floodMonths && dryMonths ? 'both' : floodMonths ? 'flood' : dryMonths ? 'dry' : 'ok',
  };
}
