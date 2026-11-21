import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const LINEN = '#cdb68c';
const LINEN_D = '#a88f62';

/** A museum case of crocodile mummies, drawn as a schematic. */
export const crocMuseum: HotspotSet = {
  question: '為什麼要把鱷魚做成木乃伊？',
  how: '點展櫃裡的數字，一件件看。',
  width: 320,
  height: 220,
  draw: (
    <>
      <rect width={320} height={220} fill="#1f2430" />
      <rect x={10} y={14} width={300} height={170} rx={6} fill="#2b3142" stroke="#59627a" />
      <rect x={10} y={184} width={300} height={22} fill="#3a4157" />
      {/* big wrapped croc */}
      <path d="M30 120 Q60 100 120 104 L230 108 Q262 110 290 120 Q262 128 230 130 L120 134 Q60 138 30 120 Z" fill={LINEN} stroke={LINEN_D} />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${60 + i * 18} 104 l-6 30`} stroke={LINEN_D} strokeWidth={1.5} />
      ))}
      {/* small crocs */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${40 + i * 50} 166 q20 -8 40 0 q-20 8 -40 0 z`} fill={LINEN} stroke={LINEN_D} />
      ))}
      {/* eggs */}
      {[0, 1, 2, 3].map((i) => (
        <ellipse key={i} cx={210 + i * 16} cy={166} rx={6} ry={8} fill="#e8e0cc" stroke="#b8ab8c" />
      ))}
      {/* coffin */}
      <rect x={196} y={40} width={92} height={40} rx={4} fill="#8a5a32" stroke="#5e3b1f" />
      <path d="M200 60 h84" stroke="#c9a46a" strokeDasharray="4 3" />
      {/* Sobek statue */}
      <path d="M40 30 L52 30 L54 46 L64 50 L56 54 L56 92 L36 92 L38 54 L30 50 L40 46 Z" fill="#9c8a6a" />
      <circle cx={47} cy={24} r={6} fill="#c9a24a" />
      <text x={16} y={200} fontSize={10} fill="#c9cfdd">
        展櫃示意
      </text>
    </>
  ),
  spots: [
    {
      x: 160,
      y: 96,
      title: '大鱷魚木乃伊',
      body: '整隻用亞麻布一圈圈包起來，有的長達好幾公尺。牠們多半來自附近的動物墓地。',
    },
    {
      x: 90,
      y: 150,
      title: '小鱷魚',
      body: '也有剛孵化的小鱷魚做成的木乃伊。動物木乃伊常是信徒買來獻給神的供品，所以需求量很大。',
    },
    {
      x: 234,
      y: 150,
      title: '鱷魚蛋',
      body: '連蛋都被做成木乃伊下葬，可見整個鱷魚的生命都被看作神聖的。',
    },
    {
      x: 242,
      y: 30,
      title: '木棺',
      body: '有些鱷魚躺在專門做的木棺裡。也有學者用 X 光發現，部分「木乃伊」裡只有幾塊骨頭或蘆葦，是偷工減料的供品。',
    },
    {
      x: 70,
      y: 40,
      title: '索貝克',
      en: 'Sobek',
      body: '鱷魚頭的神，掌管尼羅河的水與豐收。孔翁波神殿南半邊就是獻給祂的。',
    },
    {
      x: 160,
      y: 196,
      title: '神殿裡的聖鱷',
      body: '古希臘作家希羅多德記載，有些神殿養著馴服的鱷魚，還替牠戴上耳環和手鐲，死後做成木乃伊。',
    },
  ],
  wrap: (
    <>
      <p>
        尼羅鱷又可怕又有力量。古埃及人敬畏牠，希望透過供奉索貝克換來平安和豐收，於是大量製作鱷魚木乃伊。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 展櫃插畫只是示意，實際展品與擺放以現場為準。博物館內多半禁止閃光燈。
      </p>
    </>
  ),
};
