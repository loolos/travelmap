import type { Note } from '../data/schema';

export function PriceLine({ price }: { price: NonNullable<Note['price']> }) {
  return (
    <p style={{ margin: '6px 0 0', fontSize: 14 }}>
      💰 約 NT${price.lowTwd.toLocaleString()}–{price.highTwd.toLocaleString()}（US${price.lowUsd}–{price.highUsd}）／
      {price.unit}
      <br />
      <small style={{ color: 'var(--muted)' }}>
        {price.note} · 資料 {price.asOf.replace('-', ' 年 ')} 月 · 僅供參考
      </small>
    </p>
  );
}
