export type InlineSegment =
  | { type: 'text'; text: string }
  | { type: 'link'; text: string; kind: 'place' | 'activity' | 'note'; id: string };

const LINK_RE = /\[([^\]]+)\]\((place|activity|note):([a-z0-9-]+)\)/g;

/** Parse "[文字](place:id)" style inline links. */
export function parseInline(src: string): InlineSegment[] {
  const out: InlineSegment[] = [];
  let last = 0;
  for (const m of src.matchAll(LINK_RE)) {
    if (m.index > last) out.push({ type: 'text', text: src.slice(last, m.index) });
    out.push({ type: 'link', text: m[1], kind: m[2] as 'place', id: m[3] });
    last = m.index + m[0].length;
  }
  if (last < src.length) out.push({ type: 'text', text: src.slice(last) });
  return out;
}

export function plainText(src: string): string {
  return parseInline(src)
    .map((s) => s.text)
    .join('');
}

/** Rough "字數": CJK characters count 1 each, each Latin word counts 1; spaces & punctuation ignored. */
export function charCount(src: string): number {
  const text = plainText(src);
  const cjk = text.match(/[㐀-鿿豈-﫿]/g)?.length ?? 0;
  const words = text.replace(/[㐀-鿿豈-﫿]/g, ' ').match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return cjk + words;
}
