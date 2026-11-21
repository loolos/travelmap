import { useState } from 'react';
import { Link } from 'react-router-dom';
import { markActivityDone } from '../progress/store';
import { dig, LAYERS, seasonsLeft, SPOTS, startDig } from '../games/tut';
import styles from './Lab.module.css';
import p from './Pyramid.module.css';

/** 找圖坦卡門：先在山谷裡挖，找到入口後一層層打開。 */
export function TutDig({ activityId }: { activityId: string }) {
  const [s, setS] = useState(startDig);
  const [last, setLast] = useState<string | null>(null);
  const [opened, setOpened] = useState(0);
  const [explained, setExplained] = useState(false);
  const spot = SPOTS.find((x) => x.id === last);
  const left = seasonsLeft(s);
  const layer = opened > 0 ? LAYERS[opened - 1] : undefined;
  const allOpen = opened === LAYERS.length;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>三千年沒人找到的法老墓，藏在哪裡？</p>

      {!s.found ? (
        <>
          <p className={styles.how}>
            1922 年，考古學家卡特已經在帝王谷挖了五季，什麼也沒找到。資助人卡納馮勳爵答應再給最後一次機會。點一個地方挖挖看。
          </p>
          <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={`帝王谷地圖，已挖 ${s.dug.length} 處`}>
            <rect width={320} height={190} fill="#e9cf9c" />
            <path d="M0,0 L320,0 L320,30 C250,40 230,20 180,34 C120,50 90,20 40,36 L0,40Z" fill="#c7a874" />
            <path d="M0,190 L320,190 L320,160 C260,150 220,176 160,164 C100,152 60,176 0,160Z" fill="#c7a874" />
            <path d="M10,110 C80,100 120,90 170,95 C220,100 260,80 312,90" fill="none" stroke="#b8975f" strokeWidth={14} strokeLinecap="round" opacity={0.5} />
            {SPOTS.map((x) => {
              const done = s.dug.includes(x.id);
              return (
                <g key={x.id}>
                  <circle cx={x.x} cy={x.y} r={done ? 8 : 10} fill={done ? '#7a5a32' : '#fff'} stroke="#7a5a32" strokeWidth={2} />
                  <text x={x.x} y={x.y + 22} fontSize={9} textAnchor="middle" fill="#3a2c1c">
                    {x.label}
                  </text>
                </g>
              );
            })}
          </svg>
          <div className={p.row}>
            {SPOTS.map((x) => (
              <button
                key={x.id}
                type="button"
                className={p.idle}
                disabled={s.dug.includes(x.id)}
                onClick={() => {
                  setS((cur) => dig(cur, x.id));
                  setLast(x.id);
                }}
              >
                ⛏️ {x.label}
              </button>
            ))}
          </div>
          <p className={styles.how}>{left > 0 ? `還能挖 ${left} 處` : '錢快用完了……卡納馮勳爵再給最後一季！'}</p>
          {spot && (
            <p className={p.note}>
              {spot.clue && <strong>線索！</strong>} {spot.result}
            </p>
          )}
        </>
      ) : (
        <>
          <p className={p.note}>
            <strong>找到了！</strong> {SPOTS.find((x) => x.tomb)!.result}
            入口就在拉美西斯六世墓的正下方。後來的人在上面蓋了小屋，反而把它藏了三千年，也躲過了盜墓。
          </p>
          <p className={styles.how}>一層一層打開，看看裡面有什麼。</p>
          <svg className={styles.chart} viewBox="0 0 320 190" role="img" aria-label={layer ? `已打開：${layer.label}` : '封住的墓'}>
            <rect width={320} height={190} fill="#2b2418" />
            {opened === 2 && (
              <g fill="#d4a73c" stroke="#7a5a1a">
                <rect x={30} y={110} width={90} height={22} rx={4} />
                <circle cx={200} cy={130} r={26} fill="none" strokeWidth={4} />
                <rect x={240} y={70} width={50} height={60} />
                <rect x={130} y={60} width={50} height={40} />
              </g>
            )}
            {(opened === 3 || opened === 4) && (
              <rect
                x={opened === 3 ? 40 : 80}
                y={opened === 3 ? 20 : 40}
                width={opened === 3 ? 240 : 160}
                height={opened === 3 ? 150 : 110}
                rx={6}
                fill={opened === 3 ? '#d4a73c' : '#b9a98a'}
                stroke="#7a5a1a"
                strokeWidth={2}
              />
            )}
            {opened >= 5 && (
              <g>
                <path d="M160,40 C130,40 120,70 122,100 L118,150 L202,150 L198,100 C200,70 190,40 160,40Z" fill="#e2b53b" stroke="#8a6a1a" />
                {Array.from({ length: 6 }, (_, i) => (
                  <line key={i} x1={124} x2={196} y1={108 + i * 7} y2={108 + i * 7} stroke="#2f4f8f" strokeWidth={3} />
                ))}
                <ellipse cx={160} cy={78} rx={20} ry={24} fill="#f0c95a" />
                {opened >= 6 && <text x={160} y={175} fontSize={11} textAnchor="middle" fill="#f0c95a">約 10 公斤黃金</text>}
              </g>
            )}
            {opened < 2 && (
              <g>
                <rect x={110} y={30} width={100} height={140} fill="#8a7458" stroke="#5a4630" />
                <circle cx={160} cy={100} r={14} fill="#5a4630" />
                <text x={160} y={104} fontSize={9} textAnchor="middle" fill="#e9dcc0">
                  封印
                </text>
              </g>
            )}
          </svg>
          {layer && <p className={p.note}>{layer.text}</p>}
          <div className={styles.actions}>
            {!allOpen && (
              <button type="button" className={styles.primary} onClick={() => setOpened(opened + 1)}>
                打開：{LAYERS[opened].label}
              </button>
            )}
            {allOpen && !explained && (
              <button
                type="button"
                className={styles.primary}
                onClick={() => {
                  setExplained(true);
                  markActivityDone(activityId);
                }}
              >
                看完整解釋
              </button>
            )}
          </div>
        </>
      )}

      {explained && (
        <div className={styles.explain}>
          <p>
            圖坦卡門大約九歲登基、十九歲左右過世，在位不到十年。他的墓（編號 KV62）比其他國王小得多，可能是匆忙改用別人的墓。
          </p>
          <p>
            正因為入口被後來的碎石和小屋蓋住，它成了帝王谷唯一幾乎完整保存的法老墓。從 1922 年發現到全部清點完，卡特花了十年，
            記錄了五千多件文物，今天多半在<Link to="/place/gem">大埃及博物館</Link>。
          </p>
          <p>
            <span className={styles.tag}>簡化</span> 挖掘地點和順序是簡化過的；真實的搜尋花了好幾季，靠的是系統性地清到岩盤。
          </p>
        </div>
      )}
    </div>
  );
}
