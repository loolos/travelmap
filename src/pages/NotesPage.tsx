import { Link, useParams } from 'react-router-dom';
import { assetUrl, notes, regions } from '../data/content';
import { noteCollections } from '../data/schema';
import { PriceLine } from '../places/Price';
import styles from './Pages.module.css';

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
          {g.notes.map((n) => (
            <details key={n.id} className={styles.card}>
              <summary>
                <span aria-hidden="true">{n.icon}</span> {n.title}
              </summary>
              {n.assetId && <img className={styles.notePic} src={assetUrl(n.assetId)} alt={n.title} loading="lazy" />}
              <p>{n.body}</p>
              {n.price && <PriceLine price={n.price} />}
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
