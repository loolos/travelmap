import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import lab from './Lab.module.css';
import styles from './Hotspot.module.css';

type Part = 'nose' | 'beard' | 'paint' | 'uraeus';

interface Clue {
  part?: Part;
  title: string;
  seen: string;
  infer: string;
}

const clues: Clue[] = [
  {
    part: 'nose',
    title: '鼻子',
    seen: '鼻子的位置留著鑿子的痕跡；拿破崙來埃及以前的畫裡，鼻子就已經不見了。',
    infer: '鼻子是被人刻意鑿掉的，不是法軍砲轟。15 世紀的史家記載，1378 年有人破壞了石像的臉。',
  },
  {
    part: 'uraeus',
    title: '額頭',
    seen: '額頭中央有一塊斷掉的突起。',
    infer: '原本有一條立起的眼鏡蛇，這是國王的象徵，和黃金面具額頭上的一樣。',
  },
  {
    part: 'beard',
    title: '胸前的碎片',
    seen: '像的胸前挖出過編辮狀的石頭碎片，現在分藏在大英博物館和開羅。',
    infer: '下巴原本掛著神的假鬍子。不少學者認為鬍子是後來的新王國時期才加上的。',
  },
  {
    part: 'paint',
    title: '紅色顏料',
    seen: '臉上和耳朵附近還殘留一點紅色顏料。',
    infer: '整座像原本有塗色。臉可能是紅褐色、頭巾有條紋；確切配色是推測。',
  },
  {
    title: '前爪間的石碑',
    seen: '石碑上說，一位王子在像旁睡著，夢見人面獅身請他清除埋住自己的沙子。',
    infer: '沙漠一次次把像埋到肩膀。約前 14 世紀，圖特摩斯四世（Thutmose IV）清沙並立了這塊「夢碑」。',
  },
  {
    title: '是誰的臉？',
    seen: '臉的五官和卡夫拉（Khafre）的雕像相像，位置又緊貼卡夫拉金字塔的通道。',
    infer: '多數學者認為是卡夫拉，但也有人主張是他的父親胡夫（Khufu），至今沒有定論。',
  },
];

const BODY = '#d9bf8c';
const BODY_D = '#b89b63';

function Sphinx({ on, restored }: { on: Set<Part>; restored: boolean }) {
  const show = (p: Part) => restored || on.has(p);
  const paint = show('paint');
  return (
    <svg className={lab.visual} style={{ maxHeight: 220, background: '#f6e2b8' }} viewBox="0 0 320 180" role="img" aria-label={restored ? '人面獅身原貌示意' : '人面獅身側面，依線索逐步復原'}>
      <rect y={150} width={320} height={30} fill="#e3c48d" />
      {/* body */}
      <path d="M86 150 L86 104 Q120 92 200 96 Q260 98 284 118 Q298 130 296 150 Z" fill={paint ? '#b4583a' : BODY} stroke={BODY_D} />
      {!paint &&
        [108, 118, 128, 138].map((y) => <path key={y} d={`M${96} ${y} Q190 ${y - 6} 288 ${y + 4}`} stroke={BODY_D} strokeWidth={1.5} fill="none" opacity={0.7} />)}
      {/* paws */}
      <path d="M20 150 L20 140 Q22 134 30 134 L96 134 L96 150 Z" fill={paint ? '#b4583a' : BODY} stroke={BODY_D} />
      {/* tail */}
      <path d="M292 146 Q306 140 300 128" stroke={BODY_D} strokeWidth={4} fill="none" />
      {/* nemes */}
      <path d="M78 38 Q100 24 122 40 L128 104 L92 110 L80 92 Z" fill={paint ? '#e8c34a' : BODY} stroke={BODY_D} />
      {paint && [50, 62, 74, 86, 98].map((y) => <path key={y} d={`M${96} ${y} L${126} ${y - 2}`} stroke="#3b5c9a" strokeWidth={5} />)}
      {/* face */}
      <path d="M78 40 L70 46 L68 62 L66 70 L68 82 L74 92 L92 96 L96 50 Z" fill={paint ? '#a5482e' : BODY} stroke={BODY_D} />
      {show('nose') ? <path d="M68 60 L58 72 L66 74" fill={paint ? '#a5482e' : BODY} stroke={BODY_D} /> : <path d="M68 62 L64 70" stroke="#8a7348" strokeWidth={2} />}
      <path d="M72 58 q5 -3 10 0" stroke="#3a2b1d" strokeWidth={2} fill="none" />
      {show('uraeus') && <path d="M76 40 Q70 30 76 24 Q82 28 80 40 Z" fill={paint ? '#e8c34a' : BODY_D} stroke="#7a5f30" />}
      {show('beard') && <path d="M74 92 L72 128 Q78 132 84 128 L84 94 Z" fill={paint ? '#3b5c9a' : BODY_D} stroke="#7a5f30" />}
      {/* stele / sand */}
      <rect x={40} y={110} width={20} height={26} fill="#c9b07e" stroke="#8a7348" />
      <text x={8} y={174} fontSize={10} fill="#6e6656">
        {restored ? '原貌示意' : '側面示意'}
      </text>
    </svg>
  );
}

/** Great Sphinx: read each clue, reveal the inference, and watch the reconstruction build up. */
export function SphinxEvidence({ activityId }: { activityId: string }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [restored, setRestored] = useState(false);
  const parts = new Set(clues.filter((_, i) => open.has(i)).flatMap((c) => (c.part ? [c.part] : [])));
  const all = open.size === clues.length;
  const flip = (i: number) => {
    if (open.has(i)) return;
    const next = new Set(open).add(i);
    setOpen(next);
    if (next.size === clues.length) markActivityDone(activityId);
  };
  return (
    <div className={lab.lab}>
      <p className={lab.question}>人面獅身像原本是什麼顏色、什麼樣子？</p>
      <p className={lab.how}>點每張線索卡，看推理怎麼把原貌一步步補回來。</p>
      <Sphinx on={parts} restored={restored} />
      {all && (
        <div className={lab.toggle} role="group" aria-label="對照">
          <button type="button" aria-pressed={!restored} onClick={() => setRestored(false)}>
            推理結果
          </button>
          <button type="button" aria-pressed={restored} onClick={() => setRestored(true)}>
            原貌示意
          </button>
        </div>
      )}
      <div className={styles.cards}>
        {clues.map((c, i) => {
          const isOpen = open.has(i);
          return (
            <button key={i} type="button" className={styles.evidence} aria-expanded={isOpen} onClick={() => flip(i)}>
              <span>
                <b>線索 {i + 1}</b>{'　'}{c.title}
              </span>
              <span>{c.seen}</span>
              {isOpen ? <span>👉 {c.infer}</span> : <b>點一下看推論</b>}
            </button>
          );
        })}
      </div>
      {all && (
        <div className={lab.explain}>
          <p>考古推理就是這樣：先看現場留下的痕跡，再找文獻和其他雕像比對。到現場試著找鼻子缺口、額頭斷痕和前爪間的夢碑。</p>
          <p>
            <span className={lab.tag}>示意</span> 復原圖的鬍子、配色和比例都是推測，學界看法不一。
          </p>
        </div>
      )}
    </div>
  );
}
