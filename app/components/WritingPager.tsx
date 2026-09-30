'use client';

import { useState } from 'react';
import Link from 'next/link';

export type WritingPage = {
  num: string;
  kicker: string;
  date: string;
  title: string;
  excerpt: string;
  href: string;
};

// Explicit navigation leaves wheel, touch scrolling and browser zoom native.
// Overlapping grid panels reserve the tallest panel's natural height at any text size.
export default function WritingPager({ pages }: { pages: WritingPage[] }) {
  const [selected, setSelected] = useState(0);
  if (!pages.length) return null;
  const page = Math.min(selected, pages.length - 1);

  return (
    <section id="writing" className="writing-section">
      <div className="section-heading">
        <h2 className="eyebrow">Selected writing</h2>
        <Link href="/articles" className="quiet-link">All articles <span aria-hidden>↗</span></Link>
      </div>
      <div className="writing-panels">
        {pages.map((post, i) => (
          <article key={post.href} className={'writing-panel' + (i === page ? ' is-active' : '')} aria-hidden={i !== page} inert={i !== page}>
            <div className="writing-meta">
              <span className="writing-number" aria-hidden>{post.num}</span>
              <span className="eyebrow text-accent">{post.kicker}</span>
              <span>{post.date}</span>
            </div>
            <div className="min-w-0">
              <h3 className="writing-title"><Link href={post.href}>{post.title}</Link></h3>
              {post.excerpt && <p className="writing-excerpt">{post.excerpt}</p>}
              <Link href={post.href} className="text-link">Read article <span aria-hidden>↗</span></Link>
            </div>
          </article>
        ))}
      </div>
      <div className="writing-controls">
        <span className="writing-status" role="status" aria-live="polite">{String(page + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</span>
        <div className="flex flex-wrap gap-2">
          <button className="icon-control" type="button" onClick={() => setSelected(page - 1)} disabled={page === 0} aria-label="Previous article">←</button>
          <button className="icon-control" type="button" onClick={() => setSelected(page + 1)} disabled={page === pages.length - 1} aria-label="Next article">→</button>
        </div>
      </div>
    </section>
  );
}
