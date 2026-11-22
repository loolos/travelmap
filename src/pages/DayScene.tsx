import type { Scene } from './dayData';
import styles from './DayPage.module.css';

/** Sky colour for a time of day 0 (dawn) … 1 (night). */
function sky(t: number): [string, string] {
  if (t >= 0.95) return ['#14213d', '#2f3e66'];
  if (t <= 0.04) return ['#3b4a7a', '#e9a66b'];
  if (t < 0.15) return ['#8fb8d8', '#f3c58b'];
  if (t > 0.76) return ['#c9805a', '#f2c38b'];
  return ['#7fb6dc', '#d8ecf5'];
}

const STARS = [
  [30, 20],
  [70, 40],
  [110, 14],
  [160, 32],
  [205, 18],
  [250, 44],
  [290, 22],
  [140, 58],
];

/** Simple 示意 picture: the sun crosses the sky as the day goes on, over a backdrop for the role. */
export function DayScene({ scene, t, icon }: { scene: Scene; t: number; icon: string }) {
  const [top, bottom] = sky(t);
  const night = t >= 0.95;
  const st = Math.min(Math.max(t, 0.02), 0.94);
  const x = 20 + st * 280;
  const y = 104 - Math.sin(Math.PI * st) * 80;
  return (
    <svg className={styles.scene} viewBox="0 0 320 150" role="img" aria-label="一天中的時刻（示意）">
      <defs>
        <linearGradient id="day-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: top, transition: 'stop-color .6s' }} />
          <stop offset="1" style={{ stopColor: bottom, transition: 'stop-color .6s' }} />
        </linearGradient>
      </defs>
      <rect width="320" height="150" fill="url(#day-sky)" />
      {night ? (
        <g>
          {STARS.map(([sx, sy]) => (
            <circle key={`${sx}-${sy}`} cx={sx} cy={sy} r="1.4" fill="#fff" opacity="0.85" />
          ))}
          <circle cx="262" cy="34" r="13" fill="#f6efd0" />
          <circle cx="268" cy="30" r="12" fill="#14213d" />
        </g>
      ) : (
        <g className={styles.sun} style={{ transform: `translate(${x}px, ${y}px)` }}>
          <circle r="16" fill="#fbd46d" opacity="0.35" />
          <circle r="10" fill="#f7b733" />
        </g>
      )}
      <Backdrop scene={scene} night={night} />
      <text x="58" y="138" fontSize="34" textAnchor="middle">
        {icon}
      </text>
      <text x="314" y="146" fontSize="9" textAnchor="end" fill={night ? '#ddd' : '#5a5040'}>
        示意
      </text>
    </svg>
  );
}

function Backdrop({ scene, night }: { scene: Scene; night: boolean }) {
  const sand = night ? '#6d6350' : '#e3c992';
  const mud = night ? '#5b4a38' : '#b98d5f';
  const stone = night ? '#7a7060' : '#d9c39a';
  const shade = night ? '#4a3f32' : '#a9794b';
  const green = night ? '#3d5a3b' : '#86a85c';
  return (
    <g>
      {scene === 'cliff' && (
        <g>
          <path d="M0 108 L40 70 L80 82 L130 46 L175 74 L215 58 L260 88 L320 66 L320 112 L0 112 Z" fill={shade} />
          <rect x="150" y="88" width="14" height="18" fill="#3a2c1e" />
        </g>
      )}
      <rect y="106" width="320" height="44" fill={sand} />
      {scene === 'field' && (
        <g>
          <rect y="110" width="320" height="8" fill={night ? '#2a4a5a' : '#4f9db5'} />
          {[110, 140, 170, 200, 230, 260, 290].map((wx) => (
            <g key={wx} stroke={green} strokeWidth="2">
              <line x1={wx} y1="146" x2={wx} y2="124" />
              <line x1={wx + 8} y1="146" x2={wx + 8} y2="126" />
              <line x1={wx + 16} y1="146" x2={wx + 16} y2="124" />
            </g>
          ))}
          <line x1="250" y1="108" x2="246" y2="64" stroke={shade} strokeWidth="4" />
          <path d="M246 64 q-20 -2 -28 10 M246 64 q20 -2 28 10 M246 64 q-14 -12 -26 -8 M246 64 q14 -12 26 -8" stroke={green} strokeWidth="4" fill="none" />
        </g>
      )}
      {scene === 'town' && (
        <g fill={mud}>
          <rect x="120" y="80" width="40" height="30" />
          <rect x="166" y="70" width="46" height="40" />
          <rect x="218" y="86" width="34" height="24" />
          <rect x="258" y="76" width="44" height="34" />
          <g fill="#3a2c1e">
            <rect x="134" y="94" width="10" height="16" />
            <rect x="184" y="92" width="10" height="18" />
            <rect x="272" y="94" width="10" height="16" />
          </g>
        </g>
      )}
      {scene === 'temple' && (
        <g fill={stone}>
          <path d="M120 110 L128 44 L176 44 L184 110 Z" />
          <path d="M220 110 L228 44 L276 44 L284 110 Z" />
          <rect x="184" y="62" width="36" height="48" />
          <rect x="192" y="76" width="20" height="34" fill="#3a2c1e" />
          <path d="M296 110 L300 40 L304 34 L308 40 L312 110 Z" />
        </g>
      )}
      {scene === 'palace' && (
        <g fill={stone}>
          <rect x="110" y="52" width="200" height="8" />
          {[122, 162, 202, 242, 282].map((cx) => (
            <g key={cx}>
              <rect x={cx} y="64" width="12" height="46" />
              <path d={`M${cx - 5} 64 L${cx + 17} 64 L${cx + 12} 58 L${cx} 58 Z`} />
            </g>
          ))}
        </g>
      )}
      {scene === 'house' && (
        <g>
          <rect x="150" y="68" width="90" height="42" fill={mud} />
          <rect x="182" y="86" width="14" height="24" fill="#3a2c1e" />
          <rect x="210" y="80" width="12" height="10" fill="#3a2c1e" />
          <path d="M240 110 L240 100 L248 100 L248 90 L256 90 L256 80 L264 80 L264 110 Z" fill={shade} />
          <path d="M276 110 a16 16 0 0 1 32 0 Z" fill={shade} />
        </g>
      )}
    </g>
  );
}
