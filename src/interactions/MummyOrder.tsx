import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import { isComplete, MUMMY_STEPS, pick, shuffled, startOrder } from '../games/mummy';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';
import m from './Mummy.module.css';

/** 木乃伊製作：把八張步驟卡照順序點一遍。 */
export function MummyOrder({ activityId }: { activityId: string }) {
  const deck = useMemo(() => shuffled(MUMMY_STEPS), []);
  const [s, setS] = useState(startOrder);
  const [explained, setExplained] = useState(false);
  const done = isComplete(s);
  const lastPlaced = s.placed.length ? MUMMY_STEPS[s.placed.length - 1] : undefined;
  const wrong = s.wrong && !done ? MUMMY_STEPS.find((x) => x.id === s.wrong) : undefined;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>做一具木乃伊要七十天。先做什麼、後做什麼？</p>
      <p className={styles.how}>照順序點卡片。點錯了會提示，再試一次就好。</p>

      <ol className={m.track} aria-label="已排好的步驟">
        {MUMMY_STEPS.map((st, i) => {
          const placed = i < s.placed.length;
          return (
            <li key={st.id} className={placed ? m.placed : m.slot}>
              <span className={m.num}>{i + 1}</span>
              {placed ? (
                <>
                  <span aria-hidden="true">{st.icon}</span> {st.label}
                </>
              ) : (
                '？'
              )}
            </li>
          );
        })}
      </ol>

      {lastPlaced && !wrong && <p className={p.note}>✓ {lastPlaced.text}</p>}
      {wrong && (
        <p className={`${p.note} ${m.wrong}`} role="status">
          「{wrong.label}」還太早，前面還有別的步驟要先做。
        </p>
      )}

      {!done && (
        <div className={m.deck}>
          {deck.map((st) => (
            <button
              key={st.id}
              type="button"
              className={m.card}
              disabled={s.placed.includes(st.id)}
              onClick={() => setS((cur) => pick(cur, st.id))}
            >
              <span className={m.icon} aria-hidden="true">
                {st.icon}
              </span>
              {st.label}
            </button>
          ))}
        </div>
      )}

      {done && (
        <>
          <p className={m.score}>
            完成！{s.mistakes === 0 ? '一次都沒排錯 🎉' : `排錯 ${s.mistakes} 次`}
          </p>
          {!explained && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.primary}
                onClick={() => {
                  setExplained(true);
                  markActivityDone(activityId);
                }}
              >
                看完整解釋
              </button>
            </div>
          )}
        </>
      )}

      {explained && (
        <div className={styles.explain}>
          <p>
            古埃及人相信人死後還要在來世生活，身體必須保存好，靈魂才能回來。整個過程大約 70 天，其中 40 天是用泡鹼脫水。
          </p>
          <p>
            來世入口有一場審判：<Link to="/deities">阿努比斯</Link>把死者的心臟放在天平上，和代表真理的羽毛比重量，所以心臟一定要留在身體裡。
          </p>
          <p>
            <span className={styles.tag}>證據等級</span> 步驟主要來自希臘歷史學家希羅多德的記載，再加上木乃伊的掃描研究。不同時代、不同價錢的做法差很多，這裡是最講究的王室做法。
          </p>
        </div>
      )}
    </div>
  );
}
