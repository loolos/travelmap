/**
 * 「沖積平原」teaching model: how far a flood of a given height spreads over the valley and Delta,
 * and what that means for the harvest. Land is split into four height bands (1 = lowest basins,
 * 4 = highest farmland) plus villages on the highest ground (5). Shares are rough, for illustration.
 */
import { nilometer, type Harvest } from './nile';

export interface Flood {
  key: 'veryLow' | 'low' | 'fair' | 'good' | 'excess';
  name: string;
  /** Peak reading at the Nilometer, cubits (same scale as nilometer()). */
  cubits: number;
  /** Highest band the water reaches at the peak; 5 = villages. */
  reach: 1 | 2 | 3 | 4 | 5;
}

export const FLOODS: readonly Flood[] = [
  { key: 'veryLow', name: '很低', cubits: 12, reach: 1 },
  { key: 'low', name: '偏低', cubits: 13, reach: 2 },
  { key: 'fair', name: '普通', cubits: 14, reach: 3 },
  { key: 'good', name: '剛好', cubits: 16, reach: 4 },
  { key: 'excess', name: '太大', cubits: 18, reach: 5 },
];

export type Phase = 'low' | 'rising' | 'peak' | 'falling' | 'growing' | 'harvest';

export interface Stage {
  phase: Phase;
  month: string;
  name: string;
  /** Share of the year's peak reach that is under water now. */
  water: number;
}

export const STAGES: readonly Stage[] = [
  { phase: 'low', month: '5 月', name: '枯水', water: 0 },
  { phase: 'rising', month: '7 月', name: '漲水', water: 0.5 },
  { phase: 'peak', month: '9 月', name: '最高', water: 1 },
  { phase: 'falling', month: '10 月', name: '退水', water: 0.5 },
  { phase: 'growing', month: '12 月', name: '播種生長', water: 0 },
  { phase: 'harvest', month: '3 月', name: '收割', water: 0 },
];

/** Share of all farmland in each band 1..4 (sums to 1). */
export const BAND_SHARE = [0.15, 0.25, 0.3, 0.3] as const;
export const BANDS = [1, 2, 3, 4] as const;

/** Highest band under water at this stage (0 = river stays in its channel). */
export function waterReach(flood: Flood, stage: Stage): number {
  return Math.round(flood.reach * stage.water);
}

export type LandState = 'water' | 'dry' | 'silt' | 'green' | 'gold' | 'fallow' | 'stubble';

/** What a band of farmland looks like at a stage. */
export function bandState(band: number, flood: Flood, stage: Stage): LandState {
  if (band <= waterReach(flood, stage)) return 'water';
  const watered = band <= flood.reach;
  switch (stage.phase) {
    case 'low':
      return 'stubble';
    case 'rising':
    case 'peak':
      return 'dry';
    case 'falling':
      return watered ? 'silt' : 'dry';
    case 'growing':
      return watered ? 'green' : 'fallow';
    case 'harvest':
      return watered ? 'gold' : 'fallow';
  }
}

/** Villages on the high ground go under only in an excessive flood, around the peak. */
export const villagesFlooded = (flood: Flood, stage: Stage) => waterReach(flood, stage) >= 5;
/** Once an excessive flood has passed, villages and dykes lie in ruins until rebuilt. */
export const villagesRuined = (flood: Flood, stage: Stage) =>
  flood.reach >= 5 && (stage.phase === 'falling' || stage.phase === 'growing' || stage.phase === 'harvest');

/** Share of farmland that got water (and silt) this year, 0..1. */
export function wateredShare(flood: Flood): number {
  return BAND_SHARE.slice(0, Math.min(flood.reach, 4)).reduce((a, b) => a + b, 0);
}

export interface Outcome {
  harvest: Harvest;
  /** Wheat sheaves, 1..5. */
  sheaves: number;
  watered: number;
}

export function outcome(flood: Flood): Outcome {
  const { harvest } = nilometer(flood.cubits);
  const watered = wateredShare(flood);
  // Everything is watered in a deluge, but the late retreat delays sowing and dykes and seed stores are lost.
  const sheaves = harvest === 'deluge' ? 2 : Math.max(1, Math.floor(watered * 5 + 1e-9));
  return { harvest, sheaves, watered };
}
