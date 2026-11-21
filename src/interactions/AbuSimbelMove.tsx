import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import { beamReach, dayOfYear, MOVE, SANCTUARY } from '../games/abusimbel';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';

/** 阿布辛貝搬家：水漲 → 切塊 → 搬高 → 人造山 → 陽光節 */
const STAGES = ['水漲上來', '切成大塊', '搬到高處', '人造山', '陽光節'] as const;

const SKY = '#cfe7f2';
const ROCK = '#d8b98a';
const ROCK_DARK = '#b0905f';
const WATER = '#3f8fa6';
const FACADE = '#e7c995';

export function AbuSimbelMove({ activityId }: { activityId: string }) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState<boolean[]>(() => STAGES.map(() => false));
  const [explained, setExplained] = useState(false);
  const complete = (i: number) => setDone((d) => d.map((v, j) => (j === i ? true : v)));
  const last = stage === STAGES.length - 1;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>一整座山裡的神殿，怎麼搬家？</p>
      <ol className={p.steps} aria-label="步驟">
        {STAGES.map((t, i) => (
          <li key={t}>
            <button
              type="button"
              aria-current={stage === i ? 'step' : undefined}
              className={`${p.step} ${stage === i ? p.on : ''} ${done[i] ? p.done : ''}`}
              disabled={i > 0 && !done[i - 1]}
              onClick={() => setStage(i)}
            >
              <span>{done[i] ? '✓' : i + 1}</span>
              {t}
            </button>
          </li>
        ))}
      </ol>

      {stage === 0 && <Flood done={done[0]} onDone={() => complete(0)} />}
      {stage === 1 && <Cut done={done[1]} onDone={() => complete(1)} />}
      {stage === 2 && <Lift done={done[2]} onDone={() => complete(2)} />}
      {stage === 3 && <Dome done={done[3]} onDone={() => complete(3)} />}
      {stage === 4 && <Sun done={done[4]} onDone={() => complete(4)} />}

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
            1960 年代興建<Link to="/place/aswan-high-dam">亞斯文高壩</Link>，納瑟湖會淹掉努比亞上百公里的河谷。
            聯合國教科文組織發起國際救援，約五十個國家出錢出力，阿布辛貝是其中最大的工程。
          </p>
          <p>
            {MOVE.years} 年，工程團隊把兩座神殿切成一千多塊，平均約 {MOVE.avgTonnes} 噸、最重約 {MOVE.maxTonnes} 噸，
            在比原址高約 {MOVE.higherM} 公尺、往後約 {MOVE.backM} 公尺的地方重新組裝。
          </p>
          <p>
            <span className={styles.tag}>證據等級</span> 搬遷的數字是工程紀錄。「陽光節」日期本來就對準哪兩天，以及搬家後是否晚了一天，說法不一。
          </p>
        </div>
      )}
    </div>
  );
}

function Note({ children }: { children: ReactNode }) {
  return <p className={p.note}>{children}</p>;
}

/** Four seated colossi, drawn simply. */
function Facade({ x, y, w, h, cut = 0, ghost }: { x: number; y: number; w: number; h: number; cut?: number; ghost?: boolean }) {
  const cw = w / 4;
  return (
    <g opacity={ghost ? 0.5 : 1}>
      <rect x={x} y={y} width={w} height={h} fill={ghost ? 'none' : FACADE} stroke={ROCK_DARK} strokeDasharray={ghost ? '4 3' : undefined} />
      {!ghost &&
        Array.from({ length: 4 }, (_, i) => {
          const cx = x + cw * i + cw / 2;
          return (
            <g key={i} fill="#c9a46c">
              <circle cx={cx} cy={y + h * 0.2} r={cw * 0.18} />
              <rect x={cx - cw * 0.25} y={y + h * 0.32} width={cw * 0.5} height={h * 0.38} rx={3} />
              <rect x={cx - cw * 0.3} y={y + h * 0.68} width={cw * 0.6} height={h * 0.3} />
            </g>
          );
        })}
      {!ghost && <rect x={x + w / 2 - 6} y={y + h - 22} width={12} height={22} fill="#5a4630" />}
      {cut > 0 &&
        Array.from({ length: cut * 2 }, (_, i) => (
          <line key={`v${i}`} x1={x + ((i + 1) * w) / (cut * 2 + 1)} x2={x + ((i + 1) * w) / (cut * 2 + 1)} y1={y} y2={y + h} stroke="#7a5a32" />
        ))}
      {cut > 0 &&
        Array.from({ length: cut }, (_, i) => (
          <line key={`h${i}`} x1={x} x2={x + w} y1={y + ((i + 1) * h) / (cut + 1)} y2={y + ((i + 1) * h) / (cut + 1)} stroke="#7a5a32" />
        ))}
    </g>
  );
}

