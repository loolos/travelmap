/**
 * 「操作船閘」狀態機。閘室在下游（低）與上游（高）之間；
 * 規則都是真實船閘的物理限制：水位不同時閘門打不開、閘門開著時灌不滿也放不乾。
 */

export type Direction = 'up' | 'down';
export type BoatAt = 'low' | 'chamber' | 'high';
export type Action = 'openLow' | 'closeLow' | 'openHigh' | 'closeHigh' | 'fill' | 'drain' | 'move';

export interface LockState {
  direction: Direction;
  boat: BoatAt;
  level: 'low' | 'high';
  lowGate: boolean;
  highGate: boolean;
  steps: number;
  mistakes: number;
  done: boolean;
}

export interface StepResult {
  state: LockState;
  ok: boolean;
  /** Why an action was refused (shown to the player). */
  reason?: string;
}

export const actionLabel: Record<Action, string> = {
  openLow: '開下游閘門',
  closeLow: '關下游閘門',
  openHigh: '開上游閘門',
  closeHigh: '關上游閘門',
  fill: '閘室灌水',
  drain: '閘室放水',
  move: '船前進',
};

export function start(direction: Direction): LockState {
  return {
    direction,
    boat: direction === 'up' ? 'low' : 'high',
    level: 'low',
    lowGate: false,
    highGate: false,
    steps: 0,
    mistakes: 0,
    done: false,
  };
}

const path: Record<Direction, BoatAt[]> = { up: ['low', 'chamber', 'high'], down: ['high', 'chamber', 'low'] };

export function step(s: LockState, a: Action): StepResult {
  const no = (reason: string): StepResult => ({ state: { ...s, mistakes: s.mistakes + 1 }, ok: false, reason });
  const yes = (patch: Partial<LockState>): StepResult => {
    const next = { ...s, ...patch, steps: s.steps + 1 };
    next.done = next.boat === path[s.direction][2];
    return { state: next, ok: true };
  };
  if (s.done) return { state: s, ok: false, reason: '船已經通過船閘了。' };

  switch (a) {
    case 'openLow':
      if (s.lowGate) return no('下游閘門已經開著。');
      if (s.level !== 'low') return no('閘室水位比下游高，水壓把閘門緊緊壓住，打不開。先把閘室的水放掉。');
      return yes({ lowGate: true });
    case 'openHigh':
      if (s.highGate) return no('上游閘門已經開著。');
      if (s.level !== 'high') return no('閘室水位比上游低，水壓把閘門緊緊壓住，打不開。先把閘室灌滿。');
      return yes({ highGate: true });
    case 'closeLow':
      if (!s.lowGate) return no('下游閘門本來就關著。');
      return yes({ lowGate: false });
    case 'closeHigh':
      if (!s.highGate) return no('上游閘門本來就關著。');
      return yes({ highGate: false });
    case 'fill':
      if (s.level === 'high') return no('閘室已經和上游一樣高了。');
      if (s.lowGate) return no('下游閘門還開著，灌進來的水會直接流走，水位升不起來。');
      return yes({ level: 'high' });
    case 'drain':
      if (s.level === 'low') return no('閘室已經和下游一樣低了。');
      if (s.highGate) return no('上游閘門還開著，河水會一直流進來，放不完。');
      return yes({ level: 'low' });
    case 'move': {
      const i = path[s.direction].indexOf(s.boat);
      const next = path[s.direction][i + 1];
      const gateOpen = (s.boat === 'low' || next === 'low') ? s.lowGate : s.highGate;
      if (!gateOpen) return no('前面的閘門還關著，船過不去。');
      return yes({ boat: next });
    }
  }
}

/** Shortest correct sequence (for tests and the explanation). */
export const SOLUTION: Record<Direction, Action[]> = {
  up: ['openLow', 'move', 'closeLow', 'fill', 'openHigh', 'move'],
  down: ['fill', 'openHigh', 'move', 'closeHigh', 'drain', 'openLow', 'move'],
};
