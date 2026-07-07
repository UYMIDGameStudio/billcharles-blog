'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export type WritingPage = {
  num: string;
  kicker: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

/**
 * Wheel/touch-paged article reader.
 * - Desktop: mouse wheel inside the panel flips pages; at the first/last page
 *   the wheel passes through so normal page scrolling resumes.
 * - Mobile: vertical swipe flips pages with the same edge pass-through, and
 *   the arrow buttons / dots always work as a fallback.
 */
export default function WritingPager({ pages }: { pages: WritingPage[] }) {
  const [page, setPage] = useState(0);
  const boxRef = useRef<HTMLDivElement | null>(null);

  // Refs mirror state so the non-passive listeners never go stale.
  const pageRef = useRef(0);
  const lockRef = useRef(0);
  const touchY = useRef<number | null>(null);
  const touchDone = useRef(false);
  pageRef.current = page;

  const go = (i: number) => {
    lockRef.current = Date.now();
    setPage(Math.max(0, Math.min(pages.length - 1, i)));
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const max = pages.length - 1;

    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 4 ? 1 : e.deltaY < -4 ? -1 : 0;
      if (!dir) return;
      const target = pageRef.current + dir;
      if (target < 0 || target > max) return; // edge: let the page scroll
      e.preventDefault();
      const now = Date.now();
      if (now - lockRef.current < 700) return;
      lockRef.current = now;
      setPage(target);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchY.current = e.touches[0].clientY;
      touchDone.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchY.current == null || touchDone.current) return;
      const dy = touchY.current - e.touches[0].clientY;
      if (Math.abs(dy) < 32) return;
      const dir = dy > 0 ? 1 : -1;
      const target = pageRef.current + dir;
      if (target < 0 || target > max) return; // edge: let the page scroll
      e.preventDefault();
      touchDone.current = true;
      lockRef.current = Date.now();
      setPage(target);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [pages.length]);

  if (pages.length === 0) return null;

  return (
    <section id="writing" className="scroll-mt-20 pt-20">
      <div className="flex items-baseline justify-between border-b border-ink pb-3.5">
        <h2 className="text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
          Writing
        </h2>
        <span className="text-xs text-ink3">
          {String(page + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}
          <span className="hidden sm:inline"> &nbsp;·&nbsp; scroll to browse ↓</span>
          <span className="sm:hidden"> &nbsp;·&nbsp; swipe ↓</span>
        </span>
      </div>

      <div
        ref={boxRef}
        className="relative h-[470px] touch-pan-y overflow-hidden border-b border-line md:h-[440px]"
      >
        {/* sliding track */}
        <div
          className="h-full will-change-transform transition-transform duration-[650ms] ease-[cubic-bezier(.22,.61,.36,1)]"
          style={{ transform: `translateY(-${page * 100}%)` }}
        >
          {pages.map((pg) => (
            <article
              key={pg.num}
              className="grid h-full content-center gap-4 pr-14 md:grid-cols-[120px_1fr] md:gap-10 md:pr-24"
            >
              <div className="text-xs leading-relaxed text-ink3">
                <div className="mb-1 text-[26px] italic leading-none text-line2 md:mb-3.5 md:text-[30px]">
                  {pg.num}
                </div>
                <div className="uppercase tracking-[0.1em] text-accent">
                  {pg.kicker}
                </div>
                <div>{pg.date}</div>
              </div>
              <div>
                <h3 className="text-[clamp(1.4rem,4.5vw,2.3rem)] font-normal leading-[1.16] tracking-tight text-ink">
                  {pg.title}
                </h3>
                {pg.excerpt && (
                  <p className="mt-3 line-clamp-4 max-w-[42em] text-[15px] leading-relaxed text-ink2 md:mt-4 md:text-[17px]">
                    {pg.excerpt}
                  </p>
                )}
                <Link
                  href={pg.href}
                  className="mt-4 inline-block border-b border-accent/40 pb-0.5 text-xs tracking-wide text-accent transition-colors hover:border-accent md:mt-6"
                >
                  Read article →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* right rail: arrows + dots */}
        <div className="absolute bottom-0 right-0 top-0 flex flex-col items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(page - 1)}
            disabled={page === 0}
            aria-label="Previous article"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line2 text-sm text-ink2 transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35"
          >
            ↑
          </button>
          <div className="flex flex-col gap-2.5 py-1.5">
            {pages.map((pg, i) => (
              <button
                key={pg.num}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${pg.title}`}
                aria-current={i === page ? 'true' : undefined}
                className={
                  'h-2 w-2 rounded-full transition-all ' +
                  (i === page ? 'scale-[1.35] bg-accent' : 'bg-line2 hover:bg-ink3')
                }
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(page + 1)}
            disabled={page === pages.length - 1}
            aria-label="Next article"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line2 text-sm text-ink2 transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35"
          >
            ↓
          </button>
        </div>
      </div>

      <div className="pt-6 text-center">
        <Link
          href="/articles"
          className="text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
        >
          View all articles →
        </Link>
      </div>
    </section>
  );
}
