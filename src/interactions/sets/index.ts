import type { HotspotSet } from './types';
import { goldenMask } from './goldenMask';
import { komOmbo } from './komOmbo';
import { mosque } from './mosque';
import { nightSky } from './nightSky';
import { crocMuseum } from './crocMuseum';
import { bahariyaWater } from './bahariyaWater';

/** Activity id -> hotspot diagram. */
export const hotspotSets: Record<string, HotspotSet> = {
  'kom-ombo-plan': komOmbo,
  'mosque-dome-lab': mosque,
  'gem-golden-mask': goldenMask,
  'desert-night-sky': nightSky,
  'croc-museum-case': crocMuseum,
  'bahariya-water': bahariyaWater,
};
