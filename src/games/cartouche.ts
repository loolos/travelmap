/**
 * 王名圈產生器：把拉丁字母（英文名或拼音）轉成單子音象形符號。
 * 這是現代的趣味音譯，古埃及文字只寫子音，也沒有和英文字母一一對應的規則。
 */

export interface Sign {
  /** Latin letters this sign stands for here. */
  latin: string;
  glyph: string;
  nameZh: string;
  gardiner: string;
}

const S = (glyph: string, nameZh: string, gardiner: string) => ({ glyph, nameZh, gardiner });

export const SIGNS: Record<string, Omit<Sign, 'latin'>> = {
  a: S('\u{1313F}', '禿鷲', 'G1'),
  b: S('\u{130C0}', '腳', 'D58'),
  k: S('\u{133A1}', '提籃', 'V31'),
  d: S('\u{130A7}', '手', 'D46'),
  i: S('\u{131CB}', '蘆葦', 'M17'),
  f: S('\u{13191}', '角蝰', 'I9'),
  g: S('\u{133BC}', '罐架', 'W11'),
  h: S('\u{13254}', '院落', 'O4'),
  j: S('\u{13193}', '眼鏡蛇', 'I10'),
  l: S('\u{130ED}', '獅子', 'E23'),
  m: S('\u{13153}', '貓頭鷹', 'G17'),
  n: S('\u{13216}', '水波', 'N35'),
  o: S('\u{1336F}', '繩套', 'V4'),
  p: S('\u{132AA}', '凳子', 'Q3'),
  q: S('\u{1320E}', '山坡', 'N29'),
  r: S('\u{1308B}', '嘴', 'D21'),
  s: S('\u{132F4}', '摺布', 'S29'),
  t: S('\u{133CF}', '麵包', 'X1'),
  w: S('\u{13171}', '鵪鶉雛鳥', 'G43'),
  y: S('\u{131CC}', '雙蘆葦', 'M17a'),
  z: S('\u{13283}', '門閂', 'O34'),
  sh: S('\u{13219}', '水池', 'N37'),
  ch: S('\u{1337F}', '繩索', 'V13'),
  kh: S('\u{1340D}', '圓篩', 'Aa1'),
};

/** Every glyph the generator can output (the bundled font is subset to these). */
export const ALL_GLYPHS = Object.values(SIGNS).map((s) => s.glyph);

export const MAX_LETTERS = 14;

export function transliterate(input: string): Sign[] {
  const s = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
    .slice(0, MAX_LETTERS);
  const out: Sign[] = [];
  const push = (key: string, latin: string) => {
    // A doubled letter is written once (as in Egyptian spelling).
    if (out.length && out[out.length - 1].latin === latin) return;
    out.push({ latin, ...SIGNS[key] });
  };
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const two = s.slice(i, i + 2);
    if (two === 'sh' || two === 'ch' || two === 'kh') {
      push(two, two);
      i++;
    } else if (two === 'ph') {
      push('f', 'ph');
      i++;
    } else if (two === 'th') {
      push('t', 'th');
      i++;
    } else if (c === 'c') push('eiy'.includes(s[i + 1] ?? '') ? 's' : 'k', 'c');
    else if (c === 'x') {
      push('k', 'x');
      push('s', 'x·s');
    } else if (c === 'e') push('i', 'e');
    else if (c === 'u') push('w', 'u');
    else if (c === 'v') push('f', 'v');
    else push(c, c);
  }
  return out;
}
