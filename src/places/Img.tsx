import { useState } from 'react';
import { assetById, assetUrl, kindLabel } from '../data/content';
import type { PlaceKind } from '../data/schema';
import { kindStyle } from '../map/KindMarker';
import styles from './PlacePanel.module.css';

const kindEmoji: Record<PlaceKind, string> = {
  tomb: '🔺',
  statue: '🗿',
  temple: '🏛️',
  mosque: '🕌',
  fortress: '🏰',
  city: '🏙️',
  geology: '🪨',
  ecology: '🌌',
  water: '🌊',
  museum: '🏺',
};

/** Hero image with kind badge; falls back to a local placeholder when offline or missing. */
export function Hero({ assetId, kind, small }: { assetId?: string; kind: PlaceKind; small?: boolean }) {
  const [failed, setFailed] = useState(false);
  const asset = assetId ? assetById.get(assetId) : undefined;
  const src = assetUrl(assetId);
  if (!asset || !src || failed) {
    return (
      <div
        className={small ? styles.thumb : styles.heroPh}
        style={{ background: `linear-gradient(135deg, var(--sand), ${kindStyle[kind].color}55)` }}
        role="img"
        aria-label={asset?.alt ?? '尚無圖片'}
      >
        <span aria-hidden="true">{kindEmoji[kind]}</span>
      </div>
    );
  }
  if (small) return <img className={styles.thumb} src={src} alt="" onError={() => setFailed(true)} />;
  return (
    <figure className={styles.hero}>
      <img src={src} alt={asset.alt} onError={() => setFailed(true)} />
      <figcaption className={styles.badge}>{kindLabel[asset.kind]}</figcaption>
    </figure>
  );
}
