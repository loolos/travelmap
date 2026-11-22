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
import { SphinxEvidence } from './SphinxEvidence';
import { FeluccaLab } from './FeluccaLab';
import { NileYearLab } from './NileYearLab';
import { FloodplainLab } from './FloodplainLab';
import { NubiaLab } from './NubiaLab';
import { BargainLab } from './BargainLab';
import { AbuSimbelMove } from './AbuSimbelMove';
import { TutDig } from './TutDig';
import { MummyOrder } from './MummyOrder';
import { HorusSetComic } from './HorusSetComic';
import { GizaScale } from './GizaScale';
import { MemnonLab } from './MemnonLab';

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
  'sphinx-evidence': SphinxEvidence,
  'felucca-wind': FeluccaLab,
  'nile-year': NileYearLab,
  'nile-floodplain': FloodplainLab,
  'croc-museum-case': HotspotDiagram,
  'bahariya-water': HotspotDiagram,
  'nubia-flood': NubiaLab,
  'market-bargain': BargainLab,
  'abu-simbel-move': AbuSimbelMove,
  'tut-dig': TutDig,
  'mummy-order': MummyOrder,
  'horus-set-comic': HorusSetComic,
  'khufu-interior': HotspotDiagram,
  'weighing-heart': HotspotDiagram,
  'opet-festival': HotspotDiagram,
  'giza-scale': GizaScale,
  'memnon-song': MemnonLab,
};
