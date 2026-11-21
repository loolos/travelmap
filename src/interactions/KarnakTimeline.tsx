import { useState } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';

interface Part {
  stage: number;
  kind: 'rect' | 'lake' | 'obelisk' | 'hall';
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  below?: boolean;
}

/** Schematic plan, west (Nile side, entrance) on the left. Not to scale. */
const parts: Part[] = [
  { stage: 0, kind: 'rect', x: 200, y: 84, w: 30, h: 32, label: '中王國聖殿', below: true },
  { stage: 1, kind: 'rect', x: 184, y: 66, w: 6, h: 68 },
  { stage: 1, kind: 'rect', x: 168, y: 60, w: 6, h: 80 },
  { stage: 1, kind: 'obelisk', x: 178, y: 72, w: 3, h: 3 },
  { stage: 1, kind: 'obelisk', x: 194, y: 75, w: 3, h: 3 },
  { stage: 1, kind: 'rect', x: 238, y: 70, w: 52, h: 60, label: '慶典大廳' },
  { stage: 1, kind: 'lake', x: 206, y: 150, w: 58, h: 30, label: '聖湖' },
  { stage: 2, kind: 'rect', x: 152, y: 54, w: 7, h: 92 },
  { stage: 3, kind: 'hall', x: 100, y: 56, w: 50, h: 88, label: '大柱廳' },
  { stage: 3, kind: 'rect', x: 90, y: 48, w: 9, h: 104 },
  { stage: 4, kind: 'rect', x: 28, y: 38, w: 11, h: 124, label: '第一塔門' },
  { stage: 4, kind: 'rect', x: 39, y: 52, w: 50, h: 96 },
];

const stages = [
  { title: '中王國', when: '約西元前 1950 年', caption: '辛努塞爾特一世（Senusret I）為阿蒙神蓋了一座不大的石造聖殿。' },
  { title: '新王國初期', when: '約西元前 1500–1430 年', caption: '圖特摩斯一世、哈特謝普蘇特在前方加塔門和方尖碑；圖特摩斯三世在後方加慶典大廳，並挖了聖湖。' },
  { title: '阿蒙霍特普三世', when: '約西元前 1370 年', caption: '再往西加一道第三塔門，入口又往尼羅河推進一步。' },
  { title: '塞提一世與拉美西斯二世', when: '約西元前 1290–1220 年', caption: '在前面蓋起 134 根石柱的大柱廳，以及第二塔門。' },
  { title: '最後的入口', when: '西元前 4 世紀起', caption: '最外面的第一塔門始終沒有完工，後來的托勒密王朝仍在各處增建。' },
];

const COL = { now: '#e0a13a', old: '#d4c09a', line: '#8b7351' };

export function KarnakTimeline({ activityId }: { activityId: string }) {
  const [i, setI] = useState(0);
  const [explained, setExplained] = useState(false);
  const s = stages[i];
  const last = i === stages.length - 1;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>一座神殿為什麼蓋了兩千年？</p>
      <p className={styles.how}>拖動時間軸，看每個時代把神殿往哪個方向擴建。</p>
      <svg className={styles.chart} viewBox="0 0 320 200" role="img" aria-label={`${s.title}，${s.when}：${s.caption}`}>
        <rect x={0} y={0} width={14} height={200} fill="#5fa8bd" />
        <text x={18} y={196} fontSize={10} fill="#1f4e79">
          ← 尼羅河（西）
        </text>
        <text x={316} y={196} fontSize={10} fill="#6b6457" textAnchor="end">
          東 →
        </text>
        {parts.map((p, k) => {
          const future = p.stage > i;
          const fill = future ? 'none' : p.stage === i ? COL.now : COL.old;
          const common = { stroke: COL.line, strokeDasharray: future ? '3 3' : undefined, opacity: future ? 0.5 : 1 };
          return (
            <g key={k}>
              {p.kind === 'lake' ? (
                <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={4} fill={future ? 'none' : '#7fbcd0'} {...common} />
              ) : p.kind === 'obelisk' ? (
                <circle cx={p.x} cy={p.y} r={p.w} fill={future ? 'none' : '#6b4f2a'} {...common} />
              ) : (
                <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={fill} {...common} />
              )}
              {p.kind === 'hall' &&
                !future &&
                Array.from({ length: 16 * 8 }, (_, j) => (
                  <circle key={j} cx={p.x + 4 + (j % 16) * 2.8} cy={p.y + 8 + Math.floor(j / 16) * 10.5} r={0.9} fill="#6b4f2a" />
                ))}
              {p.label && !future && (
                <text x={p.x + p.w / 2} y={p.kind === 'lake' ? p.y + p.h / 2 + 4 : p.below ? p.y + p.h + 11 : p.y - 4} fontSize={10} textAnchor="middle" fill="#292720">
                  {p.label}
                </text>
              )}
            </g>
          );
        })}
        <text x={20} y={18} fontSize={13} fontWeight={700} fill="#292720">
          {i + 1}. {s.title}
        </text>
        <text x={20} y={32} fontSize={11} fill="#6b6457">
          {s.when}
        </text>
      </svg>
      <p style={{ margin: 0 }}>{s.caption}</p>
      <label className={styles.slider}>
        <span>時間</span>
        <input
          type="range"
          min={0}
          max={stages.length - 1}
          value={i}
          onChange={(e) => setI(+e.target.value)}
          aria-label="時間軸"
          aria-valuetext={s.title}
        />
        <output>
          {i + 1}／{stages.length}
        </output>
      </label>
      <div className={styles.actions}>
        {last && !explained && (
          <button
            type="button"
            className={styles.primary}
            onClick={() => {
              setExplained(true);
              markActivityDone(activityId);
            }}
          >
            看解釋
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            setI(0);
            setExplained(false);
          }}
        >
          重來
        </button>
      </div>
      {explained && (
        <div className={styles.explain}>
          <p>
            每位法老都想在眾神之王阿蒙面前留下自己的功績，最常見的做法是在前面再加一道更大的塔門。所以從第一塔門走進去，
            越往裡面越古老：你其實是在往回穿越兩千年。
          </p>
          <p>
            大柱廳中間 12 根柱子比兩旁高，高低差的地方開了石窗讓光線照進來。每年的奧佩特節，阿蒙神像會沿著人面獅身像大道，
            被抬到南邊的<Link to="/place/luxor-temple">路克索神殿</Link>。
          </p>
          <p>
            <span className={styles.tag}>示意</span> 平面圖經過大幅簡化，只標出主要建築與大致年代，不按比例。
          </p>
        </div>
      )}
    </div>
  );
}
