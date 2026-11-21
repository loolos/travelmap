import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const ALAB = '#efe8da';
const LINE = '#9c8f78';
const LEAD = '#8a94a0';
const G = 225; // ground line

const minaret = (x: number) => (
  <g key={x}>
    <rect x={x - 3} y={34} width={6} height={G - 34} fill={ALAB} stroke={LINE} strokeWidth={1} />
    <rect x={x - 5} y={120} width={10} height={3} fill={LINE} />
    <rect x={x - 5} y={80} width={10} height={3} fill={LINE} />
    <path d={`M${x - 3} 34 L${x} 14 L${x + 3} 34 Z`} fill={LEAD} />
  </g>
);

/** Muhammad Ali Mosque, simplified cross-section (roughly to scale: 2.5 px per metre). */
export const mosque: HotspotSet = {
  question: '這麼大的穹頂，靠什麼撐住？',
  how: '點數字，從大穹頂一路看到宣禮塔。',
  width: 320,
  height: 240,
  draw: (
    <>
      <rect width={320} height={240} fill="#dfeaf0" />
      <rect y={G} width={320} height={15} fill="#cdb990" />
      {minaret(56)}
      {minaret(264)}
      {/* hall */}
      <rect x={76} y={165} width={168} height={G - 165} fill={ALAB} stroke={LINE} />
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={90 + i * 26} y={185} width={8} height={18} rx={4} fill="#c6d3da" />
      ))}
      {/* corner domes */}
      {[96, 224].map((x) => (
        <path key={x} d={`M${x - 12} 165 A12 12 0 0 1 ${x + 12} 165 Z`} fill={LEAD} />
      ))}
      {/* half domes */}
      <path d="M134 150 L108 150 L108 165 L134 165 Z" fill={ALAB} stroke={LINE} />
      <path d="M186 150 L212 150 L212 165 L186 165 Z" fill={ALAB} stroke={LINE} />
      <path d="M108 150 A26 26 0 0 1 134 124 L134 150 Z" fill={LEAD} />
      <path d="M212 150 A26 26 0 0 0 186 124 L186 150 Z" fill={LEAD} />
      {/* drum with windows */}
      <rect x={134} y={121} width={52} height={44} fill={ALAB} stroke={LINE} />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={139 + i * 9.5} y={127} width={4} height={9} rx={2} fill="#c6d3da" />
      ))}
      {/* pendentive hint */}
      <path d="M134 165 Q138 146 150 141" stroke={LINE} fill="none" />
      <path d="M186 165 Q182 146 170 141" stroke={LINE} fill="none" />
      {/* main dome */}
      <path d="M134 121 A26 26 0 0 1 186 121 Z" fill={LEAD} />
      <rect x={158} y={88} width={4} height={8} fill={LEAD} />
      <text x={6} y={236} fontSize={10} fill="#6e6656">
        剖面示意
      </text>
    </>
  ),
  spots: [
    {
      x: 160,
      y: 108,
      title: '中央大穹頂',
      body: '直徑約 21 公尺、離地約 52 公尺。站在正下方抬頭，看穹頂底部那圈窗戶如何讓光灑進來。',
    },
    {
      x: 116,
      y: 140,
      title: '半穹頂',
      body: '大穹頂四周各靠著一個半穹頂，像扶手一樣把重量往外、往下分散，也讓大廳中間不用立柱子。',
    },
    {
      x: 150,
      y: 152,
      title: '帆拱',
      en: 'Pendentive',
      body: '方形的大廳上面要放圓形的穹頂，四個角就用彎曲的三角形石面過渡。找找四個角落上方的弧面。',
    },
    {
      x: 224,
      y: 158,
      title: '角落小穹頂',
      body: '四個角再加小穹頂，一層層往上堆疊，從外面看像穹頂組成的小山。',
    },
    {
      x: 264,
      y: 60,
      title: '鉛筆形宣禮塔',
      body: '細長、尖頂，高約 82 公尺，是鄂圖曼（今土耳其）的樣式。開羅老城區的宣禮塔多半粗而分層，可以比比看。',
    },
    {
      x: 230,
      y: 205,
      title: '雪花石膏外牆',
      en: 'Alabaster',
      body: '牆面貼著淺色雪花石膏，所以又叫「雪花石膏清真寺」。建於 1830–1848 年，穆罕默德·阿里也葬在裡面。',
    },
  ],
  wrap: (
    <>
      <p>
        這是鄂圖曼清真寺的做法：<b>一個大穹頂、四周半穹頂分擔重量</b>。穆罕默德·阿里刻意選這個樣式，蓋在城堡最高處，整個開羅都看得到。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 剖面依大略比例簡化，只畫出兩側的半穹頂。進入請脫鞋、衣著遮住肩膀和膝蓋。
      </p>
    </>
  ),
};
