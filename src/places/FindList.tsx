import { useState } from 'react';
import type { FindItem, Place } from '../data/schema';
import { Link } from 'react-router-dom';
import { assetById, assetUrl, deityById } from '../data/content';
import { toggleFound, type Progress } from '../progress/store';
import { InlineText } from './InlineText';
import styles from './PlacePanel.module.css';

/** 找找看: checkbox to tick, tap the text for a hint (and a circle on the photo when available). */
export function FindList({ place, progress }: { place: Place; progress: Progress }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className={styles.find}>
      {place.findItems.map((f) => {
        const on = !!progress.found[f.id];
        const isOpen = open === f.id;
        return (
          <li key={f.id}>
            <div className={`${styles.findRow} ${on ? styles.foundOn : ''}`}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => toggleFound(place, f.id)}
                aria-label={`找到了：${f.text}`}
              />
              <button
                type="button"
                className={styles.findText}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : f.id)}
              >
                <span>{f.text}</span>
                {f.deityId && (
                  <span className={on ? styles.deityOn : styles.deityOff} title="可收集的神祇" aria-label="可收集的神祇">
                    {deityById.get(f.deityId)?.icon}
                  </span>
                )}
                {f.hint && <span className={styles.hintIcon} aria-hidden="true">{isOpen ? '▴' : '💡'}</span>}
              </button>
            </div>
            {isOpen && f.hint && <Hint item={f} place={place} />}
          </li>
        );
      })}
    </ul>
  );
}

function Hint({ item, place }: { item: FindItem; place: Place }) {
  const [aspect, setAspect] = useState(1.6);
  const spot = item.spot;
  const assetId = spot?.assetId ?? place.heroAssetId;
  const src = spot ? assetUrl(assetId) : undefined;
  const asset = assetId ? assetById.get(assetId) : undefined;
  return (
    <div className={styles.hintBox}>
      <p>
        <InlineText text={item.hint ?? ''} />
      </p>
      {item.deityId && (
        <p className={styles.deityNote}>
          勾選後收進 <Link to="/deities">神祇圖鑑</Link>
        </p>
      )}
      {spot && src && (
        <figure className={styles.spotFig}>
          <img
            src={src}
            alt={asset?.alt ?? ''}
            onLoad={(e) => setAspect(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight || 1.6)}
          />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <ellipse
              className={styles.spotRing}
              cx={spot.x}
              cy={spot.y}
              rx={spot.r}
              ry={spot.r * aspect}
            />
          </svg>
          <figcaption>看圈起來的地方</figcaption>
        </figure>
      )}
    </div>
  );
}