/* ---------- 1. 水漲上來 ---------- */
function Flood({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [lv, setLv] = useState(done ? 100 : 0);
  const waterY = 168 - lv;
  const covered = waterY < 112;
  return (
    <>
      <p className={styles.how}>高壩蓋好後，水位一年年升高。拖動看看神殿會怎樣。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={covered ? '神殿被淹沒' : `水位上升 ${lv}%`}>
        <rect width={320} height={190} fill={SKY} />
        <path d="M0,40 L60,40 L120,60 L180,100 L210,168 L0,168Z" fill={ROCK} stroke={ROCK_DARK} />
        <Facade x={70} y={112} w={100} h={56} />
        <rect x={0} y={168} width={320} height={22} fill={ROCK_DARK} />
        <rect x={0} y={waterY} width={320} height={190 - waterY} fill={WATER} opacity={0.75} />
        <text x={312} y={waterY - 6} fontSize={11} textAnchor="end" fill="#1f4e79">
          {lv === 0 ? '原本的尼羅河' : '納瑟湖水位'}
        </text>
      </svg>
      <label className={styles.slider}>
        <span>水位</span>
        <input
          type="range"
          min={0}
          max={100}
          value={lv}
          aria-label="水位"
          onChange={(e) => {
            const v = +e.target.value;
            setLv(v);
            if (v >= 90 && !done) onDone();
          }}
        />
        <output>{covered ? '淹沒了' : `+${Math.round(lv * 0.65)} 公尺`}</output>
      </label>
      {(covered || done) && <Note>納瑟湖比原本的河面高出約 60 公尺，神殿整個會沉到湖底。不搬，就再也看不到了。</Note>}
    </>
  );
}

/* ---------- 2. 切成大塊 ---------- */
function Cut({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [n, setN] = useState(done ? 4 : 0);
  return (
    <>
      <p className={styles.how}>先在河邊築臨時堤擋水，再把神殿一塊塊鋸開。按「鋸」把整面切完。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`已切 ${n} / 4 輪`}>
        <rect width={320} height={190} fill={SKY} />
        <rect x={0} y={20} width={320} height={170} fill={ROCK} />
        <Facade x={60} y={40} w={200} h={130} cut={n} />
      </svg>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          disabled={n >= 4}
          onClick={() => {
            const v = n + 1;
            setN(v);
            if (v >= 4) onDone();
          }}
        >
          {n >= 4 ? '切完了' : `鋸（${n}/4）`}
        </button>
      </div>
      {n >= 4 && (
        <Note>
          兩座神殿被切成一千多塊，每塊平均約 {MOVE.avgTonnes} 噸、最重約 {MOVE.maxTonnes} 噸。
          正面靠近雕像的地方改用手鋸，盡量不傷到浮雕，重組後再把切縫補起來。
        </Note>
      )}
    </>
  );
}

/* ---------- 3. 搬到高處 ---------- */
function Lift({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [f, setF] = useState(done ? 100 : 0);
  const t = f / 100;
  const x = 160 - 120 * t;
  const y = 130 - 70 * t;
  return (
    <>
      <p className={styles.how}>把石塊吊上岸邊的高地，往後退、往上搬。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`搬了 ${f}%`}>
        <rect width={320} height={190} fill={SKY} />
        <path d="M0,100 L120,100 L150,120 L200,176 L0,176Z" fill={ROCK} stroke={ROCK_DARK} />
        <rect x={0} y={176} width={320} height={14} fill={ROCK_DARK} />
        <rect x={0} y={108} width={320} height={82} fill={WATER} opacity={t > 0.95 ? 0.7 : 0} />
        <Facade x={160} y={130} w={60} h={40} ghost />
        <text x={190} y={186} fontSize={9} textAnchor="middle" fill="#fff">
          原址
        </text>
        <Facade x={x} y={y} w={60} h={40} cut={2} />
        {t > 0 && t < 1 && <line x1={x + 30} y1={0} x2={x + 30} y2={y} stroke="#555" />}
        {t >= 1 && (
          <text x={x + 30} y={y - 6} fontSize={10} textAnchor="middle" fill="#292720">
            高 {MOVE.higherM} 公尺、後退 {MOVE.backM} 公尺
          </text>
        )}
      </svg>
      <label className={styles.slider}>
        <span>搬運</span>
        <input
          type="range"
          min={0}
          max={100}
          value={f}
          aria-label="搬運進度"
          onChange={(e) => {
            const v = +e.target.value;
            setF(v);
            if (v >= 100 && !done) onDone();
          }}
        />
        <output>{f >= 100 ? '到了' : `${f}%`}</output>
      </label>
      {f >= 100 && <Note>新位置在原址上方約 {MOVE.higherM} 公尺、往後約 {MOVE.backM} 公尺。原來的位置現在在納瑟湖底。</Note>}
    </>
  );
}

/* ---------- 4. 人造山 ---------- */
function Dome({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [n, setN] = useState(done ? 2 : 0);
  return (
    <>
      <p className={styles.how}>神殿原本是鑿進山裡的。搬到新家後，要給它一座新的「山」。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={n === 0 ? '組裝好的神殿' : n === 1 ? '蓋上混凝土圓頂' : '外面堆上岩石'}>
        <rect width={320} height={190} fill={SKY} />
        <rect x={0} y={160} width={320} height={30} fill={ROCK_DARK} />
        {n >= 2 && <path d="M20,160 C40,60 110,30 170,34 C240,40 290,90 305,160Z" fill={ROCK} stroke={ROCK_DARK} />}
        {n >= 1 && (
          <path d="M40,160 A120,110 0 0 1 280,160" fill={n >= 2 ? 'none' : '#cfcac0'} stroke="#8a8a8a" strokeWidth={n >= 2 ? 1.5 : 3} strokeDasharray={n >= 2 ? '5 4' : undefined} />
        )}
        <rect x={150} y={128} width={110} height={10} fill="#5a4630" opacity={0.6} />
        <Facade x={90} y={112} w={70} h={48} />
        {n >= 2 && (
          <text x={210} y={100} fontSize={10} textAnchor="middle" fill="#5a4630">
            裡面是空心的圓頂
          </text>
        )}
      </svg>
      <div className={p.row}>
        <button type="button" className={n === 0 ? p.go : p.idle} disabled={n !== 0} onClick={() => setN(1)}>
          1. 蓋混凝土圓頂
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
          2. 外面堆上岩石
        </button>
      </div>
      {n >= 2 && <Note>從外面看是一座岩石小山，其實裡面是巨大的鋼筋混凝土圓頂，撐住上方的重量。</Note>}
    </>
  );
}

/* ---------- 5. 陽光節 ---------- */
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function fromDoy(d: number): [number, number] {
  let m = 0;
  while (d > MONTH_DAYS[m]) d -= MONTH_DAYS[m++];
  return [m + 1, d];
}

function Sun({ onDone, done }: { onDone: () => void; done: boolean }) {
  const [doy, setDoy] = useState(done ? dayOfYear(2, 22) : dayOfYear(6, 21));
  const [m, d] = fromDoy(doy);
  const reach = beamReach(m, d);
  const beamEnd = reach === 'sanctuary' ? 270 : reach === 'hall' ? 190 : 60;
  return (
    <>
      <p className={styles.how}>神殿大門朝東。拖動日期，看早晨第一道陽光能照多深。</p>
      <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`${m} 月 ${d} 日：${reach === 'sanctuary' ? '陽光照進聖殿' : '陽光照不到聖殿'}`}>
        <rect width={320} height={190} fill="#2b2418" />
        <rect x={20} y={70} width={280} height={60} fill="#3d3224" />
        <text x={30} y={62} fontSize={10} fill="#e9dcc0">
          ← 大門（朝東）
        </text>
        <text x={290} y={62} fontSize={10} textAnchor="end" fill="#e9dcc0">
          最深處的聖殿 →
        </text>
        <polygon points={`0,95 0,105 ${beamEnd},${102} ${beamEnd},${98}`} fill="#ffd66b" opacity={0.85} />
        {SANCTUARY.map((s, i) => {
          const lit = reach === 'sanctuary' && s.lit;
          return (
            <g key={s.id}>
              <rect x={226 + i * 18} y={84} width={14} height={40} rx={4} fill={lit ? '#ffd66b' : '#5a4a36'} />
              <text x={233 + i * 18} y={142} fontSize={8} textAnchor="middle" fill={lit ? '#ffd66b' : '#a8987a'}>
                {s.nameZh.slice(0, 2)}
              </text>
            </g>
          );
        })}
      </svg>
      <label className={styles.slider}>
        <span>日期</span>
        <input
          type="range"
          min={1}
          max={365}
          value={doy}
          aria-label="日期"
          onChange={(e) => {
            const v = +e.target.value;
            setDoy(v);
            const [mm, dd] = fromDoy(v);
            if (beamReach(mm, dd) === 'sanctuary' && !done) onDone();
          }}
        />
        <output>
          {m}/{d}
        </output>
      </label>
      {(reach === 'sanctuary' || done) && (
        <Note>
          約 2 月 22 日和 10 月 22 日前後，陽光直直穿過約 60 公尺深的神殿，照亮聖殿裡的阿蒙、拉美西斯二世和拉－荷拉克提。
          只有冥界之神普塔一直待在黑暗裡。搬家時工程師保留了這個方向。
        </Note>
      )}
    </>
  );
}
