// app/articles/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import { formatDisplayDate, getArticles, getPostBySlug } from '@/lib/posts';

type RouteParams = { slug: string };

// SSG: 预渲染所有文章路由
export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = getArticles();
  return posts.map((post) => ({ slug: encodeURIComponent(post.slug) }));
}

// 动态 <title> / OG meta
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main>
        <SiteHeader activeNav="articles" />
        <section className="max-w-2xl mx-auto px-6 py-32 text-center space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
            404
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-stone-900">
            Article not found
          </h1>
          <p className="text-stone-600 font-serif leading-relaxed">
            Looking for:{' '}
            <span className="font-mono text-stone-800">
              {decodeURIComponent(slug)}.md
            </span>
          </p>
          <div className="pt-4 font-sans text-sm flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/articles"
              className="text-stone-500 hover:text-stone-900 underline transition-colors"
            >
              ← Back to articles
            </Link>
            <Link
              href="/"
              className="text-stone-500 hover:text-stone-900 underline transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <SiteHeader activeNav="articles" />

      <article className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-4 text-sm font-sans text-stone-500 uppercase tracking-widest">
            <span>{formatDisplayDate(post.date)}</span>
            <span className="w-1 h-1 bg-stone-300 rounded-full" />
            <span>{post.category}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-sans text-stone-900 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-stone-500 italic font-serif leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        <MarkdownContent>{post.content}</MarkdownContent>

        <footer className="mt-20 pt-10 border-t border-stone-200 flex justify-between font-sans text-sm">
          <Link
            href="/articles"
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            ← Back to Archive
          </Link>
        </footer>
      </article>
    </main>
  );
}
