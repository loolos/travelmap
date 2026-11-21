/**
 * A short market haggling scene as a dialogue graph. Prices are scenario numbers in Egyptian pounds,
 * not real quotes. Each choice leads to another node; nodes without choices are endings.
 */
export interface Choice {
  label: string;
  next: string;
}

export interface Node {
  /** What the seller says or does. */
  say: string;
  /** Current asking price (scenario EGP), shown on screen. */
  ask?: number;
  choices?: Choice[];
  /** Ending grade: 3 = great, 2 = fair, 1 = overpaid, 0 = deal fell through. */
  grade?: 0 | 1 | 2 | 3;
  /** Why this ending happened (shown at the end). */
  lesson?: string;
}

export const START = 'start';

export const nodes: Record<string, Node> = {
  start: {
    say: '「My friend! 歡迎！這張莎草紙畫，最好的品質，只要 800 鎊！」',
    ask: 800,
    choices: [
      { label: '好，我買了！', next: 'payFull' },
      { label: '這是真的莎草紙嗎？', next: 'check' },
      { label: '笑著說「La, shukran」，往外走', next: 'walk' },
    ],
  },
  payFull: {
    say: '老闆笑得很開心，馬上幫你包好。',
    grade: 1,
    lesson: '觀光區的第一個開價常是行情的兩到三倍。先問價、比幾家，再決定。',
  },
  check: {
    say: '老闆把畫對著光：「你看，纖維一條條縱橫交錯，真的！」',
    ask: 800,
    choices: [
      { label: '出價 250', next: 'counter' },
      { label: '出價 50', next: 'insult' },
      { label: '出價 650', next: 'payHigh' },
    ],
  },
  walk: {
    say: '才走兩步，老闆就追出來：「好好好，600！給你特別價！」',
    ask: 600,
    choices: [
      { label: '出價 250', next: 'counter' },
      { label: '出價 50', next: 'insult' },
      { label: '好吧，600', next: 'payHigh' },
    ],
  },
  insult: {
    say: '老闆搖搖頭：「這是手工畫的，你在開玩笑嗎？」轉身去招呼別的客人。',
    grade: 0,
    lesson: '出價太低會讓對方覺得不被尊重。從開價的三分之一左右開始談，比較容易談下去。',
  },
  payHigh: {
    say: '成交！老闆說：「你是我今天最好的朋友。」',
    grade: 1,
    lesson: '只殺一點點就成交，通常還是付多了。可以再多來回一兩次。',
  },
  counter: {
    say: '老闆捂著胸口：「250？我的孩子要吃飯！最低 500。」',
    ask: 500,
    choices: [
      { label: '加到 350，買兩張算 650', next: 'bundle' },
      { label: '「300，不然就算了」，準備離開', next: 'firm' },
      { label: '好，500', next: 'fair' },
    ],
  },
  bundle: {
    say: '老闆想了想：「兩張 700，再送你一張書籤。」你們握手成交。',
    grade: 3,
    lesson: '買多件一起談、讓對方也有面子，常常能拿到好價錢。',
  },
  firm: {
    say: '你走到門口，老闆嘆口氣：「OK，OK，300，就當交個朋友。」',
    grade: 3,
    lesson: '說出底價、態度友善但真的願意走開，是最有效的議價方式。',
  },
  fair: {
    say: '成交。價格不算差，你也省下不少時間。',
    grade: 2,
    lesson: '從 800 談到 500 已經不錯。如果還有時間，可以再試著往下談一點。',
  },
};

/** Every path from START must end at a graded ending. */
export function endings(from = START, seen = new Set<string>()): string[] {
  const n = nodes[from];
  if (!n) throw new Error(`missing node ${from}`);
  if (!n.choices?.length) return [from];
  if (seen.has(from)) throw new Error(`loop at ${from}`);
  seen.add(from);
  return n.choices.flatMap((c) => endings(c.next, new Set(seen)));
}
