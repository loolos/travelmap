import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const STONE = '#e8d3a8';
const WALL = '#b99a66';
const HOR = '#3f6fa3';
const SOB = '#4f8a5b';

/** Kom Ombo: one temple, two gods. Plan is schematic, not a survey. */
export const komOmbo: HotspotSet = {
  question: '一座神殿，為什麼有兩個大門？',
  how: '點數字，看左右兩半各屬於誰。',
  width: 320,
  height: 240,
  draw: (
    <>
      <rect width={320} height={240} fill="#f6e7c6" />
      {/* outer enclosure */}
      <rect x={70} y={18} width={180} height={196} fill={STONE} stroke={WALL} strokeWidth={6} />
      {/* inner temple */}
      <rect x={92} y={30} width={136} height={150} fill="#f1e1bd" stroke={WALL} strokeWidth={3} />
      {/* halves */}
      <rect x={95} y={33} width={64} height={144} fill={HOR} opacity={0.18} />
      <rect x={161} y={33} width={64} height={144} fill={SOB} opacity={0.18} />
      <line x1={160} y1={30} x2={160} y2={180} stroke={WALL} strokeWidth={2} />
      {/* two axes */}
      <line x1={127} y1={44} x2={127} y2={214} stroke={HOR} strokeWidth={2} strokeDasharray="5 4" />
      <line x1={193} y1={44} x2={193} y2={214} stroke={SOB} strokeWidth={2} strokeDasharray="5 4" />
      {/* sanctuaries */}
      <rect x={114} y={40} width={26} height={22} fill={HOR} opacity={0.7} />
      <rect x={180} y={40} width={26} height={22} fill={SOB} opacity={0.7} />
      {/* columns */}
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 6 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={104 + c * 22.5} cy={110 + r * 16} r={3.5} fill={WALL} />
        )),
      )}
      {/* doors */}
      <rect x={118} y={176} width={18} height={8} fill="#f6e7c6" />
      <rect x={184} y={176} width={18} height={8} fill="#f6e7c6" />
      {/* pylon */}
      <rect x={70} y={206} width={180} height={14} fill={WALL} />
      <rect x={118} y={204} width={18} height={18} fill="#f6e7c6" />
      <rect x={184} y={204} width={18} height={18} fill="#f6e7c6" />
      {/* nilometer & museum (positions schematic) */}
      <circle cx={36} cy={60} r={13} fill="#9cc6cf" stroke={WALL} strokeWidth={3} />
      <rect x={266} y={180} width={42} height={30} rx={4} fill="#d8c8a6" stroke={WALL} />
      <text x={127} y={235} fontSize={11} textAnchor="middle" fill={HOR} fontWeight={700}>
        老荷魯斯
      </text>
      <text x={193} y={235} fontSize={11} textAnchor="middle" fill={SOB} fontWeight={700}>
        索貝克
      </text>
      <text x={6} y={232} fontSize={10} fill="#6e6656">
        平面示意・非比例
      </text>
    </>
  ),
  spots: [
    {
      x: 160,
      y: 212,
      title: '兩個大門',
      body: '塔門上並排兩個入口，從這裡開始，整座神殿左右對稱、一分為二，各自一路通到最深處。',
    },
    {
      x: 127,
      y: 51,
      title: '左半：老荷魯斯',
      en: 'Haroeris',
      body: '面向神殿走進去，左邊（北半）獻給鷹頭的老荷魯斯。浮雕裡看「鷹頭＋雙冠」就是他。',
    },
    {
      x: 193,
      y: 51,
      title: '右半：索貝克',
      en: 'Sobek',
      body: '右邊（南半）獻給鱷魚頭的索貝克。浮雕裡看「鱷魚頭＋羽冠或日盤」就是他。',
    },
    {
      x: 160,
      y: 132,
      title: '共用的柱廳',
      body: '柱子連成一片，中間沒有牆；兩位神各有一套家族（妻子和兒子），卻共用同一座建築。',
    },
    {
      x: 160,
      y: 22,
      title: '後方外廊',
      body: '外圍走廊的牆上有一組常被說成「醫療器具」的浮雕，也有學者認為是祭祀用具。',
    },
    {
      x: 36,
      y: 60,
      title: '尼羅河水位計',
      en: 'Nilometer',
      body: '一口有階梯的深井，連通河水。看水位高低，可以預估當年收成和稅收。',
    },
    {
      x: 287,
      y: 195,
      title: '鱷魚博物館',
      body: '神殿旁的小博物館，收藏附近出土的鱷魚木乃伊，是索貝克崇拜留下的證據。',
    },
  ],
  wrap: (
    <>
      <p>
        記法：<b>左鷹右鱷</b>。在牆上看到鱷魚頭的神，就是走在索貝克那一半；鷹頭則是老荷魯斯。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 平面圖簡化了房間數量與位置，水位計和博物館只標大概方向。
      </p>
    </>
  ),
};
