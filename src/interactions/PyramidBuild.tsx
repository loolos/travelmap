import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import { PyramidStack } from './PyramidStack';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';

/**
 * 建造大金字塔：一步步重現工序。有爭議的做法都標「學說」。
 * 1 定方位 → 2 整平地基 → 3 挖地下墓室 → 4 堆石塊（人力瓶頸）→ 5 坡道 → 6 外層石與頂石
 */
const STAGES = ['定方位', '整平地基', '地下墓室', '堆石塊', '坡道', '外層石'] as const;

const SAND = '#e9cf9c';
const ROCK = '#c7a874';
const ROCK_DARK = '#a8885a';
const STONE = '#d4b07a';
const CASING = '#f3ecdc';

export function PyramidBuild({ activityId }: { activityId: string }) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => STAGES.map(() => false));
  const [explained, setExplained] = useState(false);
  const complete = (i: number) => setDone((d) => d.map((v, j) => (j === i ? true : v)));
  const reached = (i: number) => i === 0 || done[i - 1];
  const last = stage === STAGES.length - 1;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>沒有現代機械，一座金字塔要怎麼蓋起來？</p>
      <ol className={p.steps} aria-label="工序">
        {STAGES.map((t, i) => (
          <li key={t}>
            <button
              type="button"
              aria-current={stage === i ? 'step' : undefined}
              className={`${p.step} ${stage === i ? p.on : ''} ${done[i] ? p.done : ''}`}
              disabled={!reached(i)}
              onClick={() => setStage(i)}
            >
              <span>{done[i] ? '✓' : i + 1}</span>
              {t}
            </button>
          </li>
        ))}
      </ol>

      {stage === 0 && <Orient onDone={() => complete(0)} done={done[0]} />}
      {stage === 1 && <Level onDone={() => complete(1)} done={done[1]} />}
      {stage === 2 && <Chamber onDone={() => complete(2)} done={done[2]} />}
      {stage === 3 && <Stack onDone={() => complete(3)} done={done[3]} />}
      {stage === 4 && <Ramps onDone={() => complete(4)} done={done[4]} />}
      {stage === 5 && <Casing onDone={() => complete(5)} done={done[5]} />}

      <div className={styles.actions}>
        {!last && (
          <button type="button" className={styles.primary} disabled={!done[stage]} onClick={() => setStage(stage + 1)}>
            下一步：{STAGES[stage + 1]} →
          </button>
        )}
        {last && done[stage] && !explained && (
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
        )}
      </div>

      {explained && (
        <div className={styles.explain}>
          <p>
            胡夫金字塔約建於西元前 2560 年前後，原高約 146 公尺，底邊約 230 公尺，用了約 230 萬塊石材。
            一般認為工期約 20 年，建造者是有組織、有配給的工人，住在旁邊的工人村。
          </p>
          <p>
            紙莎草紙《梅雷爾日誌》（Diary of Merer）記錄了船隊把對岸圖拉（Tura）的白色石灰岩運到吉薩；
            國王墓室的花崗岩則來自南方約 800 公里外的<Link to="/place/aswan">亞斯文</Link>。
          </p>
          <p>
            <span className={styles.tag}>證據等級</span> 方位、水平、尺寸與石材來源是測量和考古證據；
            用星星定方位、用水道測水平、坡道的形式都是「學說」，至今仍有爭論。
          </p>
        </div>
      )}
    </div>
  );
}

function Note({ children, theory }: { children: ReactNode; theory?: boolean }) {
  return (
    <p className={p.note}>
      {theory && <span className={styles.tag}>學說</span>} {children}
    </p>
  );
}

