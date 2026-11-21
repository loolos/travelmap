import { useState } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';

/** Heights / bases in metres (Wikipedia). `ground`: bedrock height relative to Khufu's base. */
const PYRAMIDS = [
  { id: 'khufu', name: '胡夫', base: 230.3, h0: 146.6, h: 138.5, ground: 0 },
  { id: 'khafre', name: '卡夫拉', base: 215.3, h0: 143.5, h: 136.4, ground: 10 },
  { id: 'menkaure', name: '孟卡拉', base: 103.4, h0: 65, h: 61, ground: 0 },
] as const;

const SCALE = 0.62; // px per metre
const GROUND_Y = 200;
const CASING = '#f3ecdc';
const STONE = '#d4b07a';

type View = 'now' | 'then';

/** 原貌與比例：今天 vs 剛蓋好；三座等比例，可加上地勢與一個人。 */
export function GizaScale({ activityId }: { activityId: string }) {
  const [view, setView] = useState<View>('now');
  const [terrain, setTerrain] = useState(false);
  const [seen, setSeen] = useState({ then: false, terrain: false });
  const [explained, setExplained] = useState(false);
  const both = seen.then && seen.terrain;

  const shapes = PYRAMIDS.map((py, i) => {
    const w = py.base * SCALE;
    const left = 14 + PYRAMIDS.slice(0, i).reduce((sum, q) => sum + q.base * SCALE + 8, 0);
    const lift = terrain ? py.ground * SCALE : 0;
    const h = (view === 'then' ? py.h0 : py.h) * SCALE;
    const apex = GROUND_Y - lift - h;
    return { py, left, w, lift, h, apex };
  });

  return (
    <div className={styles.lab}>
      <p className={styles.question}>三座金字塔，到底哪一座最高？剛蓋好時長什麼樣？</p>
      <p className={styles.how}>切換「今天／剛蓋好」，再打開「實際地勢」看看。</p>
      <svg className={styles.chart} viewBox="0 0 400 220" role="img" aria-label={`${view === 'then' ? '剛蓋好' : '今天'}的三座金字塔${terrain ? '，含地勢' : ''}`}>
        <rect width={400} height={220} fill="#cfe7f2" />
        <rect y={GROUND_Y} width={400} height={20} fill="#e9cf9c" />
        {shapes.map(({ py, left, w, lift, apex }) => {
          const top = GROUND_Y - lift;
          const fullApex = GROUND_Y - lift - py.h0 * SCALE;
          const casedNow = py.id === 'khafre';
          return (
            <g key={py.id}>
              {lift > 0 && <rect x={left - 4} y={top} width={w + 8} height={lift} fill="#c7a874" />}
              <polygon points={`${left},${top} ${left + w / 2},${apex} ${left + w},${top}`} fill={view === 'then' ? CASING : STONE} stroke="#9c7748" />
              {view === 'now' && casedNow && (
                <polygon
                  points={`${left + w / 2 - 9},${apex + 12} ${left + w / 2},${apex} ${left + w / 2 + 9},${apex + 12}`}
                  fill={CASING}
                />
              )}
              {view === 'now' && py.id === 'menkaure' && (
                <polygon points={`${left},${top} ${left + 8},${top - 10} ${left + w - 8},${top - 10} ${left + w},${top}`} fill="#b4524a" opacity={0.75} />
              )}
              {view === 'now' && (
                <line x1={left + w / 2 - 6} x2={left + w / 2 + 6} y1={fullApex} y2={fullApex} stroke="#9c7748" strokeDasharray="2 2" />
              )}
              <text x={left + w / 2} y={apex - 6} fontSize={10} textAnchor="middle" fill="#292720">
                {py.name} {Math.round(view === 'then' ? py.h0 : py.h)} m
              </text>
            </g>
          );
        })}
        {/* a person for scale, 1.7 m */}
        <rect x={392} y={GROUND_Y - 1.7 * SCALE - 1} width={2} height={1.7 * SCALE + 1} fill="#c0503f" />
        <text x={388} y={GROUND_Y - 6} fontSize={8} textAnchor="end" fill="#c0503f">
          人
        </text>
      </svg>
      <div className={p.row}>
        <button
          type="button"
          className={view === 'now' ? p.go : p.idle}
          aria-pressed={view === 'now'}
          onClick={() => setView('now')}
        >
          今天
        </button>
        <button
          type="button"
          className={view === 'then' ? p.go : p.idle}
          aria-pressed={view === 'then'}
          onClick={() => {
            setView('then');
            setSeen((s) => ({ ...s, then: true }));
          }}
        >
          剛蓋好
        </button>
        <button
          type="button"
          className={terrain ? p.go : p.idle}
          aria-pressed={terrain}
          onClick={() => {
            setTerrain((t) => !t);
            setSeen((s) => ({ ...s, terrain: true }));
          }}
        >
          實際地勢
        </button>
      </div>
      <p className={p.note}>
        {view === 'then'
          ? '剛蓋好時，三座都包著打磨光滑的白色石灰岩外層，頂端尖尖的，在陽光下會反光。孟卡拉的下半段還包了一圈紅色花崗岩。'
          : '今天外層石大多被拆去蓋開羅，露出裡面一階階的石塊。只有卡夫拉頂端還留著一小段白色外層，孟卡拉底部還看得到紅色花崗岩。虛線是原本的頂點。'}
        {terrain && ' 卡夫拉蓋在比胡夫高約 10 公尺的岩盤上，所以從遠處看它反而像是最高的一座。'}
      </p>
      {both && !explained && (
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
      {explained && (
        <div className={styles.explain}>
          <p>
            胡夫金字塔原高約 146.6 公尺，近四千年都是世界最高的人造建築，直到 14 世紀英國林肯大教堂的尖塔才超過它。
            孟卡拉金字塔的體積還不到胡夫的十分之一。
          </p>
          <p>
            想看石塊怎麼堆上去，玩<Link to="/place/giza-khufu/pyramid-build">建造大金字塔</Link>。
            <span className={styles.tag}>示意</span> 高度與底寬照比例畫；地勢高差約 10 公尺是概略數字。
          </p>
        </div>
      )}
    </div>
  );
}
