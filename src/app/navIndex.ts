import { activities, deities, notes, placesByRegion, regions } from '../data/content';
import { noteCollections } from '../data/schema';

export interface NavItem {
  id: string;
  to: string;
  label: string;
  sub?: string;
  /** Extra search terms (English names, aliases). */
  terms: string[];
  icon?: string;
  muted?: boolean;
}
export interface NavGroup {
  title: string;
  /** Optional sub-headings inside a group (e.g. regions). */
  sections: { title?: string; items: NavItem[] }[];
}

/** Everything reachable in the app, generated from content so nothing can be left out. */
export function buildNavIndex(): NavGroup[] {
  const groups: NavGroup[] = [
    {
      title: '地圖',
      sections: [{ items: [{ id: 'map', to: '/map', label: '埃及全境地圖', terms: ['map', 'egypt'], icon: '🗺️' }] }],
    },
    {
      title: '地點',
      sections: placesByRegion.map(({ region, places }) => ({
        title: region.nameZh,
        items: places.map((p) => ({
          id: `place:${p.id}`,
          to: `/place/${p.id}`,
          label: p.nameZh,
          sub: p.nameEn,
          terms: [p.nameEn, ...p.aliases, p.shortName ?? '', region.nameZh, region.nameEn],
          muted: p.status === 'draft',
        })),
      })),
    },
  ];
  if (activities.length)
    groups.push({
      title: '互動',
      sections: [
        {
          items: activities.map((a) => ({
            id: `activity:${a.id}`,
            to: `/place/${a.placeId}/${a.id}`,
            label: a.title,
            terms: [a.label],
            icon: a.icon,
          })),
        },
      ],
    });
  const noteRegions = regions.filter((r) => notes.some((n) => n.regionId === r.id));
  const withNotes = (kind: 'tips' | 'knowledge') =>
    noteCollections.filter((c) => c.kind === kind && notes.some((n) => n.regionId === c.id));
  groups.push({
    title: '旅人手記',
    sections: [
      {
        items: [
          ...noteRegions.map((r) => ({
            id: `notes:${r.id}`,
            to: `/notes/${r.id}`,
            label: `${r.nameZh}手記`,
            terms: [r.nameEn, ...notes.filter((n) => n.regionId === r.id).map((n) => n.title)],
            icon: '🧳',
          })),
          ...withNotes('tips').map((c) => ({
            id: `notes:${c.id}`,
            to: `/notes/${c.id}`,
            label: c.title,
            terms: notes.filter((n) => n.regionId === c.id).map((n) => n.title),
            icon: c.icon,
          })),
        ],
      },
    ],
  });
  groups.push({
    title: '知識',
    sections: [
      {
        items: [
          {
            id: 'deities',
            to: '/deities',
            label: '神祇圖鑑',
            terms: ['gods', 'deity', '神', ...deities.flatMap((d) => [d.nameZh, d.nameEn])],
            icon: '🏺',
          },
          ...withNotes('knowledge').map((c) => ({
            id: `knowledge:${c.id}`,
            to: `/knowledge/${c.id}`,
            label: c.title,
            terms: [c.id, ...notes.filter((n) => n.regionId === c.id).map((n) => n.title)],
            icon: c.icon,
          })),
        ],
      },
    ],
  });
  groups.push({
    title: '我的',
    sections: [
      {
        items: [
          { id: 'journal', to: '/journal', label: '探索日誌', terms: ['journal', '進度', '到訪'], icon: '📔' },
          { id: 'offline', to: '/offline', label: '離線下載', terms: ['offline', '下載', '設定'], icon: '📥' },
        ],
      },
    ],
  });
  return groups;
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, '');

export function matches(item: NavItem, q: string): boolean {
  if (!q) return true;
  const n = norm(q);
  return [item.label, item.sub ?? '', ...item.terms].some((t) => norm(t).includes(n));
}
