import { Link, useParams } from 'react-router-dom';
import { assetUrl, notes, regions } from '../data/content';
import { noteCollections, type Note } from '../data/schema';
import { PriceLine } from '../places/Price';
import styles from './Pages.module.css';

/** Splits a collection by its optional `area` sub-heading, keeping first-seen order. */
function byArea(list: Note[]): [string, Note[]][] {
  const m = new Map<string, Note[]>();
  for (const n of list) m.set(n.area ?? '', [...(m.get(n.area ?? '') ?? []), n]);
  return [...m];
}

/** kind 'tips' = 旅人手記 (regions + practical collections); 'knowledge' = 知識 cards. */
export function NotesPage({ kind = 'tips' }: { kind?: 'tips' | 'knowledge' }) {
  const { regionId } = useParams();
  const base = kind === 'tips' ? '/notes' : '/knowledge';
  const groups = [
    ...(kind === 'tips' ? regions.map((r) => ({ id: r.id, title: r.nameZh })) : []),
    ...noteCollections.filter((c) => c.kind === kind).map((c) => ({ id: c.id, title: c.title })),
  ]
    .map((g) => ({ ...g, notes: notes.filter((n) => n.regionId === g.id) }))
    .filter((g) => g.notes.length && (!regionId || g.id === regionId));
  return (
    <div>
      {regionId && (
        <p>
          <Link to={base}>{kind === 'tips' ? '全部手記' : '全部知識卡'}</Link>
        </p>
      )}
      {groups.map((g) => (
        <section key={g.id}>
          <h2 className={styles.h2}>{g.title}</h2>
          {byArea(g.notes).map(([area, list]) => (
            <div key={area || '-'}>
              {area && <h3 className={styles.h3}>{area}</h3>}
              {list.map((n) => (
                <details key={n.id} className={styles.card}>
                  <summary>
                    <span aria-hidden="true">{n.icon}</span> {n.title}
                  </summary>
                  {n.assetId && <img className={styles.notePic} src={assetUrl(n.assetId)} alt={n.title} loading="lazy" />}
                  <p>{n.body}</p>
                  {n.price && <PriceLine price={n.price} />}
                </details>
              ))}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
