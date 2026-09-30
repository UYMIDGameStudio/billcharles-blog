'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './ArticleFilter.module.css';

export type ArticleListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  dateTime: string;
  lang: string;
};

export default function ArticleFilter({ posts }: { posts: ArticleListItem[] }) {
  const categories = useMemo(() => Array.from(new Set(posts.map((post) => post.category))), [posts]);
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const visible = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return posts.filter((post) => {
      if (active !== null && post.category !== active) return false;
      const text = (post.title + ' ' + post.excerpt).toLocaleLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [posts, active, query]);
  const filtered = active !== null || query.length > 0;

  function resetFilters() {
    setActive(null);
    setQuery('');
    searchRef.current?.focus();
  }

  return (
    <section aria-label="Article archive" className={styles.archive}>
      <div className={styles.tools}>
        <fieldset className={styles.categories}>
          <legend className={styles.label}>Subject</legend>
          <div className={styles.categoryButtons}>
            {[null, ...categories].map((category) => (
              <button
                key={category ?? '__all__'}
                type="button"
                onClick={() => setActive(category)}
                aria-pressed={active === category}
                aria-controls="article-results"
                className={styles.category}
              >
                {category ?? 'All writing'}
              </button>
            ))}
          </div>
        </fieldset>
        <div className={styles.search}>
          <label htmlFor="article-search" className={styles.label}>Search the writing</label>
          <div className={styles.searchField}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              ref={searchRef}
              id="article-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Title or keyword"
              aria-controls="article-results"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); searchRef.current?.focus(); }}
                className={styles.clearSearch}
                aria-label="Clear search"
              >
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.resultBar}>
        <p role="status" aria-live="polite" aria-atomic="true">
          {filtered ? visible.length + ' of ' + posts.length : posts.length} {posts.length === 1 ? 'article' : 'articles'}
          <span className={styles.resultDetail}> · Newest first</span>
        </p>
        {filtered && <button type="button" onClick={resetFilters} className={styles.reset}>Reset filters</button>}
      </div>
      <div id="article-results" className={styles.results}>
        {visible.length > 0 ? visible.map((post) => (
          <article key={post.slug} className={styles.entry}>
            <div className={styles.metadata}>
              <time dateTime={post.dateTime}>{post.date}</time>
              <span>{post.category}</span>
            </div>
            <Link href={'/articles/' + encodeURIComponent(post.slug)} className={styles.articleLink}>
              <div className={styles.articleCopy}>
                <h2 lang={post.lang} className={styles.articleTitle}>{post.title}</h2>
                {post.excerpt && <p lang={post.lang} className={styles.excerpt}>{post.excerpt}</p>}
              </div>
              <span className={styles.arrow} aria-hidden="true">↗</span>
            </Link>
          </article>
        )) : (
          <div className={styles.noResults}>
            <h2>No matching articles</h2>
            <p>Try another word or clear the filters to browse all writing.</p>
            <button type="button" onClick={resetFilters} className={styles.showAll}>Show all writing <span aria-hidden="true">→</span></button>
          </div>
        )}
      </div>
    </section>
  );
}
