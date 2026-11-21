import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

/** Bahariya Oasis: a cutaway of the depression and the sandstone aquifer under it. */
export const bahariyaWater: HotspotSet = {
  question: '沙漠中間，水從哪裡來？',
  how: '點剖面圖上的數字，從天上一路看到地底。',
  width: 320,
  height: 220,
  draw: (
    <>
      <rect width={320} height={220} fill="#f4e4bf" />
      {/* plateau and depression surface */}
      <path d="M0 50 L80 50 L110 96 L210 96 L240 50 L320 50 L320 220 L0 220 Z" fill="#d9b57c" />
      {/* cap rock */}
      <path d="M0 50 L80 50 L88 62 L0 62 Z M320 50 L240 50 L232 62 L320 62 Z" fill="#b89260" />
      {/* clay layer */}
      <path d="M0 118 L320 118 L320 132 L0 132 Z" fill="#8d7a63" />
      {/* aquifer */}
      <rect x={0} y={132} width={320} height={58} fill="#9fc5cf" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={(i * 37) % 320} cy={138 + ((i * 13) % 48)} r={2} fill="#c9a86e" />
      ))}
      <rect x={0} y={190} width={320} height={30} fill="#6e5a46" />
      {/* water table line under depression */}
      <path d="M0 128 L320 128" stroke="#3f8fae" strokeDasharray="5 4" strokeWidth={2} />
      {/* well and spring */}
      <rect x={138} y={96} width={6} height={44} fill="#3f8fae" />
      <path d="M141 96 q-8 -14 0 -22 q8 8 0 22" fill="#3f8fae" />
      <path d="M180 96 q4 -6 8 0" stroke="#3f8fae" strokeWidth={3} fill="none" />
      {/* palms */}
      {[120, 160, 196].map((x) => (
        <g key={x}>
          <rect x={x} y={78} width={3} height={18} fill="#7a5a32" />
          <path d={`M${x + 1} 78 q-10 -2 -14 4 M${x + 1} 78 q10 -2 14 4 M${x + 1} 78 q-4 -8 -10 -10 M${x + 1} 78 q4 -8 10 -10`} stroke="#5f8a3c" strokeWidth={3} fill="none" />
        </g>
      ))}
      {/* rain long ago */}
      {[230, 250, 270, 290].map((x) => (
        <path key={x} d={`M${x} 14 l-4 12`} stroke="#6a8fb0" strokeWidth={2} />
      ))}
      <text x={6} y={214} fontSize={10} fill="#f4ebd9">
        剖面示意・非比例
      </text>
    </>
  ),
  spots: [
    {
      x: 260,
      y: 30,
      title: '很久以前的雨',
      body: '數千到數萬年前，撒哈拉比現在濕潤得多。雨水滲進地下，有些水一直存到今天，被稱為「化石水」。',
    },
    {
      x: 40,
      y: 160,
      title: '砂岩含水層',
      en: 'Nubian Sandstone Aquifer',
      body: '多孔的砂岩像海綿一樣吸滿水，範圍橫跨埃及、利比亞、蘇丹和查德，是世界最大的地下水體系之一。',
    },
    {
      x: 40,
      y: 112,
      title: '不透水的黏土層',
      body: '上面蓋著一層黏土，把地下水壓住、不讓它跑掉，就像蓋上蓋子的水管。',
    },
    {
      x: 160,
      y: 110,
      title: '低窪盆地',
      body: '綠洲是一個比四周高原低很多的大窪地，地面離地下水比較近，水就容易湧出或抽上來。',
    },
    {
      x: 186,
      y: 82,
      title: '泉水與溫泉',
      body: '越深的地下水越溫暖，有些井的水湧出來就是熱的，巴哈利亞因此有不少溫泉。',
    },
    {
      x: 120,
      y: 140,
      title: '抽水的代價',
      body: '化石水補充得極慢，抽得越多，水位越低，有些老泉已經乾掉，只能越鑽越深。',
    },
  ],
  wrap: (
    <>
      <p>
        綠洲的椰棗、橄欖和村落，都靠這片古老的地下水。它不是取之不盡，而是一筆慢慢在花的存款。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 剖面大幅簡化，岩層厚度與深度不按比例。
      </p>
    </>
  ),
};
