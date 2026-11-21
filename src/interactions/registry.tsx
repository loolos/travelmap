import type { ComponentType } from 'react';
import { PyramidBuild } from './PyramidBuild';
import { WhiteDesertTimeline } from './WhiteDesertTimeline';

/** Activity id -> component. Content JSON only names the id; behaviour lives in code. */
export const activityComponents: Record<string, ComponentType<{ activityId: string }>> = {
  'pyramid-build': PyramidBuild,
  'white-desert-story': WhiteDesertTimeline,
};
