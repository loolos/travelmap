import { activities, artifacts, deities, foods, glyphs, placeById } from '../data/content';
import { dayRoleById, type DayLink } from './dayData';
import { phraseGroups } from './arabicData';

/** Where a link inside a moment goes, and what it is called. Undefined = broken (caught by the test). */
export function resolveDayLink(l: DayLink | { kind: 'arabic'; id: string }): { to: string; label: string } | undefined {
  switch (l.kind) {
    case 'place': {
      const p = placeById.get(l.id);
      return p && { to: `/place/${p.id}`, label: `📍 ${p.nameZh}` };
    }
    case 'activity': {
      const a = activities.find((x) => x.id === l.id);
      return a && { to: `/place/${a.placeId}/${a.id}`, label: `${a.icon} ${a.title}` };
    }
    case 'food': {
      const f = foods.find((x) => x.id === l.id);
      return f && { to: `/food/${f.id}`, label: `${f.icon} ${f.nameZh}` };
    }
    case 'artifact': {
      const a = artifacts.find((x) => x.id === l.id);
      return a && { to: `/collection/${a.id}`, label: `🏛️ ${a.nameZh}` };
    }
    case 'deity': {
      const d = deities.find((x) => x.id === l.id);
      return d && { to: `/deities?id=${d.id}`, label: `🏺 ${d.nameZh}` };
    }
    case 'glyph': {
      const g = glyphs.find((x) => x.id === l.id);
      return g && { to: `/glyphs?id=${g.id}`, label: `☥ ${g.nameZh}` };
    }
    case 'arabic': {
      const g = phraseGroups.find((x) => x.id === l.id);
      return g && { to: `/arabic?c=${g.id}`, label: `💬 阿拉伯語：${g.title}` };
    }
    case 'role': {
      const r = dayRoleById.get(l.id);
      return r && { to: `/day/${r.id}`, label: `${r.icon} ${r.name}的一天` };
    }
  }
}

