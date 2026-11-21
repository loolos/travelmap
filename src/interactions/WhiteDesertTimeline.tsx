import { useState, type ReactNode } from 'react';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';

const SEA = '#5fa8bd';
const CHALK = '#f4f1ea';
const CHALK_DARK = '#d9d2c3';

interface Stage {
  title: string;
  caption: string;
  draw: (hard: boolean) => ReactNode;
}

const layers = (y0: number, n: number, w = 320) =>
  Array.from({ length: n }, (_, i) => (
    <rect key={i} x={0} y={y0 + i * 10} width={w} height={10} fill={i % 2 ? CHALK : CHALK_DARK} />
  ));

const stages: Stage[] = [
  {
    title: '海洋沉積',
    caption: '數千萬年前，這裡是一片淺海。微小生物的殼一層層沉到海底。',
    draw: () => (
      <>
        <rect width={320} height={200} fill={SEA} />
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={(i * 53) % 320} cy={20 + ((i * 37) % 130)} r={1.8} fill="#fff" opacity={0.8} />
        ))}
        {layers(170, 3)}
      </>
    ),
  },
  {
    title: '岩層形成',
    caption: '殼和泥越積越厚、被壓實，變成白堊岩層，夾著貝殼化石。',
    draw: () => (
      <>
        <rect width={320} height={200} fill={SEA} />
        {layers(100, 10)}
        <path d="M60 140 a6 6 0 1 1 1 0" stroke="#a89c84" fill="none" strokeWidth={2} />
        <path d="M220 160 a5 5 0 1 1 1 0" stroke="#a89c84" fill="none" strokeWidth={2} />
      </>
    ),
  },
  {
    title: '抬升出露',
    caption: '海水退去、地殼抬升，白色岩層露出地面，成為沙漠高原。',
    draw: () => (
      <>
        <rect width={320} height={200} fill="#f6dfb0" />
        <rect y={170} width={320} height={30} fill="#d9b57c" />
        {layers(90, 8)}
      </>
    ),
  },
  {
    title: '風沙侵蝕',
    caption: '風夾帶沙粒貼著地面吹，岩石的裂縫被擴大、底部磨得最快。',
    draw: () => (
      <>
        <rect width={320} height={200} fill="#f6dfb0" />
        <rect y={170} width={320} height={30} fill="#d9b57c" />
        {[30, 130, 230].map((x) => (
          <path key={x} d={`M${x} 170 L${x + 8} 100 L${x + 62} 100 L${x + 70} 170 Z`} fill={CHALK} stroke={CHALK_DARK} />
        ))}
        {[150, 158, 164].map((y, i) => (
          <path key={y} d={`M${10 + i * 20} ${y} h60 m-8 -4 l8 4 l-8 4`} stroke="#9c7748" strokeWidth={2} fill="none" />
        ))}
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 31) % 320} cy={150 + ((i * 7) % 20)} r={1.5} fill="#b08a58" />
        ))}
      </>
    ),
  },
  {
    title: '今日地貌',
    caption: '上面較硬的岩石撐住，下面被掏細，就成了白沙漠的蘑菇石。',
    draw: (hard) => (
      <>
        <rect width={320} height={200} fill="#f6dfb0" />
        <rect y={170} width={320} height={30} fill="#efe6d4" />
        {[70, 230].map((x) => (
          <g key={x}>
            <path d={`M${x - 12} 170 L${x - 8} 130 L${x + 8} 130 L${x + 12} 170 Z`} fill={CHALK_DARK} />
            {hard ? (
              <ellipse cx={x} cy={118} rx={48} ry={20} fill={CHALK} stroke={CHALK_DARK} />
            ) : (
              <ellipse cx={x} cy={124} rx={16} ry={12} fill={CHALK} stroke={CHALK_DARK} />
            )}
          </g>
        ))}
      </>
    ),
  },
];

export function WhiteDesertTimeline({ activityId }: { activityId: string }) {
  const [i, setI] = useState(0);
  const [hard, setHard] = useState(true);
  const [explained, setExplained] = useState(false);
  const s = stages[i];
  const last = i === stages.length - 1;
  return (
    <div className={styles.lab}>
      <p className={styles.question}>沙漠裡的白色石頭，原本在海底？</p>
      <p className={styles.how}>拖動時間軸，看白沙漠怎麼形成。</p>
      <svg className={styles.visual} viewBox="0 0 320 200" role="img" aria-label={`${s.title}：${s.caption}`}>
        {s.draw(hard)}
        <text x={10} y={20} fontSize={13} fontWeight={700} fill="#292720">
          {i + 1}. {s.title}
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
      {last && (
        <div className={styles.actions}>
          <button type="button" className={hard ? styles.primary : undefined} aria-pressed={hard} onClick={() => setHard(true)}>
            頂層較硬
          </button>
          <button type="button" className={!hard ? styles.primary : undefined} aria-pressed={!hard} onClick={() => setHard(false)}>
            頂層較軟
          </button>
        </div>
      )}
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
            setHard(true);
            setExplained(false);
          }}
        >
          重來
        </button>
      </div>
      {explained && (
        <div className={styles.explain}>
          <p>
            這叫「差異侵蝕」：同一片岩石，硬的地方耐磨、軟的地方被磨掉。風吹起的沙粒大多在離地一公尺內跳動，所以岩石底部被磨得最多，常變成上寬下窄。
          </p>
          <p>
            頂層較硬時，能撐出寬大的「蘑菇帽」；頂層較軟時，整塊岩石只會被磨成小圓丘。到現場可以找找看蘑菇石的「腳」和岩石上的層理。
          </p>
          <p>
            <span className={styles.tag}>示意</span> 只呈現形成順序，不代表實際年代或侵蝕速度。保護區內請勿敲擊或採集岩石。
          </p>
        </div>
      )}
    </div>
  );
}
