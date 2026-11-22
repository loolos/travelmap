/**
 * The Sahara's last 20,000 years: from the dry ice-age desert to the Green Sahara and back,
 * and where people lived. Greenness is relative (0 = bare desert, 1 = wettest) and only shows the shape.
 */
export type People = 'none' | 'hunters' | 'herders' | 'moving' | 'nile';

export interface Stage {
  id: string;
  /** Years before present. */
  yearsAgo: number;
  name: string;
  green: number;
  people: People;
  text: string;
}

export const STAGES: Stage[] = [
  { id: 'ice', yearsAgo: 20000, name: '冰期的大旱', green: 0.02, people: 'none', text: '冰期末段，撒哈拉比今天更乾、更大，幾乎沒有人住。' },
  { id: 'green', yearsAgo: 10000, name: '綠色撒哈拉', green: 1, people: 'hunters', text: '季風雨帶北移：湖泊、草原、長頸鹿和河馬，獵人在湖邊捕魚。' },
  { id: 'herders', yearsAgo: 7000, name: '放牧牛群', green: 0.8, people: 'herders', text: '人們趕著牛群逐水草而居，在岩壁上畫下牛群和游泳的人。' },
  { id: 'drying', yearsAgo: 5500, name: '雨帶南退', green: 0.35, people: 'moving', text: '北非夏天日照轉弱，季風南退，湖泊縮小。牧人帶著牲口往尼羅河谷和綠洲遷移。' },
  { id: 'pharaohs', yearsAgo: 5100, name: '法老出現', green: 0.12, people: 'nile', text: '人群擠進窄窄的河谷，要一起治水、分糧；約西元前 3100 年上下埃及統一。' },
  { id: 'today', yearsAgo: 0, name: '只剩綠洲', green: 0.02, people: 'nile', text: '只剩綠洲靠地底的「化石水」維生；沙漠裡還找得到當年的湖底和岩畫。' },
];

/** Greenness at any time, linearly interpolated between the stages. */
export function greenness(yearsAgo: number): number {
  const s = STAGES;
  if (yearsAgo >= s[0].yearsAgo) return s[0].green;
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1];
    const b = s[i];
    if (yearsAgo >= b.yearsAgo) return a.green + ((a.yearsAgo - yearsAgo) / (a.yearsAgo - b.yearsAgo)) * (b.green - a.green);
  }
  return s[s.length - 1].green;
}

/** Share of the people who live in the Nile valley rather than out in the Sahara (0..1). */
export const nileShare = (green: number) => Math.max(0, Math.min(1, 1 - green));

export const hasLakes = (green: number) => green >= 0.5;
