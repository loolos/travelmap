import { describe, expect, it } from 'vitest';
import { endings, nodes } from './bargain';

describe('bargain scene', () => {
  it('every path ends at a graded ending with a lesson', () => {
    const ends = endings();
    expect(ends.length).toBeGreaterThan(5);
    for (const e of ends) {
      expect(nodes[e].grade).toBeDefined();
      expect(nodes[e].lesson).toBeTruthy();
    }
  });

  it('has at least one best ending reachable', () => {
    expect(endings().some((e) => nodes[e].grade === 3)).toBe(true);
  });
});
