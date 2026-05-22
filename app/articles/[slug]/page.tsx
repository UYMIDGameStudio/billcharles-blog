// app/articles/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import SiteHeader from '@/app/components/SiteHeader';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type RouteParams = { slug: string };

// SSG: 预渲染所有文章路由
export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = getAllPosts();
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
      <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        <p className="text-stone-500 mb-8 font-sans text-sm">
          Looking for:{' '}
          <span className="font-mono text-red-600">
            {decodeURIComponent(slug)}.md
          </span>
        </p>
        <Link
          href="/articles"
          className="text-stone-500 hover:text-stone-900 underline"
        >
          Return to articles
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif selection:bg-stone-200">
      <SiteHeader activeNav="articles" />

      <article className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-4 text-sm font-sans text-stone-500 uppercase tracking-widest">
            <span>{post.date}</span>
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

        <section className="prose prose-stone prose-lg max-w-none prose-p:leading-[1.8] prose-headings:font-sans prose-headings:font-bold prose-h2:text-2xl prose-h2:pt-8 prose-h2:mt-0 prose-h3:text-xl prose-h3:pt-6 prose-h3:text-stone-800 prose-h4:text-lg prose-h4:text-stone-600 prose-a:text-stone-600 prose-blockquote:border-l-4 prose-blockquote:border-stone-300 prose-blockquote:pl-6 py-2 prose-blockquote:italic prose-blockquote:text-stone-600 prose-blockquote:bg-stone-100/50 prose-blockquote:rounded-r-lg">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </section>

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
