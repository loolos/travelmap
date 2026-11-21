import type { ReactNode } from 'react';
import lab from '../Lab.module.css';
import type { QuizSet } from './types';

const SKY = <rect width={320} height={160} fill="#f6dfb0" />;
const SEA = <rect width={320} height={160} fill="#2f7f9a" />;

const pebbles = (n: number, y0: number, h: number, fill: string) =>
  Array.from({ length: n }, (_, i) => (
    <ellipse key={i} cx={(i * 47) % 320} cy={y0 + ((i * 29) % h)} rx={5 + (i % 4)} ry={3 + (i % 3)} fill={fill} />
  ));

const crystal = (x: number, y: number, h: number, tilt = 0): ReactNode => (
  <g key={`${x}-${y}`} transform={`rotate(${tilt} ${x} ${y})`}>
    <path d={`M${x - 8} ${y} L${x - 8} ${y - h} L${x} ${y - h - 12} L${x + 8} ${y - h} L${x + 8} ${y} Z`} fill="#eef3f6" stroke="#9fb4c0" />
    <path d={`M${x} ${y} L${x} ${y - h - 12}`} stroke="#cfdbe2" />
  </g>
);

interface FishLook {
  body: string;
  bands?: string;
  fins?: string;
  beak?: boolean;
  spines?: boolean;
}
const fish = (x: number, y: number, s: number, f: FishLook) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {f.spines &&
      Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${-20 + i * 6} -8 L${-34 + i * 7} -44`} stroke={i % 2 ? '#fff' : '#a33b2f'} strokeWidth={2.5} />
      ))}
    {f.spines &&
      Array.from({ length: 5 }, (_, i) => (
        <path key={`p${i}`} d={`M-6 6 Q${-10 + i * 6} 40 ${-26 + i * 10} 46`} stroke="#c98a6a" strokeWidth={2} fill="none" />
      ))}
    <path d="M30 0 L54 -16 L50 0 L54 16 Z" fill={f.fins ?? f.body} />
    <ellipse cx={0} cy={0} rx={34} ry={f.spines ? 12 : 18} fill={f.body} />
    {f.bands && (
      <>
        <path d="M-14 -16 Q-8 0 -14 16" stroke={f.bands} strokeWidth={6} fill="none" />
        <path d="M8 -17 Q14 0 8 17" stroke={f.bands} strokeWidth={6} fill="none" />
      </>
    )}
    {f.spines &&
      Array.from({ length: 6 }, (_, i) => <path key={`s${i}`} d={`M${-22 + i * 9} -11 L${-22 + i * 9} 11`} stroke="#fff" strokeWidth={2.5} />)}
    {f.beak && <path d="M-34 -4 Q-42 0 -34 6 Z" fill="#f4f1ea" stroke="#5a8a7a" />}
    <circle cx={-20} cy={-4} r={3} fill="#111" />
  </g>
);

const anemone = Array.from({ length: 14 }, (_, i) => (
  <path key={i} d={`M${120 + i * 6} 160 Q${116 + i * 6 + (i % 2 ? 8 : -8)} 130 ${122 + i * 6} 110`} stroke="#c9a0c8" strokeWidth={5} fill="none" strokeLinecap="round" />
));

/** Black Desert: what are the black stones? */
const desertRocks: QuizSet = {
  question: '黑沙漠的黑石頭，是從哪裡來的？',
  how: '看圖和線索，選出你的答案。',
  items: [
    {
      draw: (
        <>
          {SKY}
          <rect y={110} width={320} height={50} fill="#c98f55" />
          {pebbles(40, 112, 46, '#2b2622')}
        </>
      ),
      clue: '黑黑亮亮的碎石鋪滿地面，拿起來比看起來還重。',
      options: ['煤炭', '含鐵的岩石', '被火燒黑的石頭', '隕石'],
      answer: 1,
      explain: '這些黑石多半是富含鐵質的石英岩，也有少量粗玄岩（dolerite，一種火成岩）。鐵讓它們又黑又重。',
    },
    {
      draw: (
        <>
          {SKY}
          <rect y={130} width={320} height={30} fill="#d9a86a" />
          {[70, 200].map((x) => (
            <g key={x}>
              <path d={`M${x - 60} 130 L${x - 14} 62 L${x + 14} 62 L${x + 60} 130 Z`} fill="#c98f55" />
              <path d={`M${x - 14} 62 L${x + 14} 62 L${x + 26} 80 L${x - 26} 80 Z`} fill="#2b2622" />
              {[-30, -12, 8, 28].map((d, i) => (
                <ellipse key={i} cx={x + d} cy={96 + (i % 2) * 14} rx={5} ry={3} fill="#3a332c" />
              ))}
            </g>
          ))}
        </>
      ),
      clue: '一座座小山都是平頂或尖頂，頂上黑、下面橘褐色，看起來像小火山。',
      options: ['真的是火山', '硬的黑石蓋頂，下面被風化', '人工堆出來的', '被風吹成的沙丘'],
      answer: 1,
      explain: '頂上耐風化的黑色岩層像帽子一樣保護底下較軟的砂岩，周圍被磨掉，就留下一座座「假火山」。',
    },
    {
      draw: (
        <>
          {SKY}
          {Array.from({ length: 120 }, (_, i) => (
            <circle key={i} cx={(i * 37) % 320} cy={20 + ((i * 23) % 130)} r={2 + (i % 3)} fill={i % 9 ? '#e8c48a' : '#f4f1ea'} />
          ))}
        </>
      ),
      clue: '放大地上的沙子：一顆顆金黃、半透明的小顆粒。',
      options: ['石英', '鹽巴', '碎貝殼', '鐵砂'],
      answer: 0,
      explain: '沙漠的沙大多是石英顆粒，石英又硬又不容易溶解，被風吹磨了很久也還留著。',
    },
  ],
  wrap: (
    <p>
      <span className={lab.tag}>示意</span> 圖為簡化插畫。保護區內請勿採集岩石，拍照留念就好。
    </p>
  ),
};

/** Crystal Mountain: how do crystals form and how to tell them apart. */
const crystalCheck: QuizSet = {
  question: '水晶山的晶體，是怎麼長出來的？',
  how: '看圖和線索，選出你的答案。',
  items: [
    {
      draw: (
        <>
          <rect width={320} height={160} fill="#c9b08a" />
          <path d="M0 70 L120 80 L200 60 L320 76 L320 100 L200 86 L120 104 L0 94 Z" fill="#8a6f4e" />
          {[30, 60, 100, 150, 190, 240, 280].map((x, i) => crystal(x, 92 - (i % 3) * 3, 8 + (i % 3) * 4, i % 2 ? 12 : -12))}
        </>
      ),
      clue: '晶體集中長在岩石的裂縫裡，像一排排牙齒。',
      options: ['火山噴發時噴出來', '熱水帶著礦物在裂縫裡沉澱', '古代動物的骨頭', '冬天結冰留下的'],
      answer: 1,
      explain: '含礦物的熱水沿著裂縫慢慢流動，水裡的礦物一層層沉澱下來，晶體就在縫裡長大。',
    },
    {
      draw: (
        <>
          <rect width={320} height={160} fill="#efe6d4" />
          {crystal(90, 130, 70)}
          <path d="M210 120 L240 60 L290 60 L260 120 Z" fill="#f4efe4" stroke="#b8a98a" />
          <text x={90} y={152} fontSize={12} textAnchor="middle" fill="#6e6656">
            六角柱、尖頭
          </text>
          <text x={250} y={152} fontSize={12} textAnchor="middle" fill="#6e6656">
            歪歪的菱形塊
          </text>
        </>
      ),
      clue: '不用敲、不用帶走，怎麼大致分辨石英和方解石？',
      options: ['看形狀', '看顏色', '聞味道', '分不出來'],
      answer: 0,
      explain: '石英常長成六角柱、尖頭，硬到能刮玻璃；方解石較軟，常裂成歪歪的菱形塊。這裡一般說是石英，也有人認為不少是方解石。',
    },
    {
      draw: (
        <>
          <rect width={320} height={160} fill="#c9b08a" />
          {Array.from({ length: 30 }, (_, i) => (
            <path key={i} d={`M${(i * 41) % 300 + 10} ${100 + ((i * 17) % 50)} l6 -8 l6 8 z`} fill="#eef3f6" stroke="#9fb4c0" />
          ))}
        </>
      ),
      clue: '地上滿是亮晶晶的碎晶體，可以撿一塊當紀念嗎？',
      options: ['可以，撿小的', '不行，只拍照', '可以，跟司機買', '藏在口袋就好'],
      answer: 1,
      explain: '這一帶有保護規定，遊客多了晶體已經越撿越少。拍照帶走就好，也別向人購買採來的晶體。',
    },
  ],
  wrap: (
    <p>
      <span className={lab.tag}>示意</span> 圖為簡化插畫，不能代替專業鑑定。
    </p>
  ),
};

/** Red Sea reef: quick ID of fish and corals you might meet while snorkelling. */
export const reefId: QuizSet = {
  question: '浮潛時看到的是誰？',
  how: '看圖和線索，選出你的答案。',
  items: [
    {
      draw: (
        <>
          {SEA}
          {anemone}
          {fish(170, 80, 1, { body: '#e8742c', bands: '#fff', fins: '#2a2a2a' })}
        </>
      ),
      clue: '橘色身體、兩條白帶，躲在會刺人的海葵裡。',
      options: ['小丑魚', '鸚嘴魚', '獅子魚', '蝴蝶魚'],
      answer: 0,
      explain: '紅海的是「雙帶小丑魚」。海葵的觸手會刺人，小丑魚身上的黏液卻能保護自己，兩者互相照顧。',
    },
    {
      draw: (
        <>
          {SEA}
          <path d="M0 140 Q60 110 120 140 T240 136 T320 140 L320 160 L0 160 Z" fill="#d7c6a0" />
          {fish(160, 80, 1.2, { body: '#3fb39a', fins: '#5f6fcf', beak: true })}
        </>
      ),
      clue: '彩色的大魚，嘴巴像鳥喙，靠近珊瑚會聽到「喀喀」啃咬聲。',
      options: ['石斑魚', '鸚嘴魚', '小丑魚', '河豚'],
      answer: 1,
      explain: '鸚嘴魚用鳥喙般的牙啃食珊瑚上的藻類，咬碎的珊瑚排出來就變成白沙，礁區的沙有不少是牠們「做」的。',
    },
    {
      draw: (
        <>
          {SEA}
          {fish(170, 86, 1.1, { body: '#c45a3c', fins: '#e9a487', spines: true })}
        </>
      ),
      clue: '紅白條紋，長長的鰭像羽毛扇一樣展開，慢慢游。',
      options: ['蝴蝶魚', '獅子魚', '神仙魚', '鸚嘴魚'],
      answer: 1,
      explain: '獅子魚的鰭棘有毒，被刺到非常痛。牠不怕人、不太游走，拍照可以，千萬別伸手。',
    },
    {
      draw: (
        <>
          {SEA}
          {[70, 150, 230].map((x) => (
            <path key={x} d={`M${x} 160 L${x - 6} 90 L${x - 20} 60 M${x - 6} 90 L${x + 10} 50 M${x} 120 L${x + 22} 80`} stroke="#d9b45a" strokeWidth={9} strokeLinecap="round" fill="none" />
          ))}
        </>
      ),
      clue: '黃褐色、像分叉的樹枝，表面毛毛的，碰到會像被燙到一樣刺痛。',
      options: ['腦珊瑚', '火珊瑚', '海綿', '海草'],
      answer: 1,
      explain: '火珊瑚其實是珊瑚的遠親（水螅），表面的刺細胞會螫人。不管哪種珊瑚都別踩、別摸。',
    },
    {
      draw: (
        <>
          {SEA}
          <path d="M60 160 Q60 90 120 90 Q180 90 180 160 Z" fill="#f4f6f4" />
          <path d="M190 160 Q190 110 235 110 Q280 110 280 160 Z" fill="#c98a6a" />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${70 + i * 18} 150 Q${80 + i * 18} 110 ${90 + i * 16} 100`} stroke="#dfe3df" strokeWidth={3} fill="none" />
          ))}
        </>
      ),
      clue: '一大片珊瑚變得雪白，旁邊同種的珊瑚還是褐色的。',
      options: ['天生就是白色', '白化：海水太熱', '剛長出來的新珊瑚', '被沙子蓋住'],
      answer: 1,
      explain: '海水太熱時，珊瑚會趕走體內提供養分和顏色的共生藻，變白就叫「白化」。很快降溫還能恢復，太久就會餓死。',
    },
  ],
  wrap: (
    <>
      <p>不碰、不踩、不餵魚。選礁石友善的防曬，或改穿防曬衣。</p>
      <p>
        <span className={lab.tag}>示意</span> 插畫只畫出辨識重點，顏色與比例經簡化。
      </p>
    </>
  ),
};

/** Activity id -> quiz. */
export const quizSets: Record<string, QuizSet> = {
  'black-desert-rocks': desertRocks,
  'crystal-check': crystalCheck,
};
