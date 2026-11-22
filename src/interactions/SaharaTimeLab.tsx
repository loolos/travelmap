import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { STAGES, hasLakes, nileShare, type Stage } from '../games/sahara';
import lab from './Lab.module.css';

const mix = (a: string, b: string, t: number) => {
  const pa = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return '#' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

const when = (y: number) => (y === 0 ? '今天' : `${y.toLocaleString('en-US')} 年前`);

function Scene({ stage }: { stage: Stage }) {
  const g = stage.green;
  const ground = mix('e8c887', '93b862', g);
  const sky = mix('f6e7c6', 'cfe6f0', g);
  const trees = Math.round(g * 7);
  const share = nileShare(g);
  const outside = stage.people === 'none' ? 0 : Math.round((1 - share) * 6);
  const inside = stage.people === 'none' ? 0 : Math.max(1, Math.round(share * 8));
  const animal = stage.people === 'hunters' ? '🦒' : stage.people === 'herders' ? '🐄' : stage.id === 'today' ? '🐪' : '';
  return (
    <svg className={lab.visual} style={{ maxHeight: 210, background: sky }} viewBox="0 0 320 180" role="img" aria-label={`${when(stage.yearsAgo)}：${stage.name}`}>
      {/* Sahara (west) */}
      <rect x={0} y={95} width={250} height={85} fill={ground} />
      {g < 0.4 && (
        <path d="M0 110 Q40 88 80 108 T160 104 T250 110 V120 H0 Z" fill={mix('e0b571', ground.slice(1), g)} opacity={0.9} />
      )}
      {hasLakes(g) && <ellipse cx={95} cy={135} rx={20 + g * 30} ry={8 + g * 6} fill="#5fa3c0" />}
      {!hasLakes(g) && g > 0.2 && <ellipse cx={95} cy={135} rx={14} ry={4} fill="#8fb4bf" opacity={0.7} />}
      {Array.from({ length: trees }, (_, i) => {
        const x = 20 + ((i * 67) % 210);
        const y = 112 + ((i * 29) % 50);
        return (
          <g key={i}>
            <rect x={x - 1} y={y - 10} width={2} height={10} fill="#6b4f30" />
            <ellipse cx={x} cy={y - 12} rx={9} ry={4} fill="#5d8a3a" />
          </g>
        );
      })}
      {animal && (
        <text x={175} y={128} fontSize={20}>
          {animal}
        </text>
      )}
      {Array.from({ length: outside }, (_, i) => (
        <circle key={i} cx={80 + i * 26} cy={166} r={3.5} fill="#7a3b2a" />
      ))}
      {/* oasis today */}
      {stage.id === 'today' && (
        <text x={40} y={150} fontSize={16}>
          🌴
        </text>
      )}
      {/* Nile valley (east) */}
      <rect x={250} y={95} width={70} height={85} fill="#7da35a" />
      <path d="M278 95 Q290 135 280 180 H296 Q306 135 292 95 Z" fill="#4f95ad" />
      {Array.from({ length: inside }, (_, i) => (
        <circle key={i} cx={258 + (i % 2) * 50} cy={105 + Math.floor(i / 2) * 18} r={3.5} fill="#7a3b2a" />
      ))}
      <text x={8} y={20} fontSize={13} fontWeight={700} fill="#292720">
        {when(stage.yearsAgo)}・{stage.name}
      </text>
      <text x={8} y={88} fontSize={10} fill="#6e6656">
        撒哈拉
      </text>
      <text x={312} y={88} fontSize={10} fill="#6e6656" textAnchor="end">
        尼羅河谷
      </text>
      <text x={8} y={176} fontSize={9} fill="#4b4436">
        示意・圓點＝人群
      </text>
    </svg>
  );
}

/** Slide through 20,000 years of the Sahara: dry, green, dry again, and people moving to the Nile. */
export function SaharaTimeLab({ activityId }: { activityId: string }) {
  const [i, setI] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [done, setDone] = useState(false);

  const pick = (n: number) => {
    setI(n);
    const next = new Set(seen).add(n);
    setSeen(next);
    if (!done && next.size === STAGES.length) {
      setDone(true);
      markActivityDone(activityId);
    }
  };

  const s = STAGES[i];
  return (
    <div className={lab.lab}>
      <p className={lab.question}>撒哈拉怎麼從草原變成沙漠？</p>
      <p className={lab.how}>拖動時間，看雨、湖、動物和人去了哪裡。</p>
      <Scene stage={s} />
      <p style={{ margin: 0 }}>{s.text}</p>
      <label className={lab.slider}>
        <span>時間</span>
        <input
          type="range"
          min={0}
          max={STAGES.length - 1}
          value={i}
          onChange={(e) => pick(+e.target.value)}
          aria-label="時間"
          aria-valuetext={when(s.yearsAgo)}
        />
        <output>{when(s.yearsAgo)}</output>
      </label>
      <p className={lab.status} aria-live="polite">
        看過 {seen.size} / {STAGES.length} 個時期
      </p>
      {done && (
        <div className={lab.explain}>
          <p>
            為什麼會變？地球自轉軸像陀螺一樣慢慢晃，約兩萬多年一輪，北非夏天的日照跟著變強變弱，季風雨帶就在南北之間來回。撒哈拉幾百萬年來已經綠了又乾上百次。
          </p>
          <p>沙漠擠出來的人群，聚到尼羅河邊，成了古埃及文明的起點。</p>
          <p>
            <span className={lab.tag}>示意</span> 年代為大略數字，各地變乾的時間前後差了上千年。
          </p>
        </div>
      )}
    </div>
  );
}
