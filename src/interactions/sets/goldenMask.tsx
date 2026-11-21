import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const GOLD = '#d9a93a';
const GOLD_D = '#b8862a';
const BLUE = '#2d4f8f';
const SKIN = '#e2b54f';

/** Tutankhamun's gold mask, drawn as a simple front view. */
export const goldenMask: HotspotSet = {
  question: '黃金面具上，每個部分代表什麼？',
  how: '點數字，從頭頂一路看到胸前。',
  width: 240,
  height: 260,
  draw: (
    <>
      <rect width={240} height={260} fill="#1f2430" />
      {/* nemes lappets */}
      <path d="M60 90 L40 230 L84 230 L92 120 Z" fill={GOLD} />
      <path d="M180 90 L200 230 L156 230 L148 120 Z" fill={GOLD} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <path d={`M${57 - i * 2.6} ${108 + i * 18} L${88 - i * 0.6} ${108 + i * 18}`} stroke={BLUE} strokeWidth={7} />
          <path d={`M${183 + i * 2.6} ${108 + i * 18} L${152 + i * 0.6} ${108 + i * 18}`} stroke={BLUE} strokeWidth={7} />
        </g>
      ))}
      {/* broad collar */}
      <path d="M50 200 Q120 270 190 200 L190 230 Q120 290 50 230 Z" fill={GOLD_D} />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${54 + i * 2} ${206 + i * 7} Q120 ${272 + i * 5} ${186 - i * 2} ${206 + i * 7}`} stroke={i % 2 ? '#3d8a8a' : BLUE} strokeWidth={4} fill="none" />
      ))}
      {/* headcloth top */}
      <path d="M58 100 Q60 30 120 28 Q180 30 182 100 L160 92 Q120 70 80 92 Z" fill={GOLD} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${66 + i * 22} ${92 - (i === 0 || i === 5 ? 0 : 10)} Q${70 + i * 20} 50 ${84 + i * 14} 34`} stroke={BLUE} strokeWidth={6} fill="none" />
      ))}
      {/* face */}
      <path d="M82 90 Q120 74 158 90 L156 150 Q150 186 120 192 Q90 186 84 150 Z" fill={SKIN} />
      {/* eyes */}
      {[100, 140].map((x) => (
        <g key={x}>
          <path d={`M${x - 13} 118 Q${x} 108 ${x + 13} 118 Q${x} 124 ${x - 13} 118 Z`} fill="#f4f1ea" stroke={BLUE} strokeWidth={2.5} />
          <circle cx={x} cy={117} r={4} fill="#111" />
          <path d={`M${x - 14} 106 Q${x} 98 ${x + 14} 106`} stroke={BLUE} strokeWidth={3} fill="none" />
        </g>
      ))}
      <path d="M120 122 L114 148 Q120 152 126 148 Z" fill={GOLD_D} />
      <path d="M108 164 Q120 170 132 164" stroke={GOLD_D} strokeWidth={3} fill="none" />
      {/* beard */}
      <rect x={113} y={190} width={14} height={50} rx={5} fill={BLUE} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M113 ${196 + i * 7} L127 ${193 + i * 7}`} stroke={GOLD} strokeWidth={2} />
      ))}
      {/* vulture and cobra */}
      <ellipse cx={112} cy={74} rx={7} ry={8} fill={GOLD_D} stroke="#7a2e1f" strokeWidth={1.5} />
      <path d="M128 82 Q124 64 130 58 Q136 64 132 82 Z" fill={GOLD_D} stroke="#2d4f8f" strokeWidth={1.5} />
    </>
  ),
  spots: [
    {
      x: 156,
      y: 54,
      title: '禿鷲與眼鏡蛇',
      body: '額頭上並排一隻禿鷲頭和一條眼鏡蛇，分別代表上埃及和下埃及的守護女神：國王統治「兩地」。',
    },
    {
      x: 64,
      y: 160,
      title: '條紋頭巾',
      en: 'Nemes',
      body: '國王專屬的條紋頭巾。藍色條紋是嵌進黃金裡的藍色玻璃，不是彩繪。',
    },
    {
      x: 166,
      y: 128,
      title: '眼睛',
      body: '眼白用石英、瞳孔用黑曜石，眼線用青金石：在光下看起來像真的在看你。',
    },
    {
      x: 146,
      y: 238,
      title: '假鬍子',
      body: '編辮狀的鬍子是神的象徵，國王戴上表示自己與神相連。2014 年曾在清潔時脫落、被草率黏回，後來由專家修復。',
    },
    {
      x: 172,
      y: 226,
      title: '寬領圈',
      body: '一圈圈的珠串領子，用彩色石頭和玻璃鑲嵌成條紋。',
    },
    {
      x: 98,
      y: 156,
      title: '純金面容',
      body: '整個面具約 10 公斤黃金，高約 54 公分。背面和肩上刻著《亡靈書》咒語，保護國王的頭在來世完整無缺。',
    },
  ],
  wrap: (
    <>
      <p>
        1925 年在圖坦卡門（Tutankhamun）木乃伊頭上發現。現在和整套圖坦卡門寶藏一起陳列在大埃及博物館，展廳不准閃光燈。
      </p>
      <p>
        <span className={lab.tag}>示意</span> 插畫簡化了顏色與比例，到現場對照真品找每個細節。
      </p>
    </>
  ),
};
