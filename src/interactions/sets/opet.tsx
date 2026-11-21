import { Link } from 'react-router-dom';
import lab from '../Lab.module.css';
import type { HotspotSet } from './types';

const NILE = '#3f8fa6';
const FIELD = '#d9e6b8';
const STONE = '#d4b07a';

/** Opet festival: Karnak (north) to Luxor Temple (south), by land and by river. Schematic map. */
export const opet: HotspotSet = {
  question: '一年一度，神像怎麼從卡納克「出遊」到路克索神廟？',
  how: '北邊在上。點數字，跟著遊行隊伍走一趟。',
  width: 240,
  height: 300,
  draw: (
    <>
      <rect width={240} height={300} fill={FIELD} />
      <path d="M40,0 C60,60 30,120 50,180 C66,230 40,270 56,300 L0,300 L0,0 Z" fill={NILE} />
      {/* barque route on the river */}
      <path d="M44,40 C52,100 34,150 46,200 C54,230 46,250 50,262" fill="none" stroke="#fff" strokeWidth={2} strokeDasharray="5 4" />
      {/* Karnak */}
      <rect x={120} y={22} width={70} height={46} fill={STONE} stroke="#9c7748" />
      <text x={155} y={16} fontSize={11} textAnchor="middle" fill="#3a2c1c">
        卡納克神殿
      </text>
      {/* Avenue of Sphinxes */}
      <path d="M150,68 C150,130 140,190 140,248" fill="none" stroke="#b8975f" strokeWidth={8} />
      {Array.from({ length: 16 }, (_, i) => {
        const y = 76 + i * 11;
        return (
          <g key={i}>
            <rect x={140 - (y > 190 ? 10 : 6) - (y < 130 ? -4 : 0)} y={y} width={3} height={3} fill="#7a5a32" />
            <rect x={155 - (y > 190 ? 10 : 6) - (y < 130 ? -4 : 0)} y={y} width={3} height={3} fill="#7a5a32" />
          </g>
        );
      })}
      {/* Luxor Temple */}
      <rect x={110} y={248} width={50} height={40} fill={STONE} stroke="#9c7748" />
      <text x={135} y={298} fontSize={11} textAnchor="middle" fill="#3a2c1c">
        路克索神廟
      </text>
      <text x={14} y={150} fontSize={10} fill="#fff" transform="rotate(-80 14 150)">
        尼羅河
      </text>
      <text x={228} y={14} fontSize={10} textAnchor="end" fill="#1f4e79">
        北 ↑
      </text>
      <text x={200} y={206} fontSize={10} textAnchor="middle" fill="#5a4630">
        約 2.7 公里
      </text>
    </>
  ),
  spots: [
    {
      x: 186,
      y: 48,
      title: '從卡納克出發',
      body: '眾神之王阿蒙住在卡納克。節慶開始時，祭司把阿蒙、他的妻子穆特和兒子孔蘇的神像請出來。',
    },
    {
      x: 120,
      y: 84,
      title: '扛在肩上的聖船',
      body: '神像放在小船形狀的神轎裡，由祭司扛在肩上走。平常百姓看不到神像，只有遊行時能遠遠看見。',
    },
    {
      x: 168,
      y: 150,
      title: '人面獅身像大道',
      body: '兩座神殿之間約 2.7 公里的大道，兩旁排滿人面或羊頭獅身像。2021 年整條大道修復開放，可以從頭走到尾。',
    },
    {
      x: 64,
      y: 120,
      title: '走水路',
      body: '去程或回程也會把聖船放上大船，沿尼羅河漂流，岸上擠滿看熱鬧、領麵包和啤酒的人。不同時代路線不太一樣。',
    },
    {
      x: 162,
      y: 262,
      title: '抵達路克索神廟',
      body: '這座神廟就是為這個節慶蓋的。阿蒙在這裡住上幾天，國王和神一起舉行儀式，讓王權「充電」，重新得到神的力量。',
    },
    {
      x: 96,
      y: 270,
      title: '牆上的遊行浮雕',
      body: '神廟的大柱廊兩側牆上，刻著整段奧佩特節遊行：聖船、樂手、舞者、獻祭的牛，圖坦卡門時期完成。進去後記得看兩邊的牆。',
    },
  ],
  wrap: (
    <>
      <p>
        奧佩特節在每年氾濫季舉行，新王國初期約 11 天，後來延長到二十多天。今天路克索還有一個叫「阿布·哈加格」的慶典，有人認為帶著奧佩特節的影子。
      </p>
      <p>
        想知道卡納克蓋了多久，看<Link to="/place/karnak/karnak-timeline">千年的神殿</Link>。
        <span className={lab.tag}>示意</span> 路線與距離為概略；遊行細節依時代不同。
      </p>
    </>
  ),
};
