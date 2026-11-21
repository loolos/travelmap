import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const star = (x: number, y: number, r = 1.6, fill = '#fff') => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill={fill} />;

// background star field (deterministic)
const field = Array.from({ length: 90 }, (_, i) => star((i * 97) % 320, 10 + ((i * 53) % 170), i % 7 === 0 ? 1.1 : 0.6, '#cfd8ea'));

/** Winter evening sky from the Western Desert, panoramic and schematic. */
export const nightSky: HotspotSet = {
  question: '古埃及人抬頭，看到的是哪些星星？',
  how: '點數字，從北方的天空一路看到東南方。',
  width: 320,
  height: 220,
  draw: (
    <>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1026" />
          <stop offset="1" stopColor="#25305a" />
        </linearGradient>
      </defs>
      <rect width={320} height={220} fill="url(#sky)" />
      {/* Milky Way band */}
      <path d="M90 0 Q140 90 230 200 L290 200 Q190 90 150 0 Z" fill="#c9d4f0" opacity={0.12} />
      {field}
      {/* Polaris & circumpolar */}
      {star(52, 120, 2.2)}
      <circle cx={52} cy={120} r={34} fill="none" stroke="#8fa3d6" strokeDasharray="3 4" opacity={0.6} />
      {/* Big Dipper low in NE */}
      {[
        [80, 176],
        [92, 170],
        [104, 168],
        [116, 172],
        [122, 186],
        [138, 184],
        [136, 172],
      ].map(([x, y]) => star(x, y, 1.8))}
      {/* Orion */}
      {[
        [214, 60, 2.4, '#ffb27a'],
        [246, 64, 1.8],
        [224, 84, 1.8],
        [230, 82, 1.8],
        [236, 80, 1.8],
        [218, 108, 1.8],
        [248, 106, 2.2, '#bcd2ff'],
      ].map(([x, y, r, f]) => star(x as number, y as number, r as number, f as string | undefined))}
      {/* Sirius */}
      {star(196, 150, 3.2, '#e8f0ff')}
      {/* Pleiades */}
      {[
        [276, 26],
        [280, 24],
        [283, 28],
        [279, 30],
        [285, 23],
      ].map(([x, y]) => star(x, y, 1.1))}
      {/* dunes */}
      <path d="M0 200 Q60 186 120 198 T240 194 T320 198 L320 220 L0 220 Z" fill="#1a1712" />
      {[
        [52, '北'],
        [160, '東'],
        [290, '南'],
      ].map(([x, t]) => (
        <text key={t} x={x} y={214} fontSize={11} textAnchor="middle" fill="#d9c9a3">
          {t}
        </text>
      ))}
    </>
  ),
  spots: [
    {
      x: 52,
      y: 76,
      title: '不滅之星',
      body: '北極星附近的星星整夜繞圈、從不落下。古埃及人稱它們「不滅者」，相信國王死後會加入它們。',
    },
    {
      x: 108,
      y: 146,
      title: '北斗七星',
      body: '古埃及人看成一隻「牛的前腿」。12 月的晚上它很低、可能被地平線擋住，後半夜才從東北升高。',
    },
    {
      x: 272,
      y: 84,
      title: '獵戶座',
      en: 'Orion',
      body: '古埃及叫它「薩赫」（Sah），和冥王歐西里斯連在一起。先找中間斜斜排成一列的三顆星。',
    },
    {
      x: 172,
      y: 170,
      title: '天狼星',
      en: 'Sirius',
      body: '全天最亮的恆星，順著獵戶腰帶往左下找。古埃及稱它索普代特（Sopdet），與伊西斯相關；它在黎明前重新出現，代表氾濫季與新年。',
    },
    {
      x: 170,
      y: 40,
      title: '旬星：星星時鐘',
      body: '古埃及人把天空分成 36 組星（旬星），每組大約十天輪一次。看哪組星升起，就知道夜裡的鐘點，一夜分成 12 小時就從這裡來。',
    },
    {
      x: 122,
      y: 24,
      title: '銀河',
      body: '沙漠沒有光害，無月的夜晚銀河很清楚。有學者推測，天空女神努特（Nut）的身體就是對銀河的想像，但這只是一種解讀。',
    },
  ],
  wrap: (
    <>
      <p>
        觀星小訣竅：遠離營火、讓眼睛適應 20 分鐘，手機調到最暗或用紅光。別一個人走離營地太遠。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 以 12 月晚上九點左右的大致方向繪製，星星位置和亮度皆經簡化。
      </p>
    </>
  ),
};
