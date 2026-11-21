import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { FLOOD_LINE, level, nilometer, season, type Harvest, type Season } from '../games/nile';
import lab from './Lab.module.css';

const SEASONS: Record<Season, { name: string; eg: string; text: string }> = {
  akhet: { name: '氾濫季', eg: 'Akhet', text: '河水漫上田地，留下一層黑色淤泥。田裡沒法耕作，正好是國家徵調人力的時候。' },
  peret: { name: '生長季', eg: 'Peret', text: '水退了，在濕潤的黑土上播種小麥、大麥和亞麻。' },
  shemu: { name: '收穫季', eg: 'Shemu', text: '收割、打穀、繳稅。河水降到一年最低，等待下一次氾濫。' },
};

const HARVEST: Record<Harvest, string> = {
  famine: '饑荒：水太少，大片田地沒被淹到。',
  hunger: '歉收：只有靠近河的田有收成。',
  ok: '還過得去，大家鬆一口氣。',
  good: '安穩的一年。',
  plenty: '大豐收！稅也收得最多。',
  deluge: '水太大：沖毀堤岸和村莊，播種延誤。',
};

const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1} 月`);

function Valley({ month, dam }: { month: number; dam: boolean }) {
  const lv = level(month, dam);
  const y = 150 - lv * 90; // water surface
  const fieldY = 150 - FLOOD_LINE * 90;
  const flooded = lv > FLOOD_LINE;
  const s = season(month);
  const silt = !dam && (s === 'peret' || (s === 'akhet' && month >= 8));
  return (
    <svg className={lab.visual} style={{ maxHeight: 200, background: '#f6e2b8' }} viewBox="0 0 320 180" role="img" aria-label={`${MONTHS[month]}：${flooded ? '田地被淹沒' : '河水在河道內'}`}>
      {/* desert cliffs */}
      <path d={`M0 40 L50 40 L70 ${fieldY} L0 ${fieldY} Z`} fill="#d9b57c" />
      <path d={`M320 40 L270 40 L250 ${fieldY} L320 ${fieldY} Z`} fill="#d9b57c" />
      {/* fields */}
      <rect x={0} y={fieldY} width={320} height={180 - fieldY} fill="#8a6a45" />
      <rect x={70} y={fieldY - 4} width={180} height={4} fill={silt ? '#3a2c20' : s === 'shemu' ? '#d8b24a' : '#7da35a'} />
      {s === 'peret' && !flooded &&
        Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${80 + i * 12.5} ${fieldY - 4} v-8`} stroke="#5f8a3c" strokeWidth={2} />)}
      {s === 'shemu' && !flooded &&
        Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${80 + i * 12.5} ${fieldY - 4} v-12`} stroke="#c9a03a" strokeWidth={2} />)}
      {/* channel */}
      <path d={`M130 ${fieldY} L140 165 L180 165 L190 ${fieldY} Z`} fill="#6b5036" />
      {/* water */}
      {flooded ? (
        <path d={`M62 ${y} L258 ${y} L250 ${fieldY} L190 ${fieldY} L180 165 L140 165 L130 ${fieldY} L70 ${fieldY} Z`} fill="#4f95ad" opacity={0.9} />
      ) : (
        <path d={`M${130 + (y - fieldY) * -0.2} ${y} L${190 + (y - fieldY) * 0.2} ${y} L180 165 L140 165 Z`} fill="#4f95ad" />
      )}
      <line x1={0} y1={fieldY} x2={320} y2={fieldY} stroke="#fff" strokeDasharray="3 3" opacity={0.5} />
      <text x={8} y={20} fontSize={13} fontWeight={700} fill="#292720">
        {MONTHS[month]}・{SEASONS[s].name}
      </text>
      <text x={312} y={20} fontSize={11} fill="#6e6656" textAnchor="end">
        {dam ? '高壩之後' : '高壩之前'}
      </text>
      <text x={8} y={174} fontSize={10} fill="#f4ebd9">
        河谷剖面示意
      </text>
    </svg>
  );
}

function Nilometer({ cubits }: { cubits: number }) {
  const top = 20;
  const step = 14; // px per cubit, 10..19
  const yOf = (c: number) => top + (19.5 - c) * step;
  return (
    <svg className={lab.visual} style={{ maxHeight: 200, background: '#efe3c8' }} viewBox="0 0 320 180" role="img" aria-label={`水位計讀數 ${cubits} 肘`}>
      <rect x={120} y={10} width={90} height={170} fill="#c9b08a" />
      <rect x={130} y={yOf(cubits)} width={70} height={180 - yOf(cubits)} fill="#4f95ad" />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={120 + i * 8} y={30 + i * 24} width={16} height={8} fill="#a8916a" />
      ))}
      {Array.from({ length: 10 }, (_, i) => {
        const c = 10 + i;
        const yy = yOf(c);
        return (
          <g key={c}>
            <line x1={200} y1={yy} x2={214} y2={yy} stroke="#292720" strokeWidth={c % 2 ? 1 : 2} />
            <text x={220} y={yy + 4} fontSize={11} fill="#292720">
              {c}
            </text>
          </g>
        );
      })}
      <text x={240} y={yOf(cubits) + 4} fontSize={12} fontWeight={700} fill="#244c79">
        ← {cubits} 肘
      </text>
      <text x={8} y={20} fontSize={12} fill="#6e6656">
        水位計示意
      </text>
    </svg>
  );
}

/** The Nile's year (flood, growth, harvest; before/after the dam) and a Nilometer reading. */
export function NileYearLab({ activityId }: { activityId: string }) {
  const [mode, setMode] = useState<'year' | 'meter'>('year');
  const [month, setMonth] = useState(4);
  const [dam, setDam] = useState(false);
  const [cubits, setCubits] = useState(14);
  const [seen, setSeen] = useState<Set<Season>>(() => new Set([season(4)]));
  const [metered, setMetered] = useState(false);
  const [done, setDone] = useState(false);

  const check = (s: Set<Season>, m: boolean) => {
    if (!done && s.size === 3 && m) {
      setDone(true);
      markActivityDone(activityId);
    }
  };
  const pickMonth = (m: number) => {
    setMonth(m);
    const next = seen.has(season(m)) ? seen : new Set(seen).add(season(m));
    if (next !== seen) setSeen(next);
    check(next, metered);
  };
  const pickCubits = (c: number) => {
    setCubits(c);
    setMetered(true);
    check(seen, true);
  };

  const s = SEASONS[season(month)];
  const r = nilometer(cubits);
  return (
    <div className={lab.lab}>
      <p className={lab.question}>尼羅河一年裡怎麼變？漲多少水才算好年？</p>
      <div className={lab.toggle} role="group" aria-label="切換">
        <button type="button" aria-pressed={mode === 'year'} onClick={() => setMode('year')}>
          河的一年
        </button>
        <button type="button" aria-pressed={mode === 'meter'} onClick={() => setMode('meter')}>
          讀水位計
        </button>
      </div>
      {mode === 'year' ? (
        <>
          <p className={lab.how}>拖動月份，看河水、田地和農事怎麼變。再切到「高壩之後」比比看。</p>
          <Valley month={month} dam={dam} />
          <p style={{ margin: 0 }}>
            <b>
              {s.name}（{s.eg}）
            </b>
            ：{dam ? '高壩建成後，河水整年留在河道裡，不再氾濫；田地靠渠道灌溉和化肥。' : s.text}
          </p>
          <label className={lab.slider}>
            <span>月份</span>
            <input type="range" min={0} max={11} value={month} onChange={(e) => pickMonth(+e.target.value)} aria-label="月份" aria-valuetext={MONTHS[month]} />
            <output>{MONTHS[month]}</output>
          </label>
          <div className={lab.toggle} role="group" aria-label="高壩">
            <button type="button" aria-pressed={!dam} onClick={() => setDam(false)}>
              高壩之前
            </button>
            <button type="button" aria-pressed={dam} onClick={() => setDam(true)}>
              高壩之後
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={lab.how}>氾濫最高時，水漲到幾「肘」？拉動水位看看這一年會怎樣。</p>
          <Nilometer cubits={cubits} />
          <label className={lab.slider}>
            <span>水位</span>
            <input type="range" min={10} max={19} value={cubits} onChange={(e) => pickCubits(+e.target.value)} aria-label="水位（肘）" aria-valuetext={`${cubits} 肘`} />
            <output>{cubits} 肘</output>
          </label>
          <div className={lab.result}>
            <div>
              <strong>{'🌾'.repeat(Math.max(1, r.tax))}</strong>
              <span>收成</span>
            </div>
            <div>
              <strong>{r.tax === 0 ? '免' : '💰'.repeat(r.tax)}</strong>
              <span>稅</span>
            </div>
          </div>
          <p className={lab.status} aria-live="polite">
            {HARVEST[r.harvest]}
          </p>
        </>
      )}
      {done && (
        <div className={lab.explain}>
          <p>
            古埃及人叫自己的國家「凱密特」（Kemet），意思是「黑土地」，就是氾濫留下的淤泥。官員看水位計定稅：水漲得好，稅就收得多。
          </p>
          <p>
            <span className={lab.tag}>示意</span> 月份與水位為大略形狀；肘數對照取自古羅馬作家老普林尼的記載。
          </p>
        </div>
      )}
    </div>
  );
}
