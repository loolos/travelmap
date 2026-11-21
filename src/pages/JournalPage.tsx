import { useState } from 'react';
import { Link } from 'react-router-dom';
import { places } from '../data/content';
import { isLit, resetAll, useProgress } from '../progress/store';
import styles from './Pages.module.css';

export function JournalPage() {
  const p = useProgress();
  const [confirm, setConfirm] = useState(false);
  const opened = places.filter((x) => p.opened[x.id]).length;
  const lit = places.filter((x) => isLit(x, p));
  const visited = places.filter((x) => p.visited[x.id]);
  const withFind = places.filter((x) => x.findItems.length).length;
  return (
    <div>
      <div className={styles.stats}>
        <Stat n={`${lit.length}/${withFind}`} label="已點亮" />
        <Stat n={`${visited.length}`} label="已到訪" />
        <Stat n={`${opened}/${places.length}`} label="已看過" />
      </div>
      <h2 className={styles.h2}>已點亮的地點</h2>
      <PlaceList items={lit} empty="到現場完成「找找看」，地點就會亮起。" />
      <h2 className={styles.h2}>已到訪</h2>
      <PlaceList items={visited} empty="在地點頁按「到訪」做標記。" />
      <h2 className={styles.h2}>重設</h2>
      {confirm ? (
        <p>
          確定清除所有進度？
          <button
            type="button"
            className={styles.danger}
            onClick={() => {
              resetAll();
              setConfirm(false);
            }}
          >
            清除
          </button>
          <button type="button" className={styles.btn} onClick={() => setConfirm(false)}>
            取消
          </button>
        </p>
      ) : (
        <button type="button" className={styles.btn} onClick={() => setConfirm(true)}>
          重設全部進度
        </button>
      )}
      <p className={styles.small}>進度只存在這台裝置上，不會上傳。</p>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className={styles.stat}>
      <strong>{n}</strong>
      <span>{label}</span>
    </div>
  );
}

function PlaceList({ items, empty }: { items: typeof places; empty: string }) {
  if (!items.length) return <p className={styles.small}>{empty}</p>;
  return (
    <ul className={styles.list}>
      {items.map((x) => (
        <li key={x.id}>
          <Link to={`/place/${x.id}`}>{x.nameZh}</Link>
        </li>
      ))}
    </ul>
  );
}
