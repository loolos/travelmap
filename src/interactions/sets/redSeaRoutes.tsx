import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const SEA = '#5fa8bd';
const LAND = '#ecd6a8';

/** The Red Sea as a trade route: harbours and canals from Khufu to the Romans (schematic map). */
export const redSeaRoutes: HotspotSet = {
  question: '五千年來，誰在紅海上跑船？',
  how: '點地圖上的數字，從北邊的運河一路看到南邊的蓬特。',
  width: 320,
  height: 260,
  draw: (
    <>
      <rect width={320} height={260} fill={LAND} />
      {/* Mediterranean */}
      <path d="M0 0 H320 V16 Q240 24 160 20 Q80 16 0 22 Z" fill={SEA} />
      {/* Red Sea with the Gulfs of Suez and Aqaba */}
      <path
        d="M116 34 L124 34 L136 70 L158 78 L170 40 L176 40 L170 84 L200 128 L246 190 L290 246 L294 260 L262 260 L222 208 L174 146 L134 88 Z"
        fill={SEA}
      />
      {/* Nile and delta */}
      <path d="M40 260 Q70 200 60 150 Q50 100 78 50 M78 50 L60 22 M78 50 L96 22" stroke="#4f95ad" strokeWidth={3} fill="none" />
      {/* Suez Canal */}
      <path d="M120 34 L118 18" stroke="#2f6f85" strokeWidth={2.5} />
      {/* ancient canal via the Wadi Tumilat */}
      <path d="M74 56 Q98 50 118 40" stroke="#2f6f85" strokeWidth={2} strokeDasharray="4 3" fill="none" />
      {/* desert roads from the coast to the Nile */}
      <path d="M178 124 Q120 120 60 130" stroke="#9c7748" strokeWidth={2} strokeDasharray="3 4" fill="none" />
      <path d="M232 192 Q150 200 52 210" stroke="#9c7748" strokeWidth={2} strokeDasharray="3 4" fill="none" />
      {/* monsoon route towards India */}
      <path d="M262 236 q30 -6 52 -30" stroke="#244c79" strokeWidth={1.5} fill="none" />
      <path d="M314 206 l-9 2 m9 -2 l-2 9" stroke="#244c79" strokeWidth={1.5} />
      <text x={312} y={200} fontSize={9} fill="#244c79" textAnchor="end">往印度</text>
      <text x={6} y={14} fontSize={9} fill="#f4ebd9">地中海</text>
      <text x={26} y={190} fontSize={9} fill="#2f6f85">尼羅河</text>
      <text x={180} y={70} fontSize={9} fill="#6e6656">西奈</text>
      <text x={226} y={150} fontSize={9} fill="#244c79">紅海</text>
      <text x={6} y={254} fontSize={9} fill="#6e6656">地圖示意・非比例</text>
    </>
  ),
  spots: [
    {
      x: 120,
      y: 22,
      title: '蘇伊士運河',
      en: 'Suez Canal, 1869',
      body: '1869 年通航的直線運河，船從地中海直接進紅海，不必繞過非洲南端，至今仍是全球海運的要道。',
    },
    {
      x: 96,
      y: 50,
      title: '法老的運河',
      en: 'Canal of the Pharaohs',
      body: '西元前六世紀由尼科二世開挖、大流士完成，經尼羅河支流把河和紅海接起來，之後時通時塞，荒廢了一千多年。',
    },
    {
      x: 128,
      y: 70,
      title: '瓦迪賈爾夫',
      en: 'Wadi al-Jarf',
      body: '胡夫時代的港口，船從這裡去西奈運銅礦。出土的梅勒日誌，是世界最古老的莎草紙文書，記錄運石頭蓋大金字塔。',
    },
    {
      x: 182,
      y: 112,
      title: '庫賽爾老港',
      en: 'Myos Hormos',
      body: '羅馬時代的港口，貨物上岸後由駱駝隊穿越東部沙漠，走幾天就到尼羅河邊的科普托斯，再順河而下。',
    },
    {
      x: 236,
      y: 180,
      title: '貝勒尼基',
      en: 'Berenice',
      body: '最南的羅馬大港。船隊趁夏天的季風開往印度，冬天再乘風回來，運回胡椒、寶石、絲綢和象牙。',
    },
    {
      x: 262,
      y: 238,
      title: '往蓬特',
      en: 'Land of Punt',
      body: '約前 1470 年，哈特謝普蘇特的船隊南下蓬特，帶回乳香樹和狒狒。蓬特大概在今天厄利垂亞到索馬利亞的沿岸。',
    },
  ],
  wrap: (
    <>
      <p>
        尼羅河往北流，紅海卻通往南方和東方。從胡夫的運石船到羅馬的香料船，再到今天的貨櫃輪，紅海一直是埃及看向世界的另一扇窗。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 地圖大幅簡化，港口位置為大略。
      </p>
    </>
  ),
};
