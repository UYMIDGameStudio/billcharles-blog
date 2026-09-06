'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type ArticleListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // pre-formatted display date
};

export default function ArticleFilter({ posts }: { posts: ArticleListItem[] }) {
  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, [posts]);

  const [active, setActive] = useState('All');
  const visible = active === 'All' ? posts : posts.filter((p) => p.category === active);

  return (
    <>
      {/* FILTER ROW */}
      <div className="flex flex-wrap items-center gap-3.5 border-b border-line py-5">
        <span className="text-xs uppercase tracking-[0.16em] text-ink3">Filter</span>
        <div className="flex flex-wrap gap-2.5">
          {categories.map((c) => {
            const on = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={on}
                className={
                  'rounded-full border px-4 py-1.5 text-sm tracking-wide transition-colors ' +
                  (on
                    ? 'border-accent bg-accent text-on-accent'
                    : 'border-line2 text-ink2 hover:border-accent hover:text-accent')
                }
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* LIST */}
      <div className="pb-10">
        {visible.map((post, i) => (
          <Link
            key={post.slug}
            href={`/articles/${encodeURIComponent(post.slug)}`}
            className="group grid grid-cols-1 gap-2 border-b border-line py-8 pr-3 transition-[background,padding] duration-200 hover:bg-surface hover:pl-3.5 sm:grid-cols-[64px_150px_1fr_30px] sm:items-baseline sm:gap-7"
          >
            <span className="hidden text-[15px] italic text-ink3 sm:block">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex gap-2.5 text-[12.5px] leading-relaxed tracking-[0.03em] text-ink3 sm:block">
              <span className="sm:block">{post.date}</span>
              <span className="uppercase tracking-[0.1em] text-accent sm:block">
                {post.category}
              </span>
            </span>
            <span>
              <span className="mb-2.5 block text-[1.7rem] font-normal leading-snug tracking-[-0.005em] text-ink">
                {post.title}
              </span>
              {post.excerpt && (
                <span className="block max-w-[48em] text-base leading-relaxed text-ink2">
                  {post.excerpt}
                </span>
              )}
            </span>
            <span className="hidden text-right text-xl text-ink3 transition-colors group-hover:text-accent sm:block">
              →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
