import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CHECKED_AT, prepGroups, prepSources } from './prepData';
import styles from './Pages.module.css';

const KEY = 'prep-checked-v1';
const load = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
};

/** 行前準備: tickable checklist, details on tap, saved on this device. */
export function PrepPage() {
  const [done, setDone] = useState<Record<string, boolean>>(load);
  const toggle = (id: string) =>
    setDone((d) => {
      const next = { ...d, [id]: !d[id] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* private mode: ticks last for this visit only */
      }
      return next;
    });
  const total = prepGroups.reduce((n, g) => n + g.items.length, 0);
  const count = prepGroups.reduce((n, g) => n + g.items.filter((i) => done[i.id]).length, 0);
  return (
    <div>
      <p style={{ margin: '0 0 4px' }}>
        已完成 <b>{count}</b>／{total}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>打勾會存在這支手機上。點項目看說明。</p>
      {prepGroups.map((g) => (
        <section key={g.title}>
          <h2 className={styles.h2}>
            <span aria-hidden="true">{g.icon}</span> {g.title}
          </h2>
          {g.items.map((it) => (
            <details key={it.id} className={styles.card}>
              <summary>
                <input
                  type="checkbox"
                  checked={!!done[it.id]}
                  onChange={() => toggle(it.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`完成：${it.title}`}
                  style={{ width: 22, height: 22, accentColor: 'var(--lapis)', flex: 'none' }}
                />
                <span style={done[it.id] ? { textDecoration: 'line-through', color: 'var(--muted)' } : undefined}>{it.title}</span>
              </summary>
              <p>
                {it.detail}
                {it.id === 'offline' && (
                  <>
                    {' '}
                    <Link to="/offline">前往離線下載 →</Link>
                  </>
                )}
              </p>
            </details>
          ))}
        </section>
      ))}
      <details style={{ marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
        <summary>來源（{CHECKED_AT}查閱，規定可能變動，出發前請再確認）</summary>
        <ul>
          {prepSources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