/* ---------- 1. 定方位 ---------- */
function Orient({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [a, setA] = useState(14);
  const ok = Math.abs(a) <= 0.5;
  return (
    <>
      <p className={styles.how}>轉動地基的方框，讓一邊對準正北。古埃及人沒有指南針，只能看星星。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`偏離正北 ${Math.abs(a).toFixed(1)} 度`}>
        <rect width={320} height={190} fill="#18264a" />
        {[
          [40, 30],
          [90, 60],
          [250, 40],
          [280, 90],
          [60, 120],
          [210, 20],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="#fff" opacity={0.7} />
        ))}
        <circle cx={160} cy={14} r={3} fill="#ffe9a8" />
        <circle cx={160} cy={40} r={2.4} fill="#ffe9a8" />
        <line x1={160} y1={8} x2={160} y2={182} stroke="#ffe9a8" strokeDasharray="4 4" opacity={0.7} />
        <text x={168} y={18} fontSize={10} fill="#ffe9a8">
          北方的兩顆星
        </text>
        <rect x={0} y={130} width={320} height={60} fill={SAND} opacity={0.9} />
        <g transform={`translate(160 140) rotate(${a})`}>
          <rect x={-42} y={-42} width={84} height={84} fill="none" stroke={ok ? '#7bd389' : '#f2c14e'} strokeWidth={3} />
          <line x1={0} y1={-42} x2={0} y2={-58} stroke={ok ? '#7bd389' : '#f2c14e'} strokeWidth={3} />
        </g>
      </svg>
      <label className={styles.slider}>
        <span>方向</span>
        <input
          type="range"
          min={-20}
          max={20}
          step={0.1}
          value={a}
          aria-label="地基方向"
          onChange={(e) => {
            const v = +e.target.value;
            setA(v);
            if (Math.abs(v) <= 0.5 && !done) onDone();
          }}
        />
        <output>{ok ? '對準了' : `偏 ${Math.abs(a).toFixed(1)}°`}</output>
      </label>
      {(ok || done) && (
        <Note theory>
          一種說法是等兩顆繞北極轉的星星上下排成一直線時，用鉛垂線標出正北。胡夫金字塔四邊和正東西南北的誤差只有約 0.06 度。
        </Note>
      )}
    </>
  );
}

/* ---------- 2. 整平地基 ---------- */
const LEVEL_STEPS = ['挖水道、灌水', '沿水面畫線', '鑿到線的高度'] as const;
function Level({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [n, setN] = useState(done ? 3 : 0);
  const WATER_Y = 120;
  const ground = 'M0,104 L40,98 L80,112 L120,100 L160,90 L200,96 L240,108 L280,100 L320,110 L320,190 L0,190Z';
  const trenches = [40, 120, 200, 280];
  return (
    <>
      <p className={styles.how}>地面高低不平。照順序按，看看怎麼把 5 公頃的地基整平。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`整平：${n} / 3 步`}>
        <rect width={320} height={190} fill="#cfe7f2" />
        {n < 3 ? (
          <path d={ground} fill={ROCK} stroke={ROCK_DARK} />
        ) : (
          <>
            <rect x={0} y={WATER_Y} width={320} height={70} fill={ROCK} stroke={ROCK_DARK} />
            <path d="M140,120 L150,96 L170,92 L180,120Z" fill={ROCK_DARK} />
            <text x={160} y={88} fontSize={10} textAnchor="middle" fill="#5a4630">
              中央保留的岩丘
            </text>
          </>
        )}
        {n >= 1 &&
          n < 3 &&
          trenches.map((x) => (
            <g key={x}>
              <rect x={x - 5} y={96} width={10} height={40} fill="#cfe7f2" />
              <rect x={x - 5} y={WATER_Y} width={10} height={16} fill="#3f8fa6" />
            </g>
          ))}
        {n >= 2 && <line x1={0} x2={320} y1={WATER_Y} y2={WATER_Y} stroke="#c0503f" strokeWidth={2} strokeDasharray={n >= 3 ? undefined : '5 3'} />}
        <text x={8} y={18} fontSize={12} fill="#1f4e79">
          {n === 0 ? '起伏的岩床' : n === 1 ? '水面一定是平的' : n === 2 ? '紅線就是同一個高度' : '整平完成'}
        </text>
      </svg>
      <div className={p.row}>
        {LEVEL_STEPS.map((t, i) => (
          <button
            key={t}
            type="button"
            className={n === i ? p.go : p.idle}
            disabled={n !== i}
            onClick={() => {
              setN(i + 1);
              if (i === 2) onDone();
            }}
          >
            {i + 1}. {t}
          </button>
        ))}
      </div>
      {n >= 3 && (
        <Note theory>
          用水道測水平是常見的說法。成果是確定的：胡夫金字塔約 230 公尺寬的地基，高低差只有約 2 公分；中央一塊天然岩丘被直接包進金字塔裡。
        </Note>
      )}
    </>
  );
}

