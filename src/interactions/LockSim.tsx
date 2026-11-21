import { useState } from 'react';
import { actionLabel, SOLUTION, start, step, type Action, type Direction, type LockState } from '../games/lock';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';

const W = 320;
const H = 170;
const HIGH = 62;
const LOW = 102;
const BED = 150;
const GATE_HIGH_X = 110;
const GATE_LOW_X = 210;
const boatX = { high: 55, chamber: 160, low: 265 } as const;

const actions: Action[] = ['openHigh', 'closeHigh', 'openLow', 'closeLow', 'fill', 'drain', 'move'];

export function LockSim({ activityId }: { activityId: string }) {
  const [s, setS] = useState<LockState>(() => start('down'));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [explained, setExplained] = useState(false);

  const reset = (d: Direction) => {
    setS(start(d));
    setMsg(null);
  };
  const act = (a: Action) => {
    const r = step(s, a);
    setS(r.state);
    if (!r.ok) setMsg({ ok: false, text: r.reason ?? '' });
    else if (r.state.done) {
      setMsg({
        ok: true,
        text: `通過了！用了 ${r.state.steps} 步${r.state.mistakes ? `，卡關 ${r.state.mistakes} 次` : '，一次都沒卡關'}。最少 ${SOLUTION[s.direction].length} 步。`,
      });
      markActivityDone(activityId);
    } else setMsg({ ok: true, text: `${actionLabel[a]} ✓` });
  };

  const chamberTop = s.level === 'high' ? HIGH : LOW;
  const boatY = (s.boat === 'high' ? HIGH : s.boat === 'low' ? LOW : chamberTop) - 14;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>船要怎麼爬下（或爬上）一段「水的樓梯」？</p>
      <p className={styles.how}>操作閘門和水位，讓遊輪安全通過船閘。順序錯了會告訴你為什麼。</p>

      <div className={styles.toggle} role="group" aria-label="方向">
        <button type="button" aria-pressed={s.direction === 'down'} onClick={() => reset('down')}>
          往路克索（下行）
        </button>
        <button type="button" aria-pressed={s.direction === 'up'} onClick={() => reset('up')}>
          往亞斯文（上行）
        </button>
      </div>

      <svg className={styles.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={describe(s)}>
        <rect x={0} y={HIGH} width={GATE_HIGH_X} height={BED - HIGH} fill="#5fa8bd" />
        <rect x={GATE_LOW_X} y={LOW} width={W - GATE_LOW_X} height={BED - LOW} fill="#5fa8bd" />
        <rect
          className={styles.anim}
          x={GATE_HIGH_X}
          y={HIGH}
          width={GATE_LOW_X - GATE_HIGH_X}
          height={BED - HIGH}
          fill="#5fa8bd"
          style={{ transform: `translateY(${chamberTop - HIGH}px)` }}
        />
        <rect x={0} y={BED} width={W} height={H - BED} fill="#b89a6c" />
        <Gate x={GATE_HIGH_X} open={s.highGate} />
        <Gate x={GATE_LOW_X} open={s.lowGate} />
        <g className={styles.anim} style={{ transform: `translate(${boatX[s.boat]}px, ${boatY}px)` }}>
          <polygon points="-34,4 34,4 28,16 -28,16" fill="#fff" stroke="#2b3a4a" />
          <rect x={-22} y={-8} width={40} height={12} fill="#f4efe4" stroke="#2b3a4a" />
          <rect x={-14} y={-16} width={22} height={8} fill="#f4efe4" stroke="#2b3a4a" />
        </g>
        <text x={6} y={16} fontSize={11} fill="#1f4e79">
          上游（南，高）
        </text>
        <text x={W - 6} y={16} fontSize={11} fill="#1f4e79" textAnchor="end">
          下游（北，低）
        </text>
      </svg>

      <p className={styles.status} role="status">
        {msg ? <span className={msg.ok ? undefined : styles.bottleneck}>{msg.text}</span> : `第 ${s.steps} 步`}
      </p>

      <div className={styles.buttons}>
        {actions.map((a) => (
          <button key={a} type="button" onClick={() => act(a)} disabled={s.done} className={a === 'move' ? styles.wide : undefined}>
            {actionLabel[a]}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        {!explained && (
          <button type="button" className={styles.primary} onClick={() => setExplained(true)}>
            看解釋
          </button>
        )}
        <button type="button" onClick={() => reset(s.direction)}>
          重來
        </button>
      </div>

      {explained && (
        <div className={styles.explain}>
          <p>
            船閘就是一個「水的電梯」：閘室兩端各有一道閘門，只開一邊，讓閘室的水位先和那一邊一樣高，船才能開進開出。
            水位不同時，幾公尺的水壓會把閘門緊緊壓住，所以一定要先灌水或放水。
          </p>
          <p>
            伊斯納（Esna）的攔河堰把尼羅河分成高低兩段，往返亞斯文和路克索的遊輪都得在這裡排隊過閘，有時要等上好幾個小時。
            排隊時常有小販划著小船靠過來，把布巾往甲板上拋著叫賣。
          </p>
          <p>
            <span className={styles.tag}>最少步數</span> 下行：灌水 → 開上游閘門 → 船進閘室 → 關上游閘門 → 放水 → 開下游閘門 → 船出去。
          </p>
        </div>
      )}
    </div>
  );
}

function Gate({ x, open }: { x: number; open: boolean }) {
  return (
    <rect
      className={styles.anim}
      x={x - 3}
      y={36}
      width={6}
      height={BED - 36}
      rx={2}
      fill="#4a4238"
      style={{ transform: open ? 'translateY(-96px)' : undefined, opacity: open ? 0.35 : 1 }}
    />
  );
}

function describe(s: LockState): string {
  const where = { high: '上游', chamber: '閘室裡', low: '下游' }[s.boat];
  return `船在${where}；閘室水位${s.level === 'high' ? '高' : '低'}；上游閘門${s.highGate ? '開' : '關'}，下游閘門${s.lowGate ? '開' : '關'}`;
}
