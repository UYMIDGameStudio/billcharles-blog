'use client';

import { useEffect, useRef } from 'react';
import { articleReadingProgress } from '@/lib/reading-progress';

// Decorative progress follows the prose alone, not recommendations or the footer.
export default function ReadingProgress({ targetId }: { targetId: string }) {
  const fill = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = document.getElementById(targetId);
    if (!body) return;
    const article = body.closest('article');
    const header = document.querySelector('.site-header');
    const previousOffset = article?.style.getPropertyValue('--header-offset') ?? '';
    const previousOffsetPriority = article?.style.getPropertyPriority('--header-offset') ?? '';
    let headerOffset = -1;
    let frame = 0;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (!fill.current || !track.current) return;
      const headerPosition = header ? getComputedStyle(header).position : 'static';
      const nextOffset = header && (headerPosition === 'sticky' || headerPosition === 'fixed')
        ? header.getBoundingClientRect().height
        : 0;
      if (nextOffset !== headerOffset) {
        headerOffset = nextOffset;
        // Follow the rendered height when navigation wraps or text is enlarged.
        track.current.style.top = headerOffset + 'px';
        article?.style.setProperty('--header-offset', headerOffset + 'px');
      }
      const rect = body.getBoundingClientRect();
      const pct = articleReadingProgress({
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
        readingTop: Math.max(0, track.current.getBoundingClientRect().bottom),
      });
      fill.current.style.transform = 'scaleX(' + pct / 100 + ')';
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(body);
    // A collapsed outline, font change, or resized heading can move the prose.
    if (article) observer.observe(article);
    if (header) observer.observe(header);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (previousOffset) article?.style.setProperty('--header-offset', previousOffset, previousOffsetPriority);
      else article?.style.removeProperty('--header-offset');
    };
  }, [targetId]);

  return (
    <div ref={track} aria-hidden="true" className="reading-progress sticky top-[var(--header-offset)] z-40 h-0.5 bg-transparent">
      <div ref={fill} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
