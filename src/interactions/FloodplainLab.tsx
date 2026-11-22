import { useState } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import {
  BANDS,
  FLOODS,
  STAGES,
  bandState,
  outcome,
  villagesFlooded,
  villagesRuined,
  waterReach,
  type LandState,
  type Phase,
} from '../games/floodplain';
import type { Harvest } from '../games/nile';
import lab from './Lab.module.css';

const COLOR: Record<LandState, string> = {
  water: '#4f95ad',
  dry: '#cdb084',
  stubble: '#c2a473',
  silt: '#3a2c20',
  green: '#6f9e4c',
  gold: '#d8b24a',
  fallow: '#cdb084',
};
const LEGEND: Partial<Record<LandState, string>> = {
  water: '淹水',
  silt: '黑色淤泥',
  green: '麥田',
  gold: '收割',
  fallow: '沒水休耕',
  dry: '乾地',
  stubble: '收完的田',
};

const HARVEST: Record<Harvest, string> = {
  famine: '饑荒：大片田地沒淹到，種不了。',
  hunger: '歉收：只有低處的田有收成。',
  ok: '還過得去，高處的田還是乾的。',
  good: '安穩的一年。',
  plenty: '大豐收！幾乎每塊田都喝飽了水。',
  deluge: '水太大：沖毀堤岸和村莊，退得慢、播種延誤。',
};

/* Schematic Nile (north up): Delta fan, Cairo at the apex, the valley down to Aswan, Fayum to the west. */
const VALLEY = 'M160 110 C150 150 138 178 150 200 S192 222 204 236 S204 262 210 278 S222 302 224 324';
const BRANCHES = ['M160 110 Q132 72 110 22', 'M160 110 Q188 72 212 22'];
const FAN = 'M160 110 L94 30 Q160 12 230 30 Z';
const VALLEY_W = [0, 9, 15, 22, 30];
const BRANCH_W = [0, 12, 22, 34, 46];
const VILLAGES: [number, number][] = [
  [128, 62], [192, 64], [160, 84],
  [178, 140], [126, 172], [170, 196], [226, 236], [186, 258], [233, 286], [204, 304],
];

function House({ x, y, state }: { x: number; y: number; state: 'ok' | 'flooded' | 'ruined' }) {
  const c = state === 'ok' ? '#7a5a3a' : '#c0503f';
  return (
    <g transform={`translate(${x} ${y})`}>
      {state === 'flooded' && <circle r={8} fill={COLOR.water} />}
      <path d="M-4 0 L0 -4 L4 0 V4 H-4 Z" fill={c} stroke="#fff" strokeWidth={0.8} />
      {state !== 'ok' && <path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="#fff" strokeWidth={1.4} />}
    </g>
  );
}

