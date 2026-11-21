import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { quizSets } from './sets/quizzes';
import type { QuizSet } from './sets/types';
import lab from './Lab.module.css';
import styles from './Hotspot.module.css';

/** "What is this?" cards: a drawing + a clue, pick one answer, then read why. */
export function IdentifyQuiz({ activityId, set: given, bare }: { activityId: string; set?: QuizSet; bare?: boolean }) {
  const set = given ?? quizSets[activityId];
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  if (!set) return null;
  const item = set.items[i];
  const last = i === set.items.length - 1;
  const choose = (k: number) => {
    if (picked !== null) return;
    setPicked(k);
    if (k === item.answer) setScore((s) => s + 1);
    if (last) {
      setFinished(true);
      markActivityDone(activityId);
    }
  };
  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };
  return (
    <div className={lab.lab}>
      {!bare && <p className={lab.question}>{set.question}</p>}
      <p className={lab.how}>{set.how}</p>
      <div className={styles.dots} aria-label={`第 ${i + 1} 題，共 ${set.items.length} 題`}>
        {set.items.map((_, k) => (
          <span key={k} className={k <= i ? styles.on : undefined} />
        ))}
      </div>
      <svg className={lab.visual} viewBox="0 0 320 160" role="img" aria-label={item.clue}>
        {item.draw}
      </svg>
      <p style={{ margin: 0 }}>{item.clue}</p>
      <div className={styles.choices}>
        {item.options.map((o, k) => (
          <button
            key={k}
            type="button"
            className={picked === null ? undefined : k === item.answer ? styles.right : k === picked ? styles.wrong : undefined}
            aria-pressed={picked === k}
            onClick={() => choose(k)}
          >
            {o}
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className={styles.card} aria-live="polite">
          <p>
            <b>{picked === item.answer ? '答對了！' : `答案是「${item.options[item.answer]}」。`}</b> {item.explain}
          </p>
        </div>
      )}
      <div className={lab.actions}>
        {picked !== null && !last && (
          <button
            type="button"
            className={lab.primary}
            onClick={() => {
              setI(i + 1);
              setPicked(null);
            }}
          >
            下一題
          </button>
        )}
        {finished && (
          <button type="button" onClick={restart}>
            重來
          </button>
        )}
      </div>
      {finished && (
        <div className={lab.explain}>
          <p>
            答對 {score}／{set.items.length}。
          </p>
          {set.wrap}
        </div>
      )}
    </div>
  );
}
