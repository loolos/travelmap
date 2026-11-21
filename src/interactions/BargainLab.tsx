import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { nodes, START } from '../games/bargain';
import lab from './Lab.module.css';
import styles from './Hotspot.module.css';

const GRADE = ['沒買成', '多付了', '還不錯', '高手！'];

/** Khan el-Khalili haggling scene: pick what to say, see how it ends. */
export function BargainLab({ activityId }: { activityId: string }) {
  const [id, setId] = useState(START);
  const [log, setLog] = useState<string[]>([]);
  const n = nodes[id];
  const go = (label: string, next: string) => {
    setLog((l) => [...l, label]);
    setId(next);
    if (!nodes[next].choices?.length) markActivityDone(activityId);
  };
  const end = !n.choices?.length;
  return (
    <div className={lab.lab}>
      <p className={lab.question}>在市集看中一張莎草紙畫，要怎麼談價？</p>
      <p className={lab.how}>選你要說的話，看老闆怎麼回應。價格是情境數字（埃及鎊）。</p>
      <div className={styles.card} aria-live="polite">
        {log.length > 0 && <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 6 }}>你：{log[log.length - 1]}</p>}
        <p>🧔 {n.say}</p>
        {n.ask && !end && (
          <p style={{ marginTop: 6 }}>
            目前開價：<b>{n.ask} 鎊</b>
          </p>
        )}
      </div>
      {!end && (
        <div className={styles.cards}>
          {n.choices!.map((c) => (
            <button key={c.next + c.label} type="button" className={styles.evidence} onClick={() => go(c.label, c.next)}>
              {c.label}
            </button>
          ))}
        </div>
      )}
      {end && (
        <>
          <div className={lab.result}>
            <div>
              <strong>{GRADE[n.grade ?? 0]}</strong>
              <span>結果</span>
            </div>
          </div>
          <div className={lab.explain}>
            <p>{n.lesson}</p>
            <p>議價小抄：先逛再買、準備小鈔、微笑說「La, shukran（不用，謝謝）」。談好價錢就要買，反悔很失禮。</p>
          </div>
          <div className={lab.actions}>
            <button
              type="button"
              className={lab.primary}
              onClick={() => {
                setId(START);
                setLog([]);
              }}
            >
              再試一次
            </button>
          </div>
        </>
      )}
    </div>
  );
}