function FloodMap({ fi, si }: { fi: number; si: number }) {
  const flood = FLOODS[fi];
  const stage = STAGES[si];
  const col = (b: number) => COLOR[bandState(b, flood, stage)];
  const vState = villagesFlooded(flood, stage) ? 'flooded' : villagesRuined(flood, stage) ? 'ruined' : 'ok';
  const reach = waterReach(flood, stage);
  const label = { fontSize: 10, fill: '#5a4a32', stroke: '#ecd6a6', strokeWidth: 3, paintOrder: 'stroke' } as const;
  return (
    <svg
      className={lab.visual}
      style={{ maxHeight: 340, background: '#ecd6a6' }}
      viewBox="0 0 320 330"
      role="img"
      aria-label={`${stage.month}${stage.name}，水量${flood.name}：${reach === 0 ? '河水在河道裡' : reach >= 4 ? '整片平原都淹了' : '低處的田淹了'}`}
    >
      {/* Fayum, fed by the Bahr Yusuf canal */}
      <path d="M150 196 Q128 180 122 158" fill="none" stroke={COLOR.water} strokeWidth={1.5} />
      <ellipse cx={116} cy={150} rx={16} ry={11} fill={col(3)} />
      <ellipse cx={108} cy={146} rx={7} ry={4} fill={COLOR.water} />
      {/* height bands, highest first */}
      <path d={FAN} fill={col(4)} />
      {[4, 3, 2, 1].map((b) => (
        <g key={b} fill="none" stroke={col(b)} strokeLinecap="round" strokeLinejoin="round">
          <path d={VALLEY} strokeWidth={VALLEY_W[b]} />
          {b < 4 && BRANCHES.map((d) => <path key={d} d={d} strokeWidth={BRANCH_W[b]} />)}
        </g>
      ))}
      {/* the river itself */}
      <g fill="none" stroke="#2f7590" strokeWidth={2.5} strokeLinecap="round">
        <path d={VALLEY} />
        {BRANCHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {VILLAGES.map(([x, y]) => (
        <House key={`${x}-${y}`} x={x} y={y} state={vState} />
      ))}
      {/* Mediterranean */}
      <path d="M-60 0 H380 V30 H230 Q160 12 94 30 H-60 Z" fill="#8cc0d0" />
      <text x={160} y={14} fontSize={10} fill="#24526a" textAnchor="middle">
        地中海
      </text>
      <text x={168} y={52} {...label}>三角洲</text>
      <text x={170} y={114} {...label}>開羅</text>
      <text x={78} y={174} {...label}>法尤姆</text>
      <text x={218} y={266} {...label}>路克索</text>
      <text x={232} y={322} {...label}>亞斯文</text>
      <text x={8} y={316} fontSize={13} fontWeight={700} fill="#292720">
        {stage.month}・{stage.name}
      </text>
      <text x={312} y={44} fontSize={10} fill="#6e6656" textAnchor="end">
        N↑ 示意
      </text>
    </svg>
  );
}

const ERAS: { id: string; name: string; when: string; crops: string; text: string; water: string }[] = [
  {
    id: 'pharaoh',
    name: '法老時代',
    when: '約前 3000–前 332 年',
    crops: '🌾 二粒小麥・大麥　🧵 亞麻　🌿 紙莎草　🧅 扁豆、洋蔥',
    text: '小麥和大麥做麵包、釀啤酒；亞麻織成衣服和木乃伊裹布；三角洲沼澤的紙莎草拿來造紙、編繩、紮小船。',
    water: '盆地灌溉：築堤把田圍成一格格，讓氾濫水停留，退水後播種，一年一熟。',
  },
  {
    id: 'rome',
    name: '希臘羅馬',
    when: '前 332–後 641 年',
    crops: '🌾 硬粒小麥　🍇 葡萄　🫒 橄欖',
    text: '埃及成了羅馬的糧倉，運糧船把小麥送到羅馬，據記載一年約夠全城吃四個月。托勒密王朝排乾法尤姆的湖沼，開出大片新田。',
    water: '開始用牛拉的水車（薩奇亞）把水提上高處，旱季也能澆一點。',
  },
  {
    id: 'islam',
    name: '伊斯蘭時代',
    when: '641 年起',
    crops: '🎋 甘蔗　🍚 稻米　🍊 柑橘　🍆 茄子',
    text: '新作物從東方傳來：甘蔗熬成糖，埃及糖遠銷地中海；三角洲北部的濕地種起稻米。',
    water: '這些作物要在夏天生長，得靠水車和渠道在低水期澆灌。',
  },
  {
    id: 'cotton',
    name: '19 世紀',
    when: '約 1820–1950 年',
    crops: '☁️ 長絨棉　🌾 小麥　🌽 玉米',
    text: '穆罕默德・阿里推廣長絨棉，棉花成了出口大宗；美國南北戰爭時棉價暴漲，三角洲到處是棉田。',
    water: '挖深渠道、建三角洲攔河壩和第一座亞斯文壩，改成全年灌溉，夏天也能種棉花。',
  },
  {
    id: 'dam',
    name: '高壩之後',
    when: '1970 年起',
    crops: '🌾 小麥　🍚 稻米　🌽 玉米　🎋 甘蔗　🍊 柑橘、蔬果　🍀 三葉草（飼料）',
    text: '不再氾濫，田地一年可種兩到三季。但淤泥被攔在納瑟湖，只能改用化肥；部分田地鹽化，三角洲海岸也在後退。埃及如今要大量進口小麥。',
    water: '整年靠渠道和抽水機灌溉。',
  },
];

/** How far the flood spreads over the floodplain, what it means for the harvest, and what was grown there over time. */
export function FloodplainLab({ activityId }: { activityId: string }) {
  const [mode, setMode] = useState<'map' | 'crops'>('map');
  const [fi, setFi] = useState(3);
  const [si, setSi] = useState(2);
  const [tried, setTried] = useState<Set<number>>(() => new Set([3]));
  const [seen, setSeen] = useState<Set<Phase>>(() => new Set<Phase>(['peak']));
  const [era, setEra] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const check = (t: Set<number>, s: Set<Phase>) => {
    if (!done && t.size >= 3 && s.has('harvest')) {
      setDone(true);
      markActivityDone(activityId);
    }
  };
  const pickFlood = (i: number) => {
    setFi(i);
    const t = new Set(tried).add(i);
    setTried(t);
    check(t, seen);
  };
  const pickStage = (i: number) => {
    setSi(i);
    const s = new Set(seen).add(STAGES[i].phase);
    setSeen(s);
    check(tried, s);
  };

  const flood = FLOODS[fi];
  const stage = STAGES[si];
  const r = outcome(flood);
  const states = new Set<LandState>(BANDS.map((b) => bandState(b, flood, stage)));
  const ruined = villagesRuined(flood, stage) || villagesFlooded(flood, stage);
  const e = ERAS.find((x) => x.id === era);

  return (
    <div className={lab.lab}>
      <p className={lab.question}>水漲多少、淹到哪，這一年就吃得飽？</p>
      <div className={lab.toggle} role="group" aria-label="切換">
        <button type="button" aria-pressed={mode === 'map'} onClick={() => setMode('map')}>
          淹到哪
        </button>
        <button type="button" aria-pressed={mode === 'crops'} onClick={() => setMode('crops')}>
          種什麼
        </button>
      </div>
      {mode === 'map' ? (
        <>
          <p className={lab.how}>調水量和季節，看氾濫淹到哪裡、秋後能收多少。</p>
          <FloodMap fi={fi} si={si} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', fontSize: 12, color: 'var(--muted)' }}>
            {[...states].map((s) => (
              <span key={s}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: COLOR[s], marginRight: 4, verticalAlign: -1 }} />
                {LEGEND[s]}
              </span>
            ))}
            {ruined && <span style={{ color: '#a33b2f' }}>✕ 村莊被沖毀</span>}
          </div>
          <div className={lab.sliders}>
            <label className={lab.slider}>
              <span>水量</span>
              <input type="range" min={0} max={FLOODS.length - 1} value={fi} onChange={(ev) => pickFlood(+ev.target.value)} aria-label="氾濫水量" aria-valuetext={`${flood.name}，${flood.cubits} 肘`} />
              <output>
                {flood.name} {flood.cubits}肘
              </output>
            </label>
            <label className={lab.slider}>
              <span>季節</span>
              <input type="range" min={0} max={STAGES.length - 1} value={si} onChange={(ev) => pickStage(+ev.target.value)} aria-label="季節" aria-valuetext={`${stage.month}${stage.name}`} />
              <output>{stage.month}</output>
            </label>
          </div>
          <div className={lab.result}>
            <div>
              <strong>{'🌾'.repeat(r.sheaves)}</strong>
              <span>今年收成</span>
            </div>
            <div>
              <strong>{Math.round(r.watered * 100)}%</strong>
              <span>田地喝到水</span>
            </div>
          </div>
          <p className={lab.status} aria-live="polite">
            {HARVEST[r.harvest]}
          </p>
          {done && (
            <div className={lab.explain}>
              <p>氾濫不只帶水，還留下一層黑色淤泥當肥料。沒淹到的高地整年種不了；水太大又會沖毀村莊、延誤播種。</p>
              <p>
                高壩建成後河水不再漫上田地，見<Link to="/place/aswan-high-dam/dam-control">水壩調度</Link>。
              </p>
              <p>
                <span className={lab.tag}>示意</span> 地圖與田地高低分帶為示意；肘數對照老普林尼的記載。
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <p className={lab.how}>同一片黑土，不同時代種的東西不一樣。點一個時代看看。</p>
          <div className={lab.buttons}>
            {ERAS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={era === x.id}
                onClick={() => setEra(era === x.id ? null : x.id)}
                style={era === x.id ? { background: 'var(--lapis)', color: '#fff', borderColor: 'var(--lapis)' } : undefined}
              >
                {x.name}
              </button>
            ))}
          </div>
          {e && (
            <div className={lab.explain} aria-live="polite">
              <p>
                <b>{e.name}</b>
                <span style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 8 }}>{e.when}</span>
              </p>
              <p>{e.crops}</p>
              <p>{e.text}</p>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>💧 {e.water}</p>
              {e.id === 'dam' && (
                <p>
                  試試<Link to="/place/aswan-high-dam/dam-control">水壩調度</Link>。
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
