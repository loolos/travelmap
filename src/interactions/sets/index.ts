import type { HotspotSet } from './types';
import { goldenMask } from './goldenMask';
import { komOmbo } from './komOmbo';
import { mosque } from './mosque';
import { nightSky } from './nightSky';
import { khufuInterior } from './khufuInterior';
import { weighingHeart } from './weighingHeart';
import { opet } from './opet';

/** Activity id -> hotspot diagram. */
export const hotspotSets: Record<string, HotspotSet> = {
  'kom-ombo-plan': komOmbo,
  'mosque-dome-lab': mosque,
  'gem-golden-mask': goldenMask,
  'desert-night-sky': nightSky,
  'khufu-interior': khufuInterior,
  'weighing-heart': weighingHeart,
  'opet-festival': opet,
};
