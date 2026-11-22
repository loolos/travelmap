import { activities, artifacts, deities, eras, foods, glyphs, notes, placesByRegion, regions } from '../data/content';
import { foodCategories, noteCollections } from '../data/schema';
import { allPhrases, phraseGroups } from '../pages/arabicData';

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
const timelineItem: NavItem = {
  id: 'timeline',
  to: '/timeline',
  label: '埃及歷史時間線',
  sub: 'History timeline',
  terms: ['timeline', 'history', '歷史', '王朝', '朝代', ...eras.flatMap((e) => [e.nameZh, e.nameEn])],
  icon: '📜',
};

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
        items: places.flatMap((p) => [
          {
            id: `place:${p.id}`,
            to: `/place/${p.id}`,
            label: p.nameZh,
            sub: p.nameEn,
            terms: [p.nameEn, ...p.aliases, p.shortName ?? '', region.nameZh, region.nameEn, ...p.highlights.map((h) => h.name)],
            muted: p.status === 'draft',
          },
          ...(p.kind === 'country' ? [timelineItem] : []),
        ]),
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
          {
            id: 'arabic',
            to: '/arabic',
            label: '生存阿拉伯語',
            sub: 'Egyptian Arabic',
            terms: ['arabic', 'phrase', '阿拉伯語', '短語', '會話', '數字', '多少錢', ...phraseGroups.map((g) => g.title), ...allPhrases.flatMap((p) => [p.zh, p.latin])],
            icon: '💬',
          },
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
          {
            id: 'collection',
            to: '/collection',
            label: '館藏圖鑑',
            sub: 'Museum highlights',
            terms: ['museum', 'collection', '博物館', '藏品', '文物', ...artifacts.flatMap((a) => [a.nameZh, a.nameEn])],
            icon: '🏛️',
          },
          {
            id: 'food',
            to: '/food',
            label: '美食圖鑑',
            sub: 'Egyptian food',
            terms: ['food', 'dish', '吃', '小吃', '甜點', '飲料', ...foodCategories.map((c) => c.title), ...foods.flatMap((f) => [f.nameZh, f.nameEn])],
            icon: '🍽️',
          },
          { ...timelineItem, id: 'timeline-knowledge' },
          {
            id: 'glyphs',
            to: '/glyphs',
            label: '象形文字小字典',
            terms: ['hieroglyph', '符號', '文字', ...glyphs.flatMap((g) => [g.nameZh, g.nameEn])],
            icon: '☥',
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
          { id: 'prep', to: '/prep', label: '行前準備', terms: ['prep', 'packing', 'visa', '簽證', '行李', '清單', '準備'], icon: '✅' },
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
