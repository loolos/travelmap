/** 木乃伊製作: the classic New Kingdom royal method (Herodotus' account plus finds), about 70 days in all. */
export const MUMMY_STEPS = [
  { id: 'wash', label: '清洗身體', icon: '💧', text: '先用尼羅河水和棕櫚酒把身體洗乾淨。' },
  { id: 'brain', label: '取出大腦', icon: '🪝', text: '用長鉤子從鼻孔把腦取出。古埃及人認為思考靠心臟，腦就丟掉了。' },
  { id: 'organs', label: '取出內臟', icon: '🔪', text: '在左腹開一個切口，取出肝、肺、胃和腸。心臟留在身體裡，因為審判時要秤它。' },
  { id: 'jars', label: '放進卡諾卜罈', icon: '🏺', text: '四種內臟分別放進四個罈子，蓋子是荷魯斯四個兒子的頭：人、狒狒、胡狼和老鷹。' },
  { id: 'natron', label: '泡鹼脫水', icon: '🧂', text: '把身體埋在一種天然鹽「泡鹼」裡約 40 天，水分被吸乾，就不會腐爛。' },
  { id: 'stuff', label: '填充塗油', icon: '🫙', text: '用亞麻布和木屑把身體填回原來的形狀，再塗上油和樹脂。' },
  { id: 'wrap', label: '包亞麻布', icon: '🧻', text: '一層層纏上好幾百公尺的亞麻布，中間夾進護身符，祭司邊包邊念咒語。' },
  { id: 'mask', label: '戴面具入棺', icon: '⚱️', text: '戴上面具、放進人形棺，舉行「開口儀式」讓死者在來世能吃能說，然後下葬。' },
] as const;

export type StepId = (typeof MUMMY_STEPS)[number]['id'];

export interface OrderState {
  placed: StepId[];
  mistakes: number;
  /** The last wrong pick, for feedback. */
  wrong?: StepId;
}

export const startOrder = (): OrderState => ({ placed: [], mistakes: 0 });

export function pick(s: OrderState, id: StepId): OrderState {
  if (s.placed.includes(id) || s.placed.length === MUMMY_STEPS.length) return s;
  const expected = MUMMY_STEPS[s.placed.length].id;
  return id === expected ? { placed: [...s.placed, id], mistakes: s.mistakes } : { ...s, mistakes: s.mistakes + 1, wrong: id };
}

export const isComplete = (s: OrderState) => s.placed.length === MUMMY_STEPS.length;

/** Deterministic shuffle so the deck looks mixed but tests are stable. */
export function shuffled<T>(xs: readonly T[], seed = 7): T[] {
  const a = [...xs];
  let r = seed;
  for (let i = a.length - 1; i > 0; i--) {
    r = (r * 9301 + 49297) % 233280;
    const j = Math.floor((r / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
