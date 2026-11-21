import { useState } from 'react';
import type { Place } from '../data/schema';
import styles from './PlacePanel.module.css';

const KINDS = {
  geo: { icon: '🌍', label: '地理' },
  nature: { icon: '🌿', label: '自然' },
  today: { icon: '🏙️', label: '今日' },
} as const;

/** Geography / nature / today chips under the (mostly historical) facts; text shows on tap. */
export function Aspects({ items }: { items: Place['aspects'] }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!items.length) return null;
  const cur = items.find((a) => a.kind === open);
  return (
    <div className={styles.aspects}>
      <div className={styles.aspectChips}>
        {items.map((a) => (
          <button
            key={a.kind}
            type="button"
            aria-expanded={open === a.kind}
            onClick={() => setOpen((o) => (o === a.kind ? null : a.kind))}
          >
            <span aria-hidden="true">{KINDS[a.kind].icon}</span> {KINDS[a.kind].label}
          </button>
        ))}
      </div>
      {cur && (
        <p className={styles.aspectText}>
          <span aria-hidden="true">{KINDS[cur.kind].icon}</span> {cur.text}
        </p>
      )}
    </div>
  );
}
