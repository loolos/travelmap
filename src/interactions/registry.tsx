import type { ComponentType } from 'react';
import { PyramidBuild } from './PyramidBuild';
import { CartoucheMaker } from './CartoucheMaker';
import { DamLab } from './DamLab';
import { KarnakTimeline } from './KarnakTimeline';
import { LockSim } from './LockSim';
import { WhiteDesertTimeline } from './WhiteDesertTimeline';
import { HotspotDiagram } from './HotspotDiagram';
import { IdentifyQuiz } from './IdentifyQuiz';
import { RedSeaLab } from './RedSeaLab';

/** Activity id -> component. Content JSON only names the id; behaviour lives in code. */
export const activityComponents: Record<string, ComponentType<{ activityId: string }>> = {
  'pyramid-build': PyramidBuild,
  'white-desert-story': WhiteDesertTimeline,
  'dam-control': DamLab,
  'esna-lock-sim': LockSim,
  'karnak-timeline': KarnakTimeline,
  cartouche: CartoucheMaker,
  'kom-ombo-plan': HotspotDiagram,
  'mosque-dome-lab': HotspotDiagram,
  'gem-golden-mask': HotspotDiagram,
  'desert-night-sky': HotspotDiagram,
  'black-desert-rocks': IdentifyQuiz,
  'crystal-check': IdentifyQuiz,
  'red-sea-lab': RedSeaLab,
};
