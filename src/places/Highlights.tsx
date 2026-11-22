import { useEffect, useRef, useState } from 'react';
import type { Place } from '../data/schema';
import { assetById, assetUrl } from '../data/content';
import styles from './PlacePanel.module.css';

/** 看點: tiles for notable objects inside a site (icon + short name); detail and photo show on tap. */
export function Highlights({ items }: { items: Place['highlights'] }) {
  const [open, setOpen] = useState<string | null>(null);
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) card.current?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [open]);
  if (!items.length) return null;
  const cur = items.find((h) => h.id === open);
  const asset = cur?.assetId ? assetById.get(cur.assetId) : undefined;
  const src = assetUrl(cur?.assetId);
  return (
    <div className={styles.highlights}>
      <h2>看點</h2>
      <div className={styles.hlGrid}>
        {items.map((h) => (
          <button
            key={h.id}
            type="button"
            aria-expanded={open === h.id}
            onClick={() => setOpen((o) => (o === h.id ? null : h.id))}
          >
            <span aria-hidden="true">{h.icon}</span>
            <span>{h.name}</span>
          </button>
        ))}
      </div>
      {cur && (
        <div ref={card} className={styles.hlCard} aria-live="polite">
          {asset && src && (
            <figure>
              <img src={src} alt={asset.alt} loading="lazy" />
              <figcaption>
                {asset.credit} · {asset.license}
              </figcaption>
            </figure>
          )}
          <h3>
            <span aria-hidden="true">{cur.icon}</span> {cur.name}
          </h3>
          <p>{cur.text}</p>
        </div>
      )}
    </div>
  );
}
