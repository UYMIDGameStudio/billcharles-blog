import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import ArticleFilter, { type ArticleListItem } from '@/app/components/ArticleFilter';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { RSS_ALTERNATE_TYPES, SITE_NAME, SITE_URL } from '@/lib/site';
import styles from './archive.module.css';

const description = 'Essays and articles by Bill Charles';

export const metadata: Metadata = {
  title: 'Articles',
  description,
  alternates: { canonical: '/articles', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: SITE_URL + '/articles',
    siteName: SITE_NAME,
    title: 'Articles',
    description,
  },
};

export default function ArticlesPage() {
  const posts = getArticles();
  const items: ArticleListItem[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? '',
    category: post.category,
    date: formatDisplayDate(post.date),
    dateTime: post.date,
    lang: post.lang,
  }));

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Essays & Articles',
    url: SITE_URL + '/articles',
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: SITE_URL + '/articles/' + encodeURIComponent(post.slug),
        name: post.title,
      })),
    },
  };

  return (
    <main>
      <JsonLd data={listJsonLd} />
      <SiteHeader activeNav="articles" />
      <div className={styles.container}>
        <header className={styles.heading}>
          <div className={styles.kicker}>
            <p>Index of writing</p>
            <p>{posts.length} {posts.length === 1 ? 'article' : 'articles'}</p>
          </div>
          <h1 className={styles.title}>Essays &amp; Articles<span aria-hidden="true">.</span></h1>
          <div className={styles.introduction}>
            <p>
              Philosophy, cryptography, and the questions in between.
              Long-form writing, collected and dated.
            </p>
            <Link href="/topics" className={styles.topicsLink}>
              Browse by topic <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        {posts.length === 0 ? (
          <p className={styles.empty}>The first article will appear here soon.</p>
        ) : (
          <ArticleFilter posts={items} />
        )}
      </div>
      <SiteFooter />
    </main>
  );
}
