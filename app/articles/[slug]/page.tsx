// app/articles/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import SupportTip from '@/app/components/SupportTip';
import ReadingProgress from '@/app/components/ReadingProgress';
import { formatDisplayDate, getArticles, getPostBySlug } from '@/lib/posts';
import { PUBLICATIONS } from '@/lib/publications';
import {
  AUTHOR_ACADEMIC_NAME,
  AUTHOR_NAME,
  AUTHOR_NAME_HANZI,
  RSS_ALTERNATE_TYPES,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

type RouteParams = { slug: string };

function toIsoDate(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = getArticles();
  return posts.map((post) => ({ slug: encodeURIComponent(post.slug) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  const canonicalPath = `/articles/${encodeURIComponent(post.slug)}`;
  const publishedTime = toIsoDate(post.date);

  return {
    title: post.shortTitle ?? post.title,
    description: post.excerpt,
    alternates: { canonical: canonicalPath, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      title: post.title,
      description: post.excerpt,
      authors: [AUTHOR_NAME],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
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
        <section className="mx-auto max-w-2xl space-y-6 px-6 py-32 text-center">
          <p className="text-xs uppercase tracking-widest text-ink3">404</p>
          <h1 className="text-3xl font-normal tracking-tight text-ink md:text-4xl">
            Article not found
          </h1>
          <p className="leading-relaxed text-ink2">
            Looking for:{' '}
            <span className="font-mono text-ink">{decodeURIComponent(slug)}.md</span>
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 text-sm sm:flex-row">
            <Link href="/articles" className="text-ink3 underline transition-colors hover:text-accent">
              ← Back to articles
            </Link>
            <Link href="/" className="text-ink3 underline transition-colors hover:text-accent">
              ← Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const canonicalUrl = `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`;
  const publishedTime = toIsoDate(post.date);
  const inLanguage = /[一-鿿]/.test(post.title) ? 'zh-CN' : 'en-US';
  const cjkCount = post.content.match(/[一-鿿]/g)?.length ?? 0;
  const enCount = post.content.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  const wordCount = cjkCount + enCount;
  const readMinutes = Math.max(1, Math.round(cjkCount / 400 + enCount / 220));
  const readLabel = inLanguage === 'zh-CN' ? `约 ${readMinutes} 分钟` : `${readMinutes} min read`;

  const authorName = post.author ?? AUTHOR_NAME;
  const isAcademicByline = authorName !== AUTHOR_NAME; // only the flagship paper sets a custom author
  const authorAlt = isAcademicByline ? AUTHOR_NAME : AUTHOR_ACADEMIC_NAME;

  const publication = PUBLICATIONS.find((p) => p.articleSlug === post.slug);
  const isScholarly = Boolean(publication);

  // Adjacent articles for prev/next navigation (sorted newest-first).
  const all = getArticles();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': isScholarly ? 'ScholarlyArticle' : 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    articleSection: post.category,
    inLanguage,
    wordCount,
    image: {
      '@type': 'ImageObject',
      url: `${canonicalUrl}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    ...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
    ...(isScholarly && post.excerpt ? { abstract: post.excerpt } : {}),
    ...(publication && publication.links.length
      ? { sameAs: publication.links.map((l) => l.href) }
      : {}),
    author: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#author`,
      name: authorName,
      alternateName: authorAlt,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return (
    <main>
      <JsonLd data={[articleJsonLd, breadcrumbJsonLd]} />
      <SiteHeader activeNav="articles" />
      <ReadingProgress />

      <article className="mx-auto max-w-[720px] px-6" lang={inLanguage}>
        <header className="pt-16">
          <Link
            href="/articles"
            className="mb-9 inline-block text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
          >
            ← All articles
          </Link>

          <div className="mb-5 flex items-center gap-4 text-[13px] uppercase tracking-[0.06em] text-ink3">
            <span className="text-accent">{post.category}</span>
            <span className="h-px w-4 bg-line2" />
            <span>{formatDisplayDate(post.date)}</span>
            <span className="h-px w-4 bg-line2" />
            <span>{readLabel}</span>
          </div>

          <h1 className="text-[clamp(2.1rem,5vw,3.2rem)] font-normal leading-[1.12] tracking-[0.005em] text-ink">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-[1.2rem] italic leading-relaxed text-ink2">
              {post.excerpt}
            </p>
          )}

          <div className="mt-9 flex items-center gap-3.5 border-b border-ink pb-10">
            <span className="relative block h-[42px] w-[42px] flex-none overflow-hidden rounded-full border border-line2">
              <Image src="/image_0.png" alt={authorName} fill className="object-cover" />
            </span>
            <span>
              <span className="block text-base font-bold text-ink">
                {isAcademicByline ? `${authorName} (${AUTHOR_NAME_HANZI})` : authorName}
              </span>
              <Link
                href="/about"
                className="block text-[13px] tracking-[0.02em] text-ink3 transition-colors hover:text-accent"
              >
                {isAcademicByline ? `pen name ${AUTHOR_NAME} · About the author →` : 'About the author →'}
              </Link>
            </span>
          </div>

          {isAcademicByline && (
            <p className="mt-6 border-l-[3px] border-accent/40 pl-4 text-sm italic text-ink3">
              {authorName} ({AUTHOR_NAME_HANZI}) is the author&apos;s legal and academic name.{' '}
              {AUTHOR_NAME} is the pen name used on this site.
            </p>
          )}
        </header>

        <div className="pt-10">
          <MarkdownContent>{post.content}</MarkdownContent>
        </div>

        <SupportTip variant="compact" />

        {/* PREV / NEXT */}
        <nav className="mt-16 grid gap-4 sm:grid-cols-2">
          {newer ? (
            <Link
              href={`/articles/${encodeURIComponent(newer.slug)}`}
              className="block rounded-sm border border-line p-6 transition-colors hover:border-line2 hover:bg-surface"
            >
              <span className="mb-2.5 block text-xs uppercase tracking-[0.12em] text-ink3">
                ← Newer
              </span>
              <span className="block text-[18px] leading-snug text-ink">{newer.title}</span>
            </Link>
          ) : (
            <Link
              href="/articles"
              className="block rounded-sm border border-line p-6 transition-colors hover:border-line2 hover:bg-surface"
            >
              <span className="mb-2.5 block text-xs uppercase tracking-[0.12em] text-ink3">
                ← Index
              </span>
              <span className="block text-[18px] text-ink">All articles</span>
            </Link>
          )}
          {older && (
            <Link
              href={`/articles/${encodeURIComponent(older.slug)}`}
              className="block rounded-sm border border-line p-6 text-right transition-colors hover:border-line2 hover:bg-surface"
            >
              <span className="mb-2.5 block text-xs uppercase tracking-[0.12em] text-ink3">
                Older →
              </span>
              <span className="block text-[18px] leading-snug text-ink">{older.title}</span>
            </Link>
          )}
        </nav>

        <footer className="mt-12 flex justify-between border-t border-line pt-8 text-sm">
          <Link href="/articles" className="text-ink3 transition-colors hover:text-accent">
            ← Back to Archive
          </Link>
          <Link href="/" className="text-ink3 transition-colors hover:text-accent">
            Home →
          </Link>
        </footer>
      </article>

      <SiteFooter />
    </main>
  );
}
