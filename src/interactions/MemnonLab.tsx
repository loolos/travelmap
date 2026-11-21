import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';

const QUARTZITE = '#c49a6c';
const PAINT = '#d9b27a';

type View = 'now' | 'then' | 'dawn';

/** One seated colossus, drawn simply. `cracked` adds the repaired upper body. */
function Colossus({ x, cracked, painted, crown }: { x: number; cracked?: boolean; painted?: boolean; crown?: boolean }) {
  const body = painted ? PAINT : QUARTZITE;
  return (
    <g>
      <rect x={x - 26} y={150} width={52} height={30} fill="#a8885a" />
      <rect x={x - 22} y={110} width={44} height={42} fill={body} />
      <rect x={x - 18} y={70} width={36} height={44} fill={body} />
      <rect x={x - 10} y={50} width={20} height={22} rx={4} fill={body} />
      {crown && <path d={`M${x - 10},50 L${x - 6},28 L${x + 6},28 L${x + 10},50 Z`} fill="#e8e0cc" stroke="#9c7748" />}
      {painted && (
        <>
          <rect x={x - 14} y={50} width={4} height={30} fill="#2d4f8f" />
          <rect x={x + 10} y={50} width={4} height={30} fill="#2d4f8f" />
          <rect x={x - 16} y={78} width={32} height={6} fill="#3d8a8a" />
        </>
      )}
      {cracked &&
        [0, 1, 2, 3, 4].map((i) => <line key={i} x1={x - 18} x2={x + 18} y1={76 + i * 8} y2={76 + i * 8} stroke="#7a5a32" />)}
      {/* small queen figure by the legs */}
      <rect x={x - 32} y={130} width={8} height={20} rx={2} fill={body} />
    </g>
  );
}

/** 孟農巨像：今天、原貌、會唱歌的雕像。 */
export function MemnonLab({ activityId }: { activityId: string }) {
  const [view, setView] = useState<View>('now');
  const [seen, setSeen] = useState<Set<View>>(() => new Set(['now']));
  const [explained, setExplained] = useState(false);
  const go = (v: View) => {
    setView(v);
    setSeen((s) => new Set(s).add(v));
  };

  return (
    <div className={styles.lab}>
      <p className={styles.question}>兩尊孤零零的巨像，原本守著什麼？為什麼有人說它會唱歌？</p>
      <svg
        className={styles.chart}
        viewBox="0 0 320 190"
        role="img"
        aria-label={view === 'now' ? '今天的兩尊巨像' : view === 'then' ? '原本的神殿入口' : '清晨，北邊的巨像發出聲音'}
      >
        <rect width={320} height={190} fill={view === 'dawn' ? '#f6c98a' : '#cfe7f2'} />
        {view === 'dawn' && <circle cx={280} cy={150} r={22} fill="#ffd66b" />}
        <rect y={180} width={320} height={10} fill="#e9cf9c" />
        {view === 'then' && (
          <>
            <rect x={60} y={40} width={200} height={140} fill="#e7d3a8" stroke="#9c7748" />
            <rect x={140} y={110} width={40} height={70} fill="#5a4630" />
            <text x={160} y={34} fontSize={10} textAnchor="middle" fill="#5a4630">
              阿蒙霍特普三世的神殿塔門
            </text>
          </>
        )}
        <Colossus x={90} painted={view === 'then'} crown={view === 'then'} />
        <Colossus x={230} cracked={view !== 'then'} painted={view === 'then'} crown={view === 'then'} />
        {view === 'dawn' &&
          [0, 1, 2].map((i) => (
            <path key={i} d={`M${258 + i * 10},${80 - i * 6} q8,10 0,20`} fill="none" stroke="#7a3a1a" strokeWidth={2} opacity={1 - i * 0.25} />
          ))}
      </svg>
      <div className={p.row}>
        <button type="button" className={view === 'now' ? p.go : p.idle} aria-pressed={view === 'now'} onClick={() => go('now')}>
          今天
        </button>
        <button type="button" className={view === 'then' ? p.go : p.idle} aria-pressed={view === 'then'} onClick={() => go('then')}>
          原貌
        </button>
        <button type="button" className={view === 'dawn' ? p.go : p.idle} aria-pressed={view === 'dawn'} onClick={() => go('dawn')}>
          🌅 清晨
        </button>
      </div>
      <p className={p.note}>
        {view === 'now' &&
          '兩尊約 18 公尺高的阿蒙霍特普三世坐像，腳邊站著較小的王后和母后。北邊（右）那尊的上半身是一層層後來補上的石塊。'}
        {view === 'then' &&
          '巨像原本坐在一座巨大神殿的大門前，那是底比斯當時最大的祭廟。後來被洪水、地震和拆石頭蓋房子毀掉，只剩巨像。'}
        {view === 'dawn' &&
          '西元前 27 年一場地震震裂了北邊巨像。之後有時在清晨，裂縫會發出低低的聲音，可能是夜裡的露水被太陽曬熱蒸發造成的。希臘人說那是英雄孟農向母親黎明女神問好。'}
      </p>
      {seen.size === 3 && !explained && (
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
            「會唱歌的雕像」吸引了大批希臘和羅馬遊客，西元 130 年連哈德良皇帝都來聽過。遊客在巨像腿上刻下上百則留言和詩，今天走近還看得到。
          </p>
          <p>
            約西元 199 年羅馬皇帝修補了裂縫，從此它就再也不唱了。巨像後方的神殿遺址至今還在挖掘，陸續找到新的雕像。
          </p>
          <p>
            <span className={styles.tag}>學說</span> 發聲原因沒人實際測過，溫度與濕度變化是最常見的解釋。
            <span className={styles.tag}>示意</span> 原貌是依其他新王國神殿推想的。
          </p>
        </div>
      )}
    </div>
  );
}
