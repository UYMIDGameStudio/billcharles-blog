// app/articles/[slug]/page.tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import SupportTip from '@/app/components/SupportTip';
import ReadingProgress from '@/app/components/ReadingProgress';
import { formatDisplayDate, getArticles, getPostBySlug, ogLocale } from '@/lib/posts';
import { PUBLICATIONS } from '@/lib/publications';
import { topicSlug } from '@/lib/topics';
import {
  AUTHOR_ACADEMIC_NAME,
  AUTHOR_NAME,
  AUTHOR_NAME_HANZI,
  ORGANIZATION_SCHEMA,
  PERSON_SCHEMA,
  RSS_ALTERNATE_TYPES,
  SITE_NAME,
  SITE_URL,
  WEBSITE_SCHEMA,
} from '@/lib/site';

type RouteParams = { slug: string };

function toIsoDate(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function withoutContext(document: Record<string, unknown>): Record<string, unknown> {
  const node = { ...document };
  delete node['@context'];
  return node;
}

function worksCitedUrls(content: string): string[] {
  const worksCited = content.split(/## Works Cited\s*/i)[1];
  if (!worksCited) return [];
  const urls = worksCited.match(/https?:\/\/[^\s)]+/g) ?? [];
  return [...new Set(urls.map((url) => url.replace(/[.,;]+$/, '')))];
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  const posts = getArticles();
  return posts.map((post) => ({ slug: post.slug }));
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
  const modifiedTime = post.updated ? toIsoDate(post.updated) : undefined;

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
      locale: ogLocale(post.lang),
      section: post.category,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
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
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`;
  const publishedTime = toIsoDate(post.date);
  const modifiedTime = post.updated ? toIsoDate(post.updated) : undefined;
  const inLanguage = post.lang;
  const isChinese = inLanguage.startsWith('zh');
  const cjkCount = post.content.match(/[一-鿿]/g)?.length ?? 0;
  const enCount = post.content.match(/[A-Za-z0-9]+/g)?.length ?? 0;
  const wordCount = cjkCount + enCount;
  const readMinutes = Math.max(1, Math.round(cjkCount / 400 + enCount / 220));
  const readLabel = isChinese
    ? inLanguage === 'zh-Hant'
      ? `約 ${readMinutes} 分鐘`
      : `约 ${readMinutes} 分钟`
    : `${readMinutes} min read`;

  const authorName = post.author ?? AUTHOR_NAME;
  const isAcademicByline = authorName !== AUTHOR_NAME; // only the flagship paper sets a custom author
  const authorAlt = isAcademicByline ? AUTHOR_NAME : AUTHOR_ACADEMIC_NAME;

  const publication = PUBLICATIONS.find((p) => p.articleSlug === post.slug);
  const isScholarly = Boolean(publication);
  const citations = isScholarly ? worksCitedUrls(post.content) : [];

  // Adjacent articles for prev/next navigation (sorted newest-first).
  const all = getArticles();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  // Same-topic reading, skipping whatever prev/next already links to.
  const adjacent = new Set([newer?.slug, older?.slug, post.slug]);
  const related = all
    .filter((p) => p.category === post.category && !adjacent.has(p.slug))
    .slice(0, 3);
  const topicHref = `/topics/${topicSlug(post.category)}`;

  const articleJsonLd = {
    '@type': isScholarly ? 'ScholarlyArticle' : 'BlogPosting',
    '@id': `${canonicalUrl}#article`,
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
    isPartOf: publication
      ? [
          { '@id': `${SITE_URL}/#website` },
          { '@type': 'CreativeWorkSeries', name: publication.venue },
        ]
      : { '@id': `${SITE_URL}/#website` },
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    ...(isScholarly && post.excerpt ? { abstract: post.excerpt } : {}),
    ...(publication
      ? {
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'DOI',
            value: publication.doi,
          },
          version: publication.version,
        }
      : {}),
    ...(citations.length ? { citation: citations } : {}),
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
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `${SITE_URL}/articles` },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      articleJsonLd,
      breadcrumbJsonLd,
      withoutContext(WEBSITE_SCHEMA),
      withoutContext(ORGANIZATION_SCHEMA),
      withoutContext(PERSON_SCHEMA),
    ],
  };

  return (
    <main>
      <JsonLd data={pageJsonLd} />
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
            <Link
              href={`/topics/${topicSlug(post.category)}`}
              className="text-accent transition-colors hover:text-ink"
            >
              {post.category}
            </Link>
            <span className="h-px w-4 bg-line2" />
            <span>{formatDisplayDate(post.date)}</span>
            {post.updated && (
              <>
                <span className="h-px w-4 bg-line2" />
                <span>Updated {formatDisplayDate(post.updated)}</span>
              </>
            )}
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

        {/* RELATED — same topic, so readers (and crawlers) move sideways
            through the archive instead of only backwards in time. */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-8">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[11px] uppercase tracking-[0.16em] text-ink3">
                More in {post.category}
              </h2>
              <Link
                href={topicHref}
                className="text-xs uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
              >
                All {post.category} →
              </Link>
            </div>
            <ul>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/articles/${encodeURIComponent(r.slug)}`}
                    className="block border-b border-line py-4 transition-[background,padding] duration-200 hover:bg-surface hover:pl-3"
                  >
                    <span className="block text-[17px] leading-snug text-ink">
                      {r.title}
                    </span>
                    <span className="mt-1 block text-[12px] text-ink3">
                      {formatDisplayDate(r.date)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

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
