import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const STONE = '#d4b07a';
const ROCK = '#b89a6c';
const PASS = '#3a2c1c';
const GRANITE = '#b4524a';

/**
 * North–south cutaway of the Great Pyramid, roughly to scale (1 px ≈ 0.82 m).
 * North is on the left. Base y = 200, apex (160, 20).
 */
export const khufuInterior: HotspotSet = {
  question: '金字塔裡面長什麼樣子？',
  how: '這是從北往南切開的剖面圖，北邊在左。點數字看每個通道和房間。',
  width: 320,
  height: 260,
  draw: (
    <>
      <rect width={320} height={200} fill="#cfe7f2" />
      <rect y={200} width={320} height={60} fill={ROCK} />
      <polygon points="20,200 160,20 300,200" fill={STONE} stroke="#9c7748" />
      {/* robbers' tunnel */}
      <path d="M27,192 L80,190" stroke={PASS} strokeWidth={3} strokeDasharray="4 2" />
      {/* descending passage to the subterranean chamber */}
      <path d="M36,179 L150,237" stroke={PASS} strokeWidth={3} />
      <rect x={146} y={232} width={26} height={9} fill={PASS} />
      {/* ascending passage */}
      <path d="M66,194 L109,173" stroke={PASS} strokeWidth={3} />
      {/* horizontal passage + Queen's Chamber */}
      <path d="M109,174 L152,174" stroke={PASS} strokeWidth={2.5} />
      <rect x={151} y={166} width={14} height={9} fill={PASS} />
      {/* Grand Gallery */}
      <polygon points="107,176 111,166 162,141 160,151" fill={PASS} />
      {/* King's Chamber + relieving chambers */}
      <rect x={163} y={139} width={14} height={8} fill={GRANITE} stroke={PASS} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={163} y={135 - i * 4} width={14} height={2.5} fill={GRANITE} opacity={0.8} />
      ))}
      <path d="M164,121 L170,113 L176,121" fill="none" stroke={GRANITE} strokeWidth={1.5} />
      {/* air shafts */}
      <path d="M164,142 L97,101" stroke={PASS} strokeWidth={1} />
      <path d="M177,142 L226,104" stroke={PASS} strokeWidth={1} />
      <path d="M152,170 L112,138" stroke={PASS} strokeWidth={0.8} strokeDasharray="2 2" />
      <path d="M164,170 L196,140" stroke={PASS} strokeWidth={0.8} strokeDasharray="2 2" />
      {/* ScanPyramids Big Void (approximate) */}
      <rect x={112} y={110} width={40} height={10} fill="none" stroke="#c0503f" strokeWidth={1.5} strokeDasharray="4 3" transform="rotate(-26 132 115)" />
      <text x={8} y={14} fontSize={10} fill="#1f4e79">
        ← 北
      </text>
      <text x={312} y={14} fontSize={10} textAnchor="end" fill="#1f4e79">
        南 →
      </text>
      <text x={312} y={254} fontSize={9} textAnchor="end" fill="#4a3a26">
        岩盤
      </text>
    </>
  ),
  spots: [
    {
      x: 40,
      y: 166,
      title: '原始入口',
      body: '在北面離地約 17 公尺高的地方，上方有人字形的大石樑分散重量。古代封住後就不容易找到。',
    },
    {
      x: 46,
      y: 204,
      title: '盜洞',
      body: '今天遊客走的入口，比原始入口低。傳說是 9 世紀時阿拉伯哈里發馬蒙派人挖的，一路挖到碰上內部通道。',
    },
    {
      x: 160,
      y: 224,
      title: '下行通道與地下墓室',
      body: '從入口往下斜切進岩盤，約 100 公尺長，盡頭是地底約 30 公尺深、沒有完工的墓室。',
    },
    {
      x: 86,
      y: 172,
      title: '上行通道',
      body: '從下行通道分岔往上，入口被三塊花崗岩塞石堵死。盜洞就是為了繞過這些塞石。',
    },
    {
      x: 128,
      y: 148,
      title: '大走廊',
      en: 'Grand Gallery',
      body: '高約 8.6 公尺、長約 47 公尺，牆面一層層往內收，像倒過來的階梯。在裡面往上爬，會覺得自己好小。',
    },
    {
      x: 150,
      y: 182,
      title: '「王后墓室」',
      en: "Queen's Chamber",
      body: '名字是後人取的，其實沒有王后葬在這裡。真正用途不明，可能是放國王雕像的地方。',
    },
    {
      x: 186,
      y: 146,
      title: '國王墓室',
      en: "King's Chamber",
      body: '整間用亞斯文運來的紅色花崗岩砌成，約 10.5 × 5.2 公尺。裡面只剩一具沒有蓋子的空石棺，木乃伊從沒找到。',
    },
    {
      x: 188,
      y: 118,
      title: '減壓室',
      body: '國王墓室上方疊了五層低矮的空間，分散上面幾百萬噸石頭的重量。1837 年在裡面發現工人寫的塗鴉，提到「胡夫」的名字。',
    },
    {
      x: 222,
      y: 96,
      title: '通氣井',
      body: '從墓室斜斜通往外面的細長通道。有人認為是讓國王靈魂飛向星星的路，真正用途仍有爭論。',
    },
    {
      x: 130,
      y: 100,
      title: '大空洞',
      en: 'Big Void',
      body: '2017 年科學家用宇宙射線「透視」金字塔，發現大走廊上方有一個至少 30 公尺長的空間。至今沒人進去過，用途不明。',
    },
  ],
  wrap: (
    <>
      <p>
        今天進入胡夫金字塔要另外買票，人數有限制。從盜洞進去後，會爬上大走廊到國王墓室；通道很窄、很熱，有幽閉恐懼的人要考慮。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 剖面大致照比例畫；大空洞的位置和大小是測量推估，形狀未知。
      </p>
    </>
  ),
};
