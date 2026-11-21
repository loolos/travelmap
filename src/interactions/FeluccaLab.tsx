import { useState } from 'react';
import { markActivityDone } from '../progress/store';
import { sail as run, type Goal, type Sail, type Wind } from '../games/felucca';
import lab from './Lab.module.css';

const W = 320;
const H = 220;
const MID = 110;

function Toggle<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: '3.2em', fontSize: 14 }}>{label}</span>
      <div className={lab.toggle} role="group" aria-label={label}>
        {options.map(([v, t]) => (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onChange(v)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function Boat({ up }: { up: boolean }) {
  return (
    <g>
      <path d="M-16 6 Q0 16 16 6 Z" fill="#7a5532" />
      <line x1={0} y1={6} x2={0} y2={-26} stroke="#5a3d22" strokeWidth={2} />
      {up ? <path d="M0 -26 L-2 4 L-22 2 Z M-10 -34 L6 -16" fill="#fffaf0" stroke="#b8a98a" /> : <path d="M-12 -2 L12 -8" stroke="#e8e0cc" strokeWidth={4} />}
    </g>
  );
}

/** Aswan felucca: river flows north, wind blows south. Pick goal, sail and wind, then set off. */
export function FeluccaLab({ activityId }: { activityId: string }) {
  const [goal, setGoal] = useState<Goal>('south');
  const [sailState, setSail] = useState<Sail>('down');
  const [wind, setWind] = useState<Wind>('north');
  const [trip, setTrip] = useState<ReturnType<typeof run> | null>(null);
  const [reached, setReached] = useState<Set<Goal>>(() => new Set());
  const reset = () => setTrip(null);

  const go = () => {
    const r = run(goal, sailState, wind);
    setTrip(r);
    if (r.ok && !reached.has(goal)) {
      const next = new Set(reached).add(goal);
      setReached(next);
      if (next.size === 2) markActivityDone(activityId);
    }
  };
  // south is down on the map (north up), so + net moves the boat down
  const dy = trip ? Math.max(-80, Math.min(80, trip.net * 30)) : 0;
  return (
    <div className={lab.lab}>
      <p className={lab.question}>不用引擎，船怎麼逆流而上？</p>
      <p className={lab.how}>選好方向、帆和風，按「出發」。兩個方向都試著到達看看。</p>
      <svg className={lab.visual} style={{ maxHeight: 240, background: '#e9d9b4' }} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={trip ? trip.reason : '尼羅河示意圖，北方在上'}>
        <rect x={110} width={100} height={H} fill="#5fa3b8" />
        <rect x={60} width={50} height={H} fill="#bfc98a" />
        <rect x={210} width={50} height={H} fill="#bfc98a" />
        {/* current */}
        {[30, 90, 150].map((y) => (
          <path key={y} d={`M195 ${y + 30} v-24 m-5 6 l5 -6 l5 6`} stroke="#e6f2f5" strokeWidth={2} fill="none" />
        ))}
        <text x={200} y={214} fontSize={10} fill="#e6f2f5" textAnchor="end">
          水流
        </text>
        {/* wind */}
        {wind === 'north' &&
          [40, 110, 180].map((y) => (
            <path key={y} d={`M24 ${y - 14} v28 m-6 -7 l6 7 l6 -7`} stroke="#244c79" strokeWidth={2.5} fill="none" opacity={0.7} />
          ))}
        <text x={24} y={214} fontSize={10} fill="#244c79" textAnchor="middle">
          {wind === 'north' ? '北風' : '無風'}
        </text>
        {/* compass */}
        <text x={300} y={20} fontSize={12} fontWeight={700} fill="#292720" textAnchor="middle">
          北↑
        </text>
        <text x={300} y={214} fontSize={10} fill="#6e6656" textAnchor="middle">
          南
        </text>
        {/* zigzag trail */}
        {trip?.zigzag && <path d={`M150 ${MID} l20 -20 l-30 -20 l30 -20 l-20 -20`} stroke="#fffaf0" strokeDasharray="4 4" fill="none" />}
        <g className={lab.anim} style={{ transform: `translate(${150}px, ${MID + dy}px)` }}>
          <Boat up={sailState === 'up'} />
        </g>
      </svg>
      <div style={{ display: 'grid', gap: 6 }}>
        <Toggle<Goal> label="想去" value={goal} options={[['south', '往南（上游）'], ['north', '往北（下游）']]} onChange={(v) => (setGoal(v), reset())} />
        <Toggle<Sail> label="帆" value={sailState} options={[['up', '升帆'], ['down', '收帆']]} onChange={(v) => (setSail(v), reset())} />
        <Toggle<Wind> label="風" value={wind} options={[['north', '北風'], ['calm', '無風']]} onChange={(v) => (setWind(v), reset())} />
      </div>
      <div className={lab.actions}>
        <button type="button" className={lab.primary} onClick={go}>
          出發
        </button>
        <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--muted)' }}>
          到達：{reached.has('south') ? '南 ✓' : '南 ○'}{'　'}{reached.has('north') ? '北 ✓' : '北 ○'}
        </span>
      </div>
      <p className={lab.status} aria-live="polite">
        {trip && (
          <>
            <b>{trip.ok ? '成功！' : '方向不對。'}</b>
            {trip.reason}
          </>
        )}
      </p>
      {reached.size === 2 && (
        <div className={lab.explain}>
          <p>
            尼羅河由南往北流，風卻多半從北往南吹：<b>往南靠風、往北靠水</b>。所以古埃及文字的「往南」畫張帆的船，「往北」畫收帆的船。
          </p>
          <p>
            <span className={lab.tag}>示意</span> 速度只是相對比較。實際風向會變，船夫也會划槳或請拖船。
          </p>
        </div>
      )}
    </div>
  );
}
