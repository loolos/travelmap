/**
 * 「建造大金字塔」教學模型。所有生產率都是遊戲假設，不是考古估計。
 * 每年完成量 Q = min(採石, 運輸, 砌築) × 後勤係數
 */
export const TOTAL_BLOCKS = 2_300_000;
export const TOTAL_WORKERS = 20_000;

/** Game assumptions: blocks per worker per year, and how many others one logistics worker can support. */
export const RATES = { quarry: 15, transport: 20, build: 25 } as const;
export const SUPPORT_PER_LOGISTICS = 8;

export type Stage = 'quarry' | 'transport' | 'build';
export interface Allocation {
  quarry: number;
  transport: number;
  build: number;
  logistics: number;
}

export interface PyramidResult {
  people: Allocation;
  capacity: Record<Stage, number>;
  logisticsFactor: number;
  blocksPerYear: number;
  years: number;
  bottleneck: Stage | 'logistics';
}

/** Allocation is given as relative shares; they are normalised to TOTAL_WORKERS. */
export function simulate(shares: Allocation, totalWorkers = TOTAL_WORKERS): PyramidResult {
  const sum = shares.quarry + shares.transport + shares.build + shares.logistics || 1;
  const people: Allocation = {
    quarry: Math.round((shares.quarry / sum) * totalWorkers),
    transport: Math.round((shares.transport / sum) * totalWorkers),
    build: Math.round((shares.build / sum) * totalWorkers),
    logistics: Math.round((shares.logistics / sum) * totalWorkers),
  };
  const others = people.quarry + people.transport + people.build;
  const logisticsFactor = others === 0 ? 0 : Math.min(1, (people.logistics * SUPPORT_PER_LOGISTICS) / others);
  const capacity = {
    quarry: people.quarry * RATES.quarry * logisticsFactor,
    transport: people.transport * RATES.transport * logisticsFactor,
    build: people.build * RATES.build * logisticsFactor,
  };
  const stages: Stage[] = ['quarry', 'transport', 'build'];
  const minStage = stages.reduce((a, b) => (capacity[b] < capacity[a] ? b : a));
  const blocksPerYear = capacity[minStage];
  return {
    people,
    capacity,
    logisticsFactor,
    blocksPerYear,
    years: blocksPerYear > 0 ? TOTAL_BLOCKS / blocksPerYear : Infinity,
    bottleneck: logisticsFactor < 0.999 ? 'logistics' : minStage,
  };
}

/** Fraction of the pyramid's height reached once `fraction` of its volume is built. */
export function heightFraction(volumeFraction: number): number {
  const f = Math.min(1, Math.max(0, volumeFraction));
  return 1 - Math.cbrt(1 - f);
}

/** The balanced allocation (for tests / the explanation). */
export function optimalShares(): Allocation {
  const inv = { quarry: 1 / RATES.quarry, transport: 1 / RATES.transport, build: 1 / RATES.build };
  const others = inv.quarry + inv.transport + inv.build;
  return { ...inv, logistics: others / SUPPORT_PER_LOGISTICS };
}

export const stageLabel: Record<Stage | 'logistics', string> = {
  quarry: '採石',
  transport: '運輸',
  build: '砌築',
  logistics: '後勤',
};
