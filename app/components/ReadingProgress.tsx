'use client';

import { useEffect, useState } from 'react';

// Thin claret bar that fills as the reader scrolls the article.
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight || 1;
      setPct(Math.min(100, Math.max(0, (el.scrollTop / max) * 100)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="sticky top-[66px] z-40 h-0.5 bg-transparent">
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
