/**
 * Felucca on the Nile, reduced to one axis. Positive = south (upstream).
 * The river always flows north; the prevailing wind blows from the north (pushes south).
 * Numbers are relative speeds for the animation, not km/h.
 */
export type Goal = 'south' | 'north';
export type Sail = 'up' | 'down';
export type Wind = 'north' | 'calm';

export const CURRENT = -1;
/** Running before a north wind. */
export const DOWNWIND = 3;
/** Tacking into the wind: zigzag gains a little northward on top of the current. */
export const TACK = -1;

export interface Outcome {
  /** Net speed, + south / - north. */
  net: number;
  /** Did the boat end up going where it wanted? */
  ok: boolean;
  zigzag: boolean;
  reason: string;
}

export function sail(goal: Goal, sail: Sail, wind: Wind): Outcome {
  const windy = wind === 'north' && sail === 'up';
  const zigzag = windy && goal === 'north';
  const push = !windy ? 0 : goal === 'south' ? DOWNWIND : TACK;
  const net = CURRENT + push;
  const ok = goal === 'south' ? net > 0 : net < 0;
  let reason: string;
  if (goal === 'south') {
    if (ok) reason = '北風推著帆，力量大過水流，船逆流往南走。';
    else if (sail === 'up') reason = '沒有風，帆鼓不起來，船被河水往北帶走。';
    else reason = '收著帆，只剩河水的力量，船往北漂回去了。';
  } else if (zigzag) reason = '順著水流，再揚帆斜著迎風走之字形，往北走得更快。';
  else reason = '不用帆，河水自己會把船帶往北邊（下游）。';
  return { net, ok, zigzag, reason };
}
