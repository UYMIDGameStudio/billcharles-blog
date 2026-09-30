import { describe, expect, it } from 'vitest';
import { articleReadingProgress } from '../lib/reading-progress';

describe('prose reading progress', () => {
  const view = { viewportHeight: 800, readingTop: 80 };
  it('starts when the first prose line reaches the reading edge', () => {
    expect(articleReadingProgress({ ...view, top: 600, bottom: 2600 })).toBe(0);
    expect(articleReadingProgress({ ...view, top: 80, bottom: 2080 })).toBe(0);
  });
  it('ends when the final prose line enters view, regardless of following content', () => {
    expect(articleReadingProgress({ ...view, top: -1200, bottom: 800 })).toBe(100);
    expect(articleReadingProgress({ ...view, top: -1400, bottom: 600 })).toBe(100);
  });
  it('recalculates the distance for viewport changes', () => {
    const position = { top: -400, bottom: 1600, readingTop: 80 };
    expect(articleReadingProgress({ ...position, viewportHeight: 800 })).toBe(37.5);
    expect(articleReadingProgress({ ...position, viewportHeight: 1120 })).toBe(50);
  });
  it('handles short articles and zero-height content without invalid percentages', () => {
    expect(articleReadingProgress({ ...view, top: 600, bottom: 1000 })).toBe(0);
    expect(articleReadingProgress({ ...view, top: 100, bottom: 500 })).toBe(100);
    expect(articleReadingProgress({ ...view, top: 100, bottom: 100 })).toBe(100);
  });
});
