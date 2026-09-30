/** Progress through the article body, ending when its last line enters view. */
export function articleReadingProgress({ top, bottom, viewportHeight, readingTop }: {
  top: number;
  bottom: number;
  viewportHeight: number;
  readingTop: number;
}): number {
  const distance = bottom - top - Math.max(0, viewportHeight - readingTop);
  if (distance <= 0) return bottom <= viewportHeight ? 100 : 0;
  return Math.min(100, Math.max(0, ((readingTop - top) / distance) * 100));
}
