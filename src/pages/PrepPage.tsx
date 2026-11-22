import { useState } from "react";
import {
  CHECKED_AT,
  decemberWeather,
  prepGroups,
  prepSources,
} from "./prepData";
import styles from "./Pages.module.css";

const KEY = "prep-checked-v1";
const load = (): Record<string, boolean> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
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
  const todo = prepGroups.flatMap((g) => g.items).filter((i) => i.kind !== 'info');
  const total = todo.length;
  const count = todo.filter((i) => done[i.id]).length;
  return (
    <div>
      <p style={{ margin: "0 0 4px" }}>
        已完成 <b>{count}</b>／{total}
      </p>
      <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>
        打勾會存在這支手機上。💡 是建議，其他是必備。點項目看說明。
      </p>
      <section>
        <h2 className={styles.h2}>
          <span aria-hidden="true">🌡️</span> 12 月天氣（歷年平均）
        </h2>
        {decemberWeather.map((w) => (
          <details key={w.id} className={styles.card}>
            <summary>
              <span style={{ flex: 1 }}>{w.place}</span>
              <b style={{ whiteSpace: "nowrap", fontSize: 14 }}>{w.range}</b>
            </summary>
            <p>{w.detail}</p>
          </details>
        ))}
      </section>
      {prepGroups.map((g) => (
        <section key={g.title}>
          <h2 className={styles.h2}>
            <span aria-hidden="true">{g.icon}</span> {g.title}
          </h2>
          {g.items.map((it) => (
            <details key={it.id} className={styles.card}>
              <summary>
                {it.kind === 'info' ? (
                  <span
                    aria-hidden="true"
                    style={{
                      width: 22,
                      textAlign: "center",
                      flex: "none",
                      color: "var(--muted)",
                    }}
                  >
                    ℹ️
                  </span>
                ) : (
                  <input
                    type="checkbox"
                    checked={!!done[it.id]}
                    onChange={() => toggle(it.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`完成：${it.title}`}
                    style={{
                      width: 22,
                      height: 22,
                      accentColor: "var(--lapis)",
                      flex: "none",
                    }}
                  />
                )}
                <span
                  style={
                    it.kind !== 'info' && done[it.id]
                      ? {
                          textDecoration: "line-through",
                          color: "var(--muted)",
                        }
                      : undefined
                  }
                >
                  {it.title}
                </span>
                {it.kind === 'suggest' && (
                  <span title="建議帶" aria-label="建議" style={{ marginLeft: 'auto', flex: 'none' }}>
                    💡
                  </span>
                )}
              </summary>
              <p>{it.detail}</p>
            </details>
          ))}
        </section>
      ))}
      <details style={{ marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
        <summary>
          來源（{CHECKED_AT}查閱，規定可能變動，出發前請再確認）
        </summary>
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
