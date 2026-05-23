import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import { formatDisplayDate, getArticles } from '@/lib/posts';

export const metadata = {
  title: 'Articles',
  description: 'Essays and articles by Bill Charles',
};

export default function ArticlesPage() {
  const posts = getArticles();

  return (
    <main>
      <SiteHeader activeNav="articles" />

      <section className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-12">
          Essays & Articles
        </h1>

        <div className="space-y-12">
          {posts.length === 0 ? (
            <p className="text-stone-500 italic">暂无文章，敬请期待…</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/articles/${encodeURIComponent(post.slug)}`}
                className="block group"
              >
                <article className="space-y-3">
                  <div className="flex items-center gap-4 text-xs font-mono text-stone-400 uppercase tracking-widest">
                    <span>{formatDisplayDate(post.date)}</span>
                    <span className="text-stone-200">/</span>
                    <span>{post.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold font-sans group-hover:text-stone-500 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-stone-600 leading-relaxed max-w-xl">
                      {post.excerpt}
                    </p>
                  )}
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
