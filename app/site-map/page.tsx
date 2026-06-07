import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import { formatDisplayDate, getArticles, getNotes } from '@/lib/posts';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Site Map',
  description: 'All pages and articles on BillCharles Blog',
  alternates: { canonical: '/site-map' },
};

export default function SiteMapPage() {
  const articles = getArticles();
  const notes = getNotes();

  return (
    <main>
      <SiteHeader />

      <section className="max-w-2xl mx-auto px-6 py-20 space-y-12">
        <header className="space-y-3">
          <h1 className="text-4xl font-bold font-sans tracking-tight text-stone-900">
            Site Map
          </h1>
          <p className="text-stone-600 font-serif leading-relaxed">
            A complete index of this site. Search engines use{' '}
            <a
              href="/sitemap.xml"
              className="text-stone-800 underline hover:text-stone-600 transition-colors"
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
              className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-4"
            >
              Pages
            </h2>
            <ul className="space-y-2 text-stone-800">
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
                <Link href="/notes" className="hover:text-accent transition-colors">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </section>

          <section aria-labelledby="articles-heading">
            <h2
              id="articles-heading"
              className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-4"
            >
              Articles ({articles.length})
            </h2>
            {articles.length === 0 ? (
              <p className="text-stone-500 italic font-serif">暂无文章</p>
            ) : (
              <ul className="space-y-4">
                {articles.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/articles/${encodeURIComponent(post.slug)}`}
                      className="block group"
                    >
                      <span className="font-medium text-stone-900 group-hover:text-accent transition-colors">
                        {post.title}
                      </span>
                      {post.date && (
                        <span className="ml-2 text-xs font-mono text-stone-400">
                          {formatDisplayDate(post.date)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="notes-heading">
            <h2
              id="notes-heading"
              className="text-sm font-mono uppercase tracking-widest text-stone-400 mb-4"
            >
              Notes ({notes.length})
            </h2>
            {notes.length === 0 ? (
              <p className="text-stone-500 italic font-serif">暂无笔记</p>
            ) : (
              <ul className="space-y-4">
                {notes.map((note) => (
                  <li key={note.slug}>
                    <Link href={`/notes/${note.slug}`} className="block group">
                      <span className="font-medium text-stone-900 group-hover:text-accent transition-colors">
                        {note.title}
                      </span>
                      {note.date && (
                        <span className="ml-2 text-xs font-mono text-stone-400">
                          {formatDisplayDate(note.date)}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <p className="text-xs font-mono text-stone-400 pt-8 border-t border-stone-200">
          Canonical: {SITE_URL}
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}
