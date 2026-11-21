import type { PlaceKind } from '../data/schema';
import styles from './EgyptMap.module.css';

type Shape = 'triangle' | 'square' | 'circle' | 'diamond' | 'drop' | 'ring';

/** Shape + colour both encode the kind, so meaning never relies on colour alone. */
export const kindStyle: Record<PlaceKind, { shape: Shape; color: string; label: string }> = {
  tomb: { shape: 'triangle', color: '#B88B43', label: '陵墓' },
  statue: { shape: 'triangle', color: '#9C6B3C', label: '雕像' },
  temple: { shape: 'square', color: '#8A4F3D', label: '神殿' },
  mosque: { shape: 'square', color: '#2E7D5B', label: '清真寺' },
  fortress: { shape: 'square', color: '#5C5148', label: '城堡' },
  city: { shape: 'ring', color: '#292720', label: '城市' },
  geology: { shape: 'diamond', color: '#7A6A4F', label: '地質' },
  ecology: { shape: 'diamond', color: '#4F7A5A', label: '生態' },
  water: { shape: 'drop', color: '#327D91', label: '水利' },
  museum: { shape: 'circle', color: '#244C79', label: '博物館' },
};

interface Props {
  kind: PlaceKind;
  lit: boolean;
  selected: boolean;
  opened: boolean;
  visited: boolean;
}

export function KindMarker({ kind, lit, selected, opened, visited }: Props) {
  const { shape, color } = kindStyle[kind];
  const s = selected ? 1.35 : 1;
  const fill = color;
  const common = {
    fill,
    stroke: lit ? '#F2C14E' : '#fff',
    strokeWidth: lit ? 3 : 2,
    opacity: opened || lit ? 1 : 0.88,
  };
  let el;
  switch (shape) {
    case 'triangle':
      el = <polygon points="0,-9 8.5,6 -8.5,6" {...common} />;
      break;
    case 'square':
      el = <rect x={-7} y={-7} width={14} height={14} rx={2} {...common} />;
      break;
    case 'diamond':
      el = <polygon points="0,-9 8,0 0,9 -8,0" {...common} />;
      break;
    case 'drop':
      el = <path d="M0,-10 C5,-3 7,1 7,3 A7,7 0 0 1 -7,3 C-7,1 -5,-3 0,-10Z" {...common} />;
      break;
    case 'ring':
      el = (
        <g>
          <circle r={8} {...common} />
          <circle r={3} fill="#fff" />
        </g>
      );
      break;
    default:
      el = <circle r={7.5} {...common} />;
  }
  return (
    <g transform={`scale(${s})`}>
      {lit && <circle r={15} className={styles.glow} />}
      {selected && <circle r={13} className={styles.selectedRing} />}
      {el}
      {visited && (
        <g transform="translate(7,-8)">
          <circle r={5} fill="#2E7D5B" stroke="#fff" strokeWidth={1.5} />
          <path d="M-2.2,0 L-0.6,1.8 L2.4,-1.6" stroke="#fff" strokeWidth={1.4} fill="none" />
        </g>
      )}
    </g>
  );
}
