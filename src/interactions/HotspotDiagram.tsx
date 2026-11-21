import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { hotspotSets } from './sets';
import lab from './Lab.module.css';
import styles from './Hotspot.module.css';

/** A labelled diagram: tap numbered dots to read about each part. */
export function HotspotDiagram({ activityId }: { activityId: string }) {
  const set = hotspotSets[activityId];
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  if (!set) return null;
  const done = seen.size === set.spots.length;
  const open = (i: number) => {
    setActive(i);
    if (seen.has(i)) return;
    const next = new Set(seen).add(i);
    setSeen(next);
    if (next.size === set.spots.length) markActivityDone(activityId);
  };
  const s = active === null ? null : set.spots[active];
  return (
    <div className={lab.lab}>
      <p className={lab.question}>{set.question}</p>
      <p className={lab.how}>{set.how}</p>
      <div className={styles.stage}>
        <svg viewBox={`0 0 ${set.width} ${set.height}`} role="img" aria-label={set.question}>
          {set.draw}
        </svg>
        {set.spots.map((sp, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.spot} ${active === i ? styles.active : seen.has(i) ? styles.seen : ''}`}
            style={{ left: `${(sp.x / set.width) * 100}%`, top: `${(sp.y / set.height) * 100}%` }}
            aria-label={`${i + 1}. ${sp.title}`}
            aria-pressed={active === i}
            onClick={() => open(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className={styles.card} aria-live="polite">
        {s ? (
          <>
            <h3>
              {s.title}
              {s.en && (
                <span className={styles.en} lang="en">
                  {s.en}
                </span>
              )}
            </h3>
            <p>{s.body}</p>
          </>
        ) : (
          <p className={styles.count}>點圖上的數字。</p>
        )}
      </div>
      <p className={styles.count}>
        已看 {seen.size}／{set.spots.length}
      </p>
      {done && <div className={lab.explain}>{set.wrap}</div>}
    </div>
  );
}
