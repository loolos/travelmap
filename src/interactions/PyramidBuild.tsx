import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  heightFraction,
  RATES,
  simulate,
  stageLabel,
  SUPPORT_PER_LOGISTICS,
  TOTAL_BLOCKS,
  TOTAL_WORKERS,
  type Allocation,
  type Stage,
} from '../games/pyramid';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';

const START: Allocation = { quarry: 25, transport: 25, build: 25, logistics: 25 };
const keys: (keyof Allocation)[] = ['quarry', 'transport', 'build', 'logistics'];
const fmt = (n: number) => Math.round(n).toLocaleString('zh-TW');

export function PyramidBuild({ activityId }: { activityId: string }) {
  const [shares, setShares] = useState<Allocation>(START);
  const [year, setYear] = useState(10);
  const [explained, setExplained] = useState(false);
  const r = simulate(shares);
  const built = Math.min(1, (r.blocksPerYear * year) / TOTAL_BLOCKS);
  const h = heightFraction(built);
  const maxCap = Math.max(r.capacity.quarry, r.capacity.transport, r.capacity.build, 1);

  // Pyramid drawing: base 200 wide, 120 tall; built part from the bottom.
  const W = 320;
  const H = 170;
  const base = 150;
  const top = 30;
  const half = 100;
  const yCut = base - (base - top) * h;
  const halfCut = half * (1 - h);

  return (
    <div className={styles.lab}>
      <p className={styles.question}>沒有現代機械，要怎麼組織數百萬塊石材的工程？</p>
      <p className={styles.how}>把 {fmt(TOTAL_WORKERS)} 名工人分到四種工作，找出拖慢工程的環節。</p>

      <svg className={styles.visual} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`第 ${year} 年，完成約 ${Math.round(built * 100)}%`}>
        <polygon points={`${160 - half},${base} 160,${top} ${160 + half},${base}`} fill="none" stroke="#b08a58" strokeDasharray="4 3" />
        {h > 0 && (
          <polygon
            points={`${160 - half},${base} ${160 - halfCut},${yCut} ${160 + halfCut},${yCut} ${160 + half},${base}`}
            fill="#d4b07a"
            stroke="#9c7748"
          />
        )}
        <text x={12} y={22} fontSize={13} fill="#292720">
          第 {year} 年 · 完成 {Math.round(built * 100)}%
        </text>
      </svg>
      <div className={styles.result}>
        <div>
          <strong>{Number.isFinite(r.years) ? `${r.years.toFixed(1)} 年` : '蓋不完'}</strong>
          <span>預估完工</span>
        </div>
        <div>
          <strong className={styles.bottleneck}>{stageLabel[r.bottleneck]}</strong>
          <span>{r.bottleneck === 'logistics' ? '吃不飽，大家都變慢' : '最慢的環節'}</span>
        </div>
      </div>

      <label className={styles.slider}>
        <span>年數</span>
        <input type="range" min={1} max={40} value={year} onChange={(e) => setYear(+e.target.value)} />
        <output>{year} 年</output>
      </label>

      <div className={styles.sliders}>
        {keys.map((k) => (
          <label key={k} className={styles.slider}>
            <span className={r.bottleneck === k ? styles.bottleneck : undefined}>{stageLabel[k]}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={shares[k]}
              onChange={(e) => setShares((s) => ({ ...s, [k]: +e.target.value }))}
              aria-label={`${stageLabel[k]}人力`}
            />
            <output>{fmt(r.people[k])} 人</output>
          </label>
        ))}
      </div>

      <div className={styles.meters} aria-label="每年產能">
        {(['quarry', 'transport', 'build'] as Stage[]).map((k) => (
          <div key={k} className={`${styles.meter} ${r.bottleneck === k ? styles.slow : ''}`}>
            <span>{stageLabel[k]}</span>
            <div>
              <div style={{ width: `${(r.capacity[k] / maxCap) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

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
            setShares(START);
            setYear(10);
            setExplained(false);
          }}
        >
          重來
        </button>
      </div>

      {explained && (
        <div className={styles.explain}>
          <p>
            工程速度由最慢的環節決定：採石再快，運不過去也沒用。還要留人做麵包、釀啤酒、修工具，否則所有人都會慢下來。
            平均分配時大約 20 年完工，和古希臘歷史學家希羅多德（Herodotus）記載的年數相近。
          </p>
          <p>
            考古發現吉薩旁有工人村與工人墓地，紙莎草紙《梅雷爾日誌》（Diary of Merer）也記錄了船隊運送石灰岩的日常。
            一般認為建造者是有組織、有配給的工人，而不是奴隸。花崗岩則從南方的<Link to="/place/aswan">亞斯文</Link>運來。
          </p>
          <p>
            <span className={styles.tag}>遊戲假設</span> 每人每年採石 {RATES.quarry} 塊、運輸 {RATES.transport} 塊、砌築{' '}
            {RATES.build} 塊；1 名後勤可支援 {SUPPORT_PER_LOGISTICS} 人；總數約 230 萬塊。這些數字只為了說明瓶頸，不是考古估計。坡道怎麼蓋至今仍有爭論，這裡不採用任何一種方案。
          </p>
        </div>
      )}
    </div>
  );
}
