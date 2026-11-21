import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Sheet.module.css';

/** Full-height page that slides over the map (journal, offline, notes…). */
export function Sheet({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <section className={styles.sheet} aria-label={title}>
      <header className={styles.head}>
        <h1>{title}</h1>
        <button type="button" className={styles.close} onClick={() => navigate('/map')} aria-label="回到地圖">
          ✕
        </button>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
