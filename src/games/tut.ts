/**
 * 找圖坦卡門: Howard Carter's search in the Valley of the Kings (1917–1922), simplified.
 * The tomb (KV62) lay under the rubble of ancient workmen's huts below the tomb of Ramesses VI (KV9).
 */
export interface DigSpot {
  id: string;
  label: string;
  /** Map position in a 320×190 sketch. */
  x: number;
  y: number;
  result: string;
  clue?: boolean;
  tomb?: boolean;
}

export const SPOTS: DigSpot[] = [
  { id: 'kv57', label: '山谷西側', x: 58, y: 70, result: '挖到霍朗赫布的墓，但 1908 年就被人發現，裡面早被盜過。' },
  { id: 'kv54', label: '小岩坑', x: 120, y: 48, result: '1907 年在這附近找到一個坑，裡面的陶罐和布條寫著「圖坦卡門」。他一定葬在這座山谷！', clue: true },
  { id: 'bedrock', label: '山谷深處', x: 268, y: 46, result: '一路挖到岩盤，什麼也沒有。' },
  { id: 'rubble', label: '碎石堆', x: 214, y: 132, result: '只有以前挖墓丟出來的碎石。' },
  { id: 'kv9', label: '拉美西斯六世墓', x: 176, y: 72, result: '這座墓從古代就開著，大家都知道。但它下方有一片古代工人小屋……' },
  { id: 'huts', label: '工人小屋遺跡', x: 160, y: 112, result: '1922 年 11 月 4 日，小屋底下露出一級往下的石階！', tomb: true },
];

export const SEASONS = 5;

export interface DigState {
  dug: string[];
  found: boolean;
}

export const startDig = (): DigState => ({ dug: [], found: false });

export function dig(s: DigState, id: string): DigState {
  if (s.found || s.dug.includes(id)) return s;
  const spot = SPOTS.find((x) => x.id === id);
  if (!spot) return s;
  return { dug: [...s.dug, id], found: !!spot.tomb };
}

/** Seasons left before Lord Carnarvon's money runs out; the game grants one last season instead of failing. */
export const seasonsLeft = (s: DigState) => Math.max(0, SEASONS - s.dug.length);

/** Layers opened from the outside in. */
export const LAYERS = [
  { id: 'steps', label: '16 級石階', text: '石階往下通到一扇封住的門，門上蓋著王室墓地的印章。' },
  { id: 'antechamber', label: '前室', text: '卡特從小洞往裡看。「看到什麼了嗎？」「看到了，好多奇妙的東西！」金色的床、戰車、箱子堆滿房間。' },
  { id: 'shrines', label: '四層鍍金木龕', text: '墓室裡是一個套一個的四層鍍金木龕，幾乎塞滿整個房間。' },
  { id: 'sarcophagus', label: '石棺', text: '最裡面是一具石英岩石棺，四個角刻著展開翅膀的女神。' },
  { id: 'coffins', label: '三層人形棺', text: '石棺裡有三層人形棺，最內層是純金打造，重約 110 公斤。' },
  { id: 'mask', label: '黃金面具', text: '法老臉上戴著約 10 公斤重的黃金面具，鑲著青金石和玻璃。' },
] as const;
