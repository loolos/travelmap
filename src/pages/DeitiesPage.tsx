import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deities, placeById, places } from '../data/content';
import { useProgress } from '../progress/store';
import pages from './Pages.module.css';
import styles from './DeitiesPage.module.css';

/** Places whose find list contains this deity. */
const wherePlaces = (deityId: string) => places.filter((p) => p.findItems.some((f) => f.deityId === deityId));

export function DeitiesPage() {
  const progress = useProgress();
  const [open, setOpen] = useState<string | null>(null);
  const got = deities.filter((d) => progress.deities[d.id]?.length).length;
  const sel = deities.find((d) => d.id === open);

  return (
    <div>
      <p className={styles.count}>
        已收集 <strong>{got}</strong> / {deities.length}
      </p>
      <ul className={styles.grid}>
        {deities.map((d) => {
          const have = !!progress.deities[d.id]?.length;
          return (
            <li key={d.id}>
              <button
                type="button"
                className={`${styles.cell} ${open === d.id ? styles.on : ''}`}
                aria-pressed={open === d.id}
                onClick={() => setOpen((c) => (c === d.id ? null : d.id))}
              >
                <span className={have ? styles.icon : styles.silhouette} aria-hidden="true">
                  {d.icon}
                </span>
                <span>{have ? d.nameZh : '？？'}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {sel && (
        <section className={styles.detail} aria-live="polite">
          <h2 className={pages.h2}>
            {progress.deities[sel.id]?.length ? (
              <>
                {sel.icon} {sel.nameZh} <span className="en">{sel.nameEn}</span>
              </>
            ) : (
              '還沒遇到的神'
            )}
          </h2>
          <p>
            <strong>怎麼認：</strong>
            {sel.look}
          </p>
          {progress.deities[sel.id]?.length ? (
            <>
              <p>{sel.role}</p>
              <p className={pages.small}>
                在這裡找到：
                {progress.deities[sel.id].map((id, i) => (
                  <span key={id}>
                    {i > 0 && '、'}
                    <Link to={`/place/${id}`}>{placeById.get(id)?.nameZh ?? id}</Link>
                  </span>
                ))}
              </p>
            </>
          ) : (
            <p className={pages.small}>
              {wherePlaces(sel.id).length ? (
                <>
                  可以去這裡找：
                  {wherePlaces(sel.id).map((p, i) => (
                    <span key={p.id}>
                      {i > 0 && '、'}
                      <Link to={`/place/${p.id}`}>{p.nameZh}</Link>
                    </span>
                  ))}
                  。在「找找看」勾到就會收集。
                </>
              ) : (
                '之後的地點會出現。'
              )}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
