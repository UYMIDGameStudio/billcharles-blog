import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { getTopics } from '@/lib/topics';
import { RSS_ALTERNATE_TYPES, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/site-map`,
    title: 'Site Map',
    description: 'All pages and articles on BillCharles Blog',
  },
  title: 'Site Map',
  description: 'All pages and articles on BillCharles Blog',
  alternates: { canonical: '/site-map', types: RSS_ALTERNATE_TYPES },
};

export default function SiteMapPage() {
  const articles = getArticles();
  const topics = getTopics();

  return (
    <main>
      <SiteHeader />

      <section className="max-w-2xl mx-auto px-6 py-20 space-y-12">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold font-sans tracking-tight text-ink">
            Site Map
          </h1>
          <p className="text-ink2 font-serif leading-relaxed">
            A complete index of this site. Search engines use{' '}
            <a
              href="/sitemap.xml"
              className="text-ink underline hover:text-accent transition-colors"
            >
              sitemap.xml
            </a>
            .
          </p>
        </header>

        <div className="space-y-10 font-sans">
          <section aria-labelledby="pages-heading">
            <h2
              id="pages-heading"
              className="text-sm font-mono uppercase tracking-widest text-ink3 mb-4"
            >
              Pages
            </h2>
            <ul className="space-y-2 text-ink2">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="hover:text-accent transition-colors"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/topics" className="hover:text-accent transition-colors">
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/publications" className="hover:text-accent transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="hover:text-accent transition-colors">
                  Editorial Standards &amp; Corrections
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/site-map" className="hover:text-accent transition-colors">
                  Site Map
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="topics-heading">
            <h2
              id="topics-heading"
              className="text-sm font-mono uppercase tracking-widest text-ink3 mb-4"
            >
              Topics ({topics.length})
            </h2>
            <ul className="space-y-2 text-ink2">
              {topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/topics/${topic.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {topic.name}
                  </Link>
                  <span className="ml-2 text-xs font-mono text-ink3">
                    {topic.posts.length}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="articles-heading">
            <h2
              id="articles-heading"
              className="text-sm font-mono uppercase tracking-widest text-ink3 mb-4"
            >
              Articles ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p className="text-ink3 italic font-serif">暂无文章</p>
            ) : (
              <ul className="space-y-4">
                {articles.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/articles/${encodeURIComponent(post.slug)}`}
                      className="block group"
                    >
                      <span className="font-medium text-ink group-hover:text-accent transition-colors">
                        {post.title}
                      </span>
                      {post.date && (
                        <span className="ml-2 text-xs font-mono text-ink3">
                          {formatDisplayDate(post.date)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="text-xs font-mono text-ink3 pt-8 border-t border-line">
          Canonical: {SITE_URL}
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
