import type { Metadata } from 'next';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import ArticleFilter, { type ArticleListItem } from '@/app/components/ArticleFilter';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { RSS_ALTERNATE_TYPES, SITE_NAME, SITE_URL } from '@/lib/site';

const description = 'Essays and articles by Bill Charles';

export const metadata: Metadata = {
  title: 'Articles',
  description,
  alternates: { canonical: '/articles', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/articles`,
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
  }));

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Essays & Articles',
    url: `${SITE_URL}/articles`,
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`,
        name: post.title,
      })),
    },
  };

  return (
    <main>
      <JsonLd data={listJsonLd} />
      <SiteHeader activeNav="articles" />

      <div className="mx-auto max-w-[1080px] px-6 md:px-8">
        {/* PAGE HEAD */}
        <section className="border-b border-ink py-20">
          <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-accent">
            Index of Writing
          </p>
          <h1 className="text-[clamp(2.6rem,6vw,3.75rem)] font-normal leading-[1.04] tracking-tight text-ink">
            Essays &amp; Articles
          </h1>
          <p className="mt-5 max-w-[40em] text-[19px] leading-relaxed text-ink2">
            Long-form essays, philosophical notes, and research on cryptography —
            collected and dated. <span className="italic">凡所记述，皆为求真。</span>
          </p>
        </section>

        {posts.length === 0 ? (
          <p className="py-20 italic text-ink3">暂无文章，敬请期待…</p>
        ) : (
          <ArticleFilter posts={items} />
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
