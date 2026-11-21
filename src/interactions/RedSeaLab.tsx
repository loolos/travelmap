import { useState, type ReactNode } from 'react';
import { IdentifyQuiz } from './IdentifyQuiz';
import { reefId } from './sets/quizzes';
import lab from './Lab.module.css';

const LAND = '#c99a62';
const LAND_D = '#a97c4a';
const WATER = '#3f8fae';
const MAGMA = '#d2573a';

interface Stage {
  title: string;
  caption: string;
  gap: number;
  drop: number;
  water: boolean;
}

const stages: Stage[] = [
  { title: '連在一起', caption: '很久以前，阿拉伯半島和非洲是同一塊大陸。', gap: 0, drop: 0, water: false },
  { title: '開始拉開', caption: '約 3000 萬年前，地底的熱把地殼往兩邊拉，中間塌陷成長長的裂谷。', gap: 30, drop: 26, water: false },
  { title: '海水灌入', caption: '裂谷越來越深，海水灌了進來，形成狹長的海。', gap: 70, drop: 46, water: true },
  {
    title: '今天的紅海',
    caption: '兩邊每年仍分開約 1 公分多。中央最深約 3000 公尺，淺淺的海岸邊長出珊瑚礁。',
    gap: 110,
    drop: 60,
    water: true,
  },
];

function Section({ s }: { s: Stage }): ReactNode {
  const mid = 160;
  const l = mid - s.gap / 2;
  const r = mid + s.gap / 2;
  const top = 80;
  const floor = top + s.drop;
  return (
    <>
      <rect width={320} height={200} fill="#e8f1f4" />
      {/* mantle */}
      <rect y={150} width={320} height={50} fill="#e9a07a" />
      {s.gap > 0 && <path d={`M${mid - 14} 200 Q${mid} 150 ${mid + 14} 200 Z`} fill={MAGMA} />}
      {/* water */}
      {s.water && <rect x={l - 6} y={top + 6} width={s.gap + 12} height={floor - top} fill={WATER} />}
      {/* plates */}
      <path d={`M0 ${top} L${l} ${top} L${l + 12} 150 L0 150 Z`} fill={LAND} stroke={LAND_D} />
      <path d={`M320 ${top} L${r} ${top} L${r - 12} 150 L320 150 Z`} fill={LAND} stroke={LAND_D} />
      {s.gap > 0 && <rect x={l + 10} y={floor} width={Math.max(0, s.gap - 20)} height={150 - floor} fill={LAND_D} />}
      {s.gap > 0 && (
        <>
          <path d={`M${l - 40} 44 h-40 m8 -6 l-8 6 l8 6`} stroke="#244c79" strokeWidth={3} fill="none" />
          <path d={`M${r + 40} 44 h40 m-8 -6 l8 6 l-8 6`} stroke="#244c79" strokeWidth={3} fill="none" />
        </>
      )}
      {s.title === '今天的紅海' &&
        [l + 4, r - 10].map((x) => <path key={x} d={`M${x} ${top + 6} q3 -8 6 0 q3 -8 6 0`} fill="#e8846b" />)}
      <text x={40} y={top - 8} fontSize={12} fill="#5a4a33" fontWeight={700}>
        非洲
      </text>
      <text x={280} y={top - 8} fontSize={12} fill="#5a4a33" fontWeight={700} textAnchor="end">
        阿拉伯
      </text>
    </>
  );
}

function Rift() {
  const [i, setI] = useState(0);
  const s = stages[i];
  return (
    <div className={lab.lab}>
      <p className={lab.how}>拖動時間軸，看紅海怎麼裂開。</p>
      <svg className={lab.visual} style={{ maxHeight: 220 }} viewBox="0 0 320 200" role="img" aria-label={`${s.title}：${s.caption}`}>
        <Section s={s} />
        <text x={10} y={20} fontSize={13} fontWeight={700} fill="#292720">
          {i + 1}. {s.title}
        </text>
        <text x={10} y={194} fontSize={10} fill="#6e6656">
          剖面示意・非比例
        </text>
      </svg>
      <p style={{ margin: 0 }}>{s.caption}</p>
      <label className={lab.slider}>
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
      {i === stages.length - 1 && (
        <div className={lab.explain}>
          <p>
            紅海是一片「正在誕生的海洋」。北端分成兩叉：西邊的蘇伊士灣、東邊的亞喀巴灣。虎加達就在非洲這一側、靠近蘇伊士灣口。
          </p>
          <p>
            <span className={lab.tag}>示意</span> 剖面只呈現先後順序，年代與深度為大約數字。
          </p>
        </div>
      )}
    </div>
  );
}

/** Red Sea: rift section + reef ID, behind a two-way toggle. */
export function RedSeaLab({ activityId }: { activityId: string }) {
  const [mode, setMode] = useState<'rift' | 'reef'>('rift');
  return (
    <div className={lab.lab}>
      <p className={lab.question}>紅海為什麼又深又窄，還有這麼多珊瑚？</p>
      <div className={lab.toggle} role="group" aria-label="切換">
        <button type="button" aria-pressed={mode === 'rift'} onClick={() => setMode('rift')}>
          海怎麼裂開
        </button>
        <button type="button" aria-pressed={mode === 'reef'} onClick={() => setMode('reef')}>
          珊瑚礁辨識
        </button>
      </div>
      {mode === 'rift' ? <Rift /> : <IdentifyQuiz activityId={activityId} set={reefId} bare />}
    </div>
  );
}
