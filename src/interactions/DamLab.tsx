import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CAPACITY, DRY, EVAPORATION, FLOOD, simulateDam, YEARS } from '../games/dam';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';

const W = 320;
const H = 170;
const TOP = 22;
const BOTTOM = 150;
const MAX_FLOW = 30;
const fmt = (n: number) => (Math.round(n * 10) / 10).toString();

export function DamLab({ activityId }: { activityId: string }) {
  const [release, setRelease] = useState(9);
  const [dam, setDam] = useState(true);
  const [explained, setExplained] = useState(false);
  const r = simulateDam(release, dam);
  const n = r.months.length;
  const bw = W / n;
  const yFlow = (v: number) => BOTTOM - (Math.min(v, MAX_FLOW) / MAX_FLOW) * (BOTTOM - TOP);
  const yStore = (v: number) => BOTTOM - (v / CAPACITY) * (BOTTOM - TOP);
  const storeLine = r.months.map((m, i) => `${(i + 0.5) * bw},${yStore(m.storage)}`).join(' ');

  const verdict =
    r.verdict === 'both'
      ? { title: '又淹又乾', text: '夏天氾濫成災，乾季河水又不夠。' }
      : r.verdict === 'flood'
      ? { title: '下游淹水', text: dam ? '湖滿了只能溢流，洪水一樣沖下去。' : '每年夏天洪水都漫進田裡。' }
      : r.verdict === 'dry'
        ? { title: '下游缺水', text: dam ? '放得太快，乾旱年湖水見底。' : '春天河水太少，田裡缺水。' }
        : { title: '平穩度過', text: '洪水和乾旱都被湖水吸收了。' };

  return (
    <div className={styles.lab}>
      <p className={styles.question}>擋住尼羅河的洪水，是好事還是壞事？</p>
      <p className={styles.how}>四年裡有一次大洪水、兩年乾旱。調整每月放水量，讓下游不淹也不乾。</p>

      <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${verdict.title}：淹水 ${r.floodMonths} 個月，缺水 ${r.dryMonths} 個月`}>
        {YEARS.map((y, i) => (
          <g key={i}>
            <rect x={i * 12 * bw} y={TOP} width={12 * bw} height={BOTTOM - TOP} fill={i % 2 ? '#00000008' : 'none'} />
            <text x={i * 12 * bw + 4} y={H - 6} fontSize={11} fill="#6b6457">
              {y.label}
            </text>
          </g>
        ))}
        {r.months.map((m, i) => (
          <rect
            key={i}
            x={i * bw + 0.6}
            y={yFlow(m.outflow)}
            width={bw - 1.2}
            height={BOTTOM - yFlow(m.outflow)}
            fill={m.flood ? '#c0503f' : m.dry ? '#e0a13a' : '#3f8fa6'}
          />
        ))}
        <line x1={0} x2={W} y1={yFlow(FLOOD)} y2={yFlow(FLOOD)} stroke="#c0503f" strokeDasharray="4 3" />
        <line x1={0} x2={W} y1={yFlow(DRY)} y2={yFlow(DRY)} stroke="#e0a13a" strokeDasharray="4 3" />
        {dam && <polyline points={storeLine} fill="none" stroke="#1f4e79" strokeWidth={2} />}
        <text x={4} y={14} fontSize={11} fill="#3f8fa6">
          ▮ 下游水量
        </text>
        {dam && (
          <text x={80} y={14} fontSize={11} fill="#1f4e79">
            ━ 湖裡的水
          </text>
        )}
        <text x={W - 4} y={yFlow(FLOOD) - 3} fontSize={10} fill="#c0503f" textAnchor="end" stroke="#f7f3ea" strokeWidth={3} paintOrder="stroke">
          淹水線
        </text>
        <text x={W - 4} y={yFlow(DRY) - 3} fontSize={10} fill="#a8711c" textAnchor="end" stroke="#f7f3ea" strokeWidth={3} paintOrder="stroke">
          缺水線
        </text>
      </svg>

      <div className={styles.result}>
        <div>
          <strong className={r.verdict === 'ok' ? undefined : styles.bottleneck}>{verdict.title}</strong>
          <span>{verdict.text}</span>
        </div>
        <div>
          <strong>
            {r.floodMonths} / {r.dryMonths}
          </strong>
          <span>淹水 / 缺水（月）</span>
        </div>
      </div>

      <div className={styles.toggle} role="group" aria-label="水壩">
        <button type="button" aria-pressed={dam} onClick={() => setDam(true)}>
          有高壩
        </button>
        <button type="button" aria-pressed={!dam} onClick={() => setDam(false)}>
          沒有高壩
        </button>
      </div>

      {dam && (
        <label className={styles.slider}>
          <span>放水</span>
          <input
            type="range"
            min={4}
            max={10}
            step={0.5}
            value={release}
            onChange={(e) => setRelease(+e.target.value)}
            aria-label="每月放水量"
          />
          <output>{fmt(release)} / 月</output>
        </label>
      )}

      <div className={styles.actions}>
        {!explained && (
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
            setRelease(9);
            setDam(true);
            setExplained(false);
          }}
        >
          重來
        </button>
      </div>

      {explained && (
        <div className={styles.explain}>
          <p>
            沒有高壩時，尼羅河每年夏秋氾濫。洪水帶來肥沃的淤泥，但水太大會沖毀村莊，水太小又會鬧饑荒。
            1970 年完工的高壩後面是納瑟湖（Lake Nasser），能存下超過一整年的河水：豐水年存起來，乾旱年慢慢放。
            1980 年代非洲大乾旱時，埃及就是靠湖裡的存水撐過去。
          </p>
          <p>
            代價也很大：淤泥沉在湖底，下游農田改靠化學肥料，三角洲海岸也在後退；大片湖面每年蒸發大量的水；
            約十萬名努比亞人被迫搬遷，<Link to="/place/abu-simbel">阿布辛貝神殿</Link>等古蹟也得整座搬家。
          </p>
          <p>
            <span className={styles.tag}>遊戲假設</span> 單位已簡化；一般年流入共 87、湖容量 {CAPACITY}、每月蒸發湖水的{' '}
            {EVAPORATION * 100}%、高於 {FLOOD} 算淹水、低於 {DRY} 算缺水。數字只為說明調度的取捨，不是實際水文資料。
          </p>
        </div>
      )}
    </div>
  );
}
