import { Link } from 'react-router-dom';
import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const SKIN = '#b5653a';
const WHITE = '#f3ecdc';
const GOLD = '#d4a73c';
const DARK = '#2b2418';
const GREEN = '#4f8a4a';

/** A simple figure: body, head, optional headgear drawn by the caller. */
function Figure({ x, skin = SKIN, cloth = WHITE }: { x: number; skin?: string; cloth?: string }) {
  return (
    <g>
      <rect x={x - 7} y={92} width={14} height={34} rx={3} fill={cloth} stroke={DARK} strokeWidth={0.8} />
      <rect x={x - 4} y={76} width={8} height={18} fill={skin} />
      <rect x={x - 6} y={126} width={4} height={20} fill={skin} />
      <rect x={x + 2} y={126} width={4} height={20} fill={skin} />
    </g>
  );
}

/** The weighing of the heart, after the Papyrus of Hunefer (simplified). */
export const weighingHeart: HotspotSet = {
  question: '死後要通過什麼考試，才能進入來世？',
  how: '這是《亡靈書》裡常見的審判場面，從左往右看。點數字看每個角色。',
  width: 340,
  height: 180,
  draw: (
    <>
      <rect width={340} height={180} fill="#efe2bf" />
      <rect y={150} width={340} height={30} fill="#d9c08a" />
      {/* 42 judges row */}
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}>
          <rect x={14 + i * 22} y={10} width={10} height={14} fill={GREEN} opacity={0.7} />
          <circle cx={19 + i * 22} cy={8} r={3} fill={DARK} opacity={0.7} />
        </g>
      ))}
      <line x1={0} x2={340} y1={30} y2={30} stroke={DARK} />
      {/* deceased (Hunefer) */}
      <Figure x={22} />
      <circle cx={22} cy={70} r={7} fill="#1d1d1d" />
      {/* Anubis leading */}
      <Figure x={48} />
      <path d="M42,68 L48,58 L54,68 L58,72 L48,76 Z" fill="#111" />
      <path d="M44,60 L45,50 M51,60 L52,50" stroke="#111" strokeWidth={2} />
      {/* scale */}
      <rect x={100} y={60} width={4} height={90} fill={GOLD} />
      <rect x={76} y={60} width={52} height={3} fill={GOLD} />
      <path d="M76,63 L72,88 L84,88 Z M128,63 L124,88 L136,88 Z" fill="none" stroke={GOLD} />
      <ellipse cx={78} cy={86} rx={8} ry={3} fill={GOLD} />
      <ellipse cx={130} cy={86} rx={8} ry={3} fill={GOLD} />
      <path d="M74,80 Q78,72 82,80 Q78,86 74,80 Z" fill="#9c2f2a" />
      <path d="M130,84 Q126,74 132,68 Q134,76 130,84" fill={WHITE} stroke={DARK} strokeWidth={0.6} />
      {/* Anubis at the scale */}
      <Figure x={102} />
      <path d="M96,68 L102,58 L108,68 L112,72 L102,76 Z" fill="#111" />
      {/* Ammit */}
      <g>
        <ellipse cx={150} cy={130} rx={16} ry={10} fill="#a8885a" />
        <path d="M138,122 Q134,108 146,110 L150,118 Z" fill={GREEN} />
        <rect x={140} y={136} width={4} height={14} fill="#a8885a" />
        <rect x={158} y={136} width={4} height={14} fill="#a8885a" />
      </g>
      {/* Thoth */}
      <Figure x={178} skin="#2f2f2f" />
      <path d="M174,70 Q178,62 184,68 Q192,70 196,76 Q186,72 180,74 Z" fill="#2f2f2f" />
      <rect x={186} y={98} width={10} height={4} fill={WHITE} stroke={DARK} strokeWidth={0.5} />
      {/* Horus leading */}
      <Figure x={222} />
      <path d="M216,70 Q222,60 228,68 L232,72 L222,76 Z" fill="#3a5a3a" />
      {/* Osiris enthroned with Isis and Nephthys */}
      <rect x={256} y={110} width={26} height={40} fill={GOLD} stroke={DARK} />
      <rect x={262} y={78} width={14} height={34} rx={5} fill={WHITE} stroke={DARK} strokeWidth={0.8} />
      <rect x={265} y={66} width={8} height={14} fill={GREEN} />
      <path d="M264,66 L269,46 L274,66 Z" fill={WHITE} stroke={DARK} strokeWidth={0.6} />
      <Figure x={300} cloth="#c9a24a" />
      <Figure x={322} cloth="#c9a24a" />
      <circle cx={300} cy={70} r={6} fill="#1d1d1d" />
      <circle cx={322} cy={70} r={6} fill="#1d1d1d" />
    </>
  ),
  spots: [
    {
      x: 22,
      y: 50,
      title: '亡者',
      body: '畫中的主角就是這卷莎草紙的主人。他穿著白衣，被帶進審判大廳。',
    },
    {
      x: 48,
      y: 160,
      title: '阿努比斯帶路',
      body: '胡狼頭的阿努比斯是守護墓地和木乃伊的神，牽著亡者的手走向天平。',
    },
    {
      x: 104,
      y: 44,
      title: '天平：心臟對羽毛',
      body: '左盤放亡者的心臟，右盤是真理女神瑪特的羽毛。古埃及人認為一生的善惡都記在心臟裡，心臟要和羽毛一樣輕才算通過。',
    },
    {
      x: 200,
      y: 20,
      title: '42 位審判官',
      body: '亡者要對 42 位審判官一一說「我沒有偷竊」「我沒有說謊」等等，這叫做「否定告白」。',
    },
    {
      x: 150,
      y: 104,
      title: '吞噬者阿米特',
      en: 'Ammit',
      body: '鱷魚頭、獅子上身、河馬下身的怪物，坐在天平旁邊等。心臟太重的話，就會被牠吃掉，永遠不能進入來世。',
    },
    {
      x: 196,
      y: 110,
      title: '托特記錄',
      body: '鷺鳥頭的智慧之神托特拿著筆和調色板，把秤的結果寫下來。',
    },
    {
      x: 222,
      y: 160,
      title: '荷魯斯引見',
      body: '通過了！鷹頭的荷魯斯牽著亡者，帶他去見冥界之王。',
    },
    {
      x: 269,
      y: 160,
      title: '歐西里斯與兩位女神',
      body: '綠色皮膚的歐西里斯坐在王座上，後面站著伊西斯和她的妹妹奈芙蒂斯。見過他之後，亡者就能進入來世的「蘆葦之野」。',
    },
  ],
  wrap: (
    <>
      <p>
        《亡靈書》其實是一卷卷咒語集，放在墓裡幫亡者通過來世的關卡。這一幕最有名的是大英博物館收藏的《亨尼弗莎草紙》，約西元前 1300 年。
        這也是做<Link to="/place/valley-of-the-kings/mummy-order">木乃伊</Link>時要把心臟留在身體裡的原因。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 插畫簡化了人物；到帝王谷的墓室壁畫、或博物館的莎草紙，都可以找找這一幕。
      </p>
    </>
  ),
};
