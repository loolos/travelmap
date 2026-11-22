import type { HotspotSet } from './types';
import { goldenMask } from './goldenMask';
import { komOmbo } from './komOmbo';
import { mosque } from './mosque';
import { nightSky } from './nightSky';
import { khufuInterior } from './khufuInterior';
import { weighingHeart } from './weighingHeart';
import { opet } from './opet';
import { crocMuseum } from './crocMuseum';
import { bahariyaWater } from './bahariyaWater';
import { redSeaRoutes } from './redSeaRoutes';

/** Activity id -> hotspot diagram. */
export const hotspotSets: Record<string, HotspotSet> = {
  'kom-ombo-plan': komOmbo,
  'mosque-dome-lab': mosque,
  'gem-golden-mask': goldenMask,
  'desert-night-sky': nightSky,
  'khufu-interior': khufuInterior,
  'weighing-heart': weighingHeart,
  'opet-festival': opet,
  'croc-museum-case': crocMuseum,
  'bahariya-water': bahariyaWater,
  'redsea-routes': redSeaRoutes,
};
