import { Link, useParams } from 'react-router-dom';
import { notes, regions } from '../data/content';
import { PriceLine } from '../places/Price';
import styles from './Pages.module.css';

export function NotesPage() {
  const { regionId } = useParams();
  const groups = [...regions.map((r) => ({ id: r.id, title: r.nameZh })), { id: 'general', title: '全站共用' }]
    .map((g) => ({ ...g, notes: notes.filter((n) => n.regionId === g.id) }))
    .filter((g) => g.notes.length && (!regionId || g.id === regionId));
  return (
    <div>
      {regionId && (
        <p>
          <Link to="/notes">全部手記</Link>
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
              <p>{n.body}</p>
              {n.price && <PriceLine price={n.price} />}
            </details>
          ))}
        </section>
      ))}
    </div>
  );
}