/* ---------- 3. 地下墓室 ---------- */
function Chamber({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [d, setD] = useState(done ? 5 : 0);
  const f = d / 5;
  // Descending passage from the north side (left) at ~26°.
  const x0 = 70;
  const y0 = 70;
  const x1 = x0 + 150 * f;
  const y1 = y0 + 150 * f * Math.tan((26 * Math.PI) / 180);
  return (
    <>
      <p className={styles.how}>從北面往下，以約 26 度斜角鑿進岩盤。一次挖一段。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`已挖 ${Math.round(f * 100)}%`}>
        <rect width={320} height={70} fill="#cfe7f2" />
        <rect y={70} width={320} height={120} fill={ROCK} />
        {Array.from({ length: 5 }, (_, i) => (
          <line key={i} x1={0} x2={320} y1={90 + i * 20} y2={90 + i * 20} stroke={ROCK_DARK} opacity={0.35} />
        ))}
        <polygon points="70,70 160,20 250,70" fill="none" stroke="#9c7748" strokeDasharray="4 3" />
        <text x={8} y={16} fontSize={10} fill="#6b6457">
          ← 北
        </text>
        {d > 0 && <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#3a2c1c" strokeWidth={5} strokeLinecap="round" />}
        {d >= 5 && (
          <>
            <path d={`M${x1 - 4},${y1 - 10} h46 l4,6 v14 l-8,4 h-38 l-6,-8 Z`} fill="#3a2c1c" />
            <text x={x1 + 20} y={y1 + 26} fontSize={10} textAnchor="middle" fill="#292720">
              沒完成的地下墓室
            </text>
          </>
        )}
      </svg>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          disabled={d >= 5}
          onClick={() => {
            const n = d + 1;
            setD(n);
            if (n >= 5) onDone();
          }}
        >
          {d >= 5 ? '挖到了' : `往下挖（${d}/5）`}
        </button>
      </div>
      {d >= 5 && (
        <Note>
          這條下行通道長約 100 公尺，盡頭是一間在岩盤裡、約地面下 30 公尺的墓室，但始終沒有完工。後來的國王墓室改設在金字塔裡面，用亞斯文的花崗岩蓋成。
        </Note>
      )}
    </>
  );
}

/* ---------- 4. 堆石塊 ---------- */
function Stack({ onDone, done }: { onDone: () => void; done: boolean }) {
  return (
    <>
      <PyramidStack />
      {!done && (
        <div className={styles.actions}>
          <button type="button" onClick={onDone}>
            我找到瓶頸了
          </button>
        </div>
      )}
    </>
  );
}

/* ---------- 5. 坡道 ---------- */
const RAMPS = [
  {
    id: 'straight',
    label: '直坡道',
    pro: '最簡單，適合下半部。',
    con: '越往上坡道越長，到頂端需要比金字塔還大的工程。',
  },
  {
    id: 'zigzag',
    label: '繞行坡道',
    pro: '貼著外牆盤旋而上，用料少。',
    con: '會擋住外牆，轉角處很難轉動大石塊。',
  },
  {
    id: 'internal',
    label: '內部坡道',
    pro: '藏在金字塔裡面，不擋外牆。',
    con: '一位建築師提出的新說法，還沒有直接證據。',
  },
] as const;

function Ramps({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [r, setR] = useState<(typeof RAMPS)[number]['id'] | null>(done ? 'straight' : null);
  const sel = RAMPS.find((x) => x.id === r);
  return (
    <>
      <p className={styles.how}>石塊要拉到上百公尺高。坡道長什麼樣子，到現在還在爭論，選一個看看。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={sel ? sel.label : '選一種坡道'}>
        <rect width={320} height={190} fill="#cfe7f2" />
        <rect y={160} width={320} height={30} fill={SAND} />
        <polygon points="70,160 160,40 250,160" fill={STONE} stroke="#9c7748" />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={70 + i * 11.25} x2={250 - i * 11.25} y1={160 - i * 15} y2={160 - i * 15} stroke="#9c7748" opacity={0.4} />
        ))}
        {r === 'straight' && <polygon points="0,160 120,93 132,93 30,160" fill="#b89a6c" opacity={0.9} />}
        {r === 'zigzag' && (
          <polyline points="250,160 100,140 220,118 122,96 196,78 142,66" fill="none" stroke="#8a6a3a" strokeWidth={7} strokeLinejoin="round" opacity={0.85} />
        )}
        {r === 'internal' && (
          <polyline points="110,150 210,150 190,118 132,118 148,90 176,90 162,66" fill="none" stroke="#8a6a3a" strokeWidth={4} strokeDasharray="6 3" />
        )}
      </svg>
      <div className={p.row}>
        {RAMPS.map((x) => (
          <button
            key={x.id}
            type="button"
            className={r === x.id ? p.go : p.idle}
            aria-pressed={r === x.id}
            onClick={() => {
              setR(x.id);
              onDone();
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
      {sel && (
        <Note theory>
          <strong>{sel.label}</strong>：{sel.pro}缺點是{sel.con}
          2018 年在哈特努布（Hatnub）採石場發現胡夫時代的陡坡道，兩旁有柱洞和台階，可能用繩索和滑輪般的木柱拉橇。
          壁畫也畫著在雪橇前潑水，讓沙子變硬、比較好拉。
        </Note>
      )}
    </>
  );
}

/* ---------- 6. 外層石與頂石 ---------- */
function Casing({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [n, setN] = useState(done ? 2 : 0);
  const steps = Array.from({ length: 10 }, (_, i) => {
    const y = 160 - i * 12;
    const half = 95 - i * 9.5;
    return `M${160 - half},${y} h${half * 2} v-12 h${-half * 2} Z`;
  }).join(' ');
  return (
    <>
      <p className={styles.how}>石塊堆完是一層層的台階。最後還要兩步。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={n === 0 ? '台階狀的金字塔' : n === 1 ? '鋪好外層石' : '放上頂石'}>
        <rect width={320} height={190} fill="#cfe7f2" />
        <rect y={160} width={320} height={30} fill={SAND} />
        {n === 0 ? (
          <path d={steps} fill={STONE} stroke="#9c7748" />
        ) : (
          <polygon points="65,160 160,30 255,160" fill={CASING} stroke="#c8bfae" />
        )}
        {n >= 2 && <polygon points="150,44 160,30 170,44" fill="#e7c24a" stroke="#b8922a" />}
      </svg>
      <div className={p.row}>
        <button
          type="button"
          className={n === 0 ? p.go : p.idle}
          disabled={n !== 0}
          onClick={() => setN(1)}
        >
          1. 鋪上白色外層石
        </button>
        <button
          type="button"
          className={n === 1 ? p.go : p.idle}
          disabled={n !== 1}
          onClick={() => {
            setN(2);
            onDone();
          }}
        >
          2. 放上頂石
        </button>
      </div>
      {n >= 1 && (
        <Note>
          外層是對岸圖拉採來的細白石灰岩，打磨得很光滑，在陽光下閃閃發亮。後來大多被拆去蓋開羅的建築，今天只剩底部幾塊。
          {n >= 2 && ' 胡夫的頂石沒有留下來；是否包金也只是推測。'}
        </Note>
      )}
    </>
  );
}
