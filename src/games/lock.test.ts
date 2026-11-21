import { describe, expect, it } from 'vitest';
import { SOLUTION, start, step, type Action, type Direction } from './lock';

const run = (d: Direction, actions: Action[]) => actions.reduce((s, a) => step(s, a).state, start(d));

describe('lock state machine', () => {
  it.each(['up', 'down'] as const)('solution for %s gets the boat through with no mistakes', (d) => {
    const s = run(d, SOLUTION[d]);
    expect(s.done).toBe(true);
    expect(s.mistakes).toBe(0);
    expect(s.steps).toBe(SOLUTION[d].length);
  });

  it('cannot open the upper gate while the chamber is low', () => {
    const r = step(start('up'), 'openHigh');
    expect(r.ok).toBe(false);
    expect(r.reason).toMatch(/水壓/);
    expect(r.state.highGate).toBe(false);
    expect(r.state.mistakes).toBe(1);
  });

  it('cannot fill while the lower gate is open', () => {
    const s = run('up', ['openLow']);
    const r = step(s, 'fill');
    expect(r.ok).toBe(false);
    expect(r.state.level).toBe('low');
  });

  it('cannot drain while the upper gate is open', () => {
    const s = run('down', ['fill', 'openHigh']);
    expect(step(s, 'drain').ok).toBe(false);
  });

  it('boat cannot pass a closed gate', () => {
    expect(step(start('up'), 'move').ok).toBe(false);
    const s = run('up', ['openLow', 'move', 'closeLow', 'fill']);
    expect(step(s, 'move').ok).toBe(false);
  });

  it('never has both gates open', () => {
    const all: Action[] = ['openLow', 'closeLow', 'openHigh', 'closeHigh', 'fill', 'drain', 'move'];
    let s = start('up');
    for (let i = 0; i < 500; i++) {
      s = step(s, all[(i * 7 + (i >> 2)) % all.length]).state;
      expect(s.lowGate && s.highGate).toBe(false);
      if (s.done) s = start(i % 2 ? 'up' : 'down');
    }
  });
});
