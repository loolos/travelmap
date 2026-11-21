import { useState, type ReactNode } from 'react';
import { markActivityDone } from '../progress/store';
import lab from './Lab.module.css';

interface Stage {
  title: string;
  caption: string;
  water: number; // 0..1 how high the lake has risen
  people: 'home' | 'leaving' | 'gone';
  temple: 'there' | 'moving' | 'moved';
}

const stages: Stage[] = [
  {
    title: '1960 年以前',
    caption: '亞斯文以南的尼羅河谷是努比亞人的家鄉：河邊的椰棗林、彩繪的圓頂土屋，還有許多古神殿。',
    water: 0,
    people: 'home',
    temple: 'there',
  },
  {
    title: '高壩動工',
    caption: '1960 年高壩開工。聯合國教科文組織發起國際救援，把阿布辛貝、菲萊等神殿切塊搬到高處。',
    water: 0.25,
    people: 'home',
    temple: 'moving',
  },
  {
    title: '舉村遷移',
    caption: '1963–1964 年，埃及約 5 萬名努比亞人被遷到孔翁波附近的「新努比亞」村落；蘇丹那邊的居民也被遷走。',
    water: 0.6,
    people: 'leaving',
    temple: 'moved',
  },
  {
    title: '今天',
    caption: '納瑟湖淹沒了約 500 公里長的河谷。許多努比亞人仍盼望回到湖邊的故土，語言、音樂和建築是他們保存家鄉的方式。',
    water: 1,
    people: 'gone',
    temple: 'moved',
  },
];

const house = (x: number, y: number, k: number): ReactNode => (
  <g key={`${x}-${y}`}>
    <rect x={x} y={y} width={22} height={14} fill={k % 2 ? '#e8d3a8' : '#f1e6cf'} stroke="#b79b6a" />
    <path d={`M${x + 3} ${y} a8 6 0 0 1 16 0`} fill="#f4ebd9" stroke="#b79b6a" />
    <rect x={x + 8} y={y + 6} width={6} height={8} fill={k % 3 ? '#4f7fb0' : '#5aa08a'} />
  </g>
);

function Scene({ s }: { s: Stage }) {
  const top = 150 - s.water * 80; // water surface
  return (
    <svg className={lab.visual} style={{ maxHeight: 220, background: '#f6e2b8' }} viewBox="0 0 320 200" role="img" aria-label={`${s.title}：${s.caption}`}>
      {/* valley */}
      <path d="M0 40 L60 40 L100 150 L220 150 L260 40 L320 40 L320 200 L0 200 Z" fill="#d9b57c" />
      <path d="M100 150 L220 150 L210 170 L110 170 Z" fill="#7da35a" />
      {/* river / lake */}
      <path d={`M${100 - (150 - top) * 0.36} ${top} L${220 + (150 - top) * 0.36} ${top} L${s.water ? 220 : 180} 170 L${s.water ? 100 : 140} 170 Z`} fill="#4f95ad" opacity={0.92} />
      {/* villages */}
      {s.people === 'home' && [92, 118, 196, 222].map((x, i) => house(x, 130 - (i % 2) * 6, i))}
      {s.people === 'leaving' &&
        [
          [270, 30],
          [290, 30],
        ].map(([x, y]) => <path key={x} d={`M${x} ${y} l14 0 l0 10 l-14 0 z M${x + 14} ${y + 4} l6 0 l0 6 l-6 0`} fill="#c9a46a" stroke="#7a5a32" />)}
      {s.people === 'leaving' && <path d="M240 34 h24 m-6 -5 l6 5 l-6 5" stroke="#244c79" strokeWidth={2} fill="none" />}
      {/* temple */}
      {s.temple === 'there' && <rect x={64} y={96} width={18} height={22} fill="#c7a56c" stroke="#8a6a3a" />}
      {s.temple === 'moving' && <rect x={52} y={60} width={18} height={22} fill="#c7a56c" stroke="#8a6a3a" strokeDasharray="3 2" />}
      {s.temple === 'moved' && <rect x={30} y={18} width={18} height={22} fill="#c7a56c" stroke="#8a6a3a" />}
      {s.temple !== 'there' && <path d="M73 110 Q60 70 44 44" stroke="#8a6a3a" strokeDasharray="3 3" fill="none" />}
      {s.water === 1 && (
        <text x={160} y={top + 16} fontSize={12} textAnchor="middle" fill="#fff" fontWeight={700}>
          納瑟湖
        </text>
      )}
      <text x={10} y={194} fontSize={10} fill="#6e6656">
        河谷剖面示意
      </text>
    </svg>
  );
}

/** Nubia before and after Lake Nasser: drag through four stages. */
export function NubiaLab({ activityId }: { activityId: string }) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);
  const s = stages[i];
  const pick = (v: number) => {
    setI(v);
    if (v === stages.length - 1 && !done) {
      setDone(true);
      markActivityDone(activityId);
    }
  };
  return (
    <div className={lab.lab}>
      <p className={lab.question}>高壩擋住了洪水，也淹掉了誰的家？</p>
      <p className={lab.how}>拖動時間軸，看努比亞河谷怎麼變成湖。</p>
      <Scene s={s} />
      <p style={{ margin: 0 }}>
        <b>{s.title}</b>：{s.caption}
      </p>
      <label className={lab.slider}>
        <span>時間</span>
        <input type="range" min={0} max={stages.length - 1} value={i} onChange={(e) => pick(+e.target.value)} aria-label="時間軸" aria-valuetext={s.title} />
        <output>
          {i + 1}／{stages.length}
        </output>
      </label>
      {done && (
        <div className={lab.explain}>
          <p>
            在亞斯文的努比亞村落（例如西岸的村子），還看得到彩繪圓頂屋和努比亞語。那裡的居民，有些就是當年搬遷者的後代。
          </p>
          <p>
            <span className={lab.tag}>示意</span> 剖面只呈現先後順序；人數為大約數字。
          </p>
        </div>
      )}
    </div>
  );
}
