import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { formatDisplayDate } from '@/lib/posts';
import { getTopic, getTopics } from '@/lib/topics';
import { RSS_ALTERNATE_TYPES, SITE_NAME, SITE_URL } from '@/lib/site';

type RouteParams = { topic: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getTopics().map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return { title: 'Topic Not Found' };

  const canonicalPath = `/topics/${topic.slug}`;
  return {
    title: topic.name,
    description: topic.description,
    alternates: { canonical: canonicalPath, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      title: topic.name,
      description: topic.description,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);

  if (!topic) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/topics/${topic.slug}`;
  const others = getTopics().filter((t) => t.slug !== topic.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: topic.name,
    url: canonicalUrl,
    description: topic.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topic.posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`,
        name: post.title,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Topics', item: `${SITE_URL}/topics` },
      { '@type': 'ListItem', position: 3, name: topic.name, item: canonicalUrl },
    ],
  };

  return (
    <main>
      <JsonLd data={[jsonLd, breadcrumbJsonLd]} />
      <SiteHeader activeNav="articles" />

      <div className="mx-auto max-w-[1080px] px-6 md:px-8">
        <section className="border-b border-ink py-20">
          <Link
            href="/topics"
            className="mb-6 inline-block text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
          >
            ← All topics
          </Link>
          <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-accent">
            {topic.posts.length} {topic.posts.length === 1 ? 'article' : 'articles'}
          </p>
          <h1 className="text-[clamp(2.6rem,6vw,3.75rem)] font-normal leading-[1.04] tracking-tight text-ink">
            {topic.name}
          </h1>
          <p className="mt-5 max-w-[40em] text-[19px] leading-relaxed text-ink2">
            {topic.description}
          </p>
        </section>

        <div className="pb-10">
          {topic.posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/articles/${encodeURIComponent(post.slug)}`}
              className="group grid grid-cols-1 gap-2 border-b border-line py-8 pr-3 transition-[background,padding] duration-200 hover:bg-surface hover:pl-3.5 sm:grid-cols-[64px_150px_1fr_30px] sm:items-baseline sm:gap-7"
            >
              <span className="hidden text-[15px] italic text-ink3 sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[12.5px] leading-relaxed tracking-[0.03em] text-ink3">
                {formatDisplayDate(post.date)}
              </span>
              <span>
                <span className="mb-2.5 block text-[1.7rem] font-normal leading-snug tracking-[-0.005em] text-ink">
                  {post.title}
                </span>
                {post.excerpt && (
                  <span className="block max-w-[48em] text-base leading-relaxed text-ink2">
                    {post.excerpt}
                  </span>
                )}
              </span>
              <span className="hidden text-right text-xl text-ink3 transition-colors group-hover:text-accent sm:block">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Sideways links so every topic page reaches the others. */}
        {others.length > 0 && (
          <section className="border-t border-line py-10">
            <h2 className="mb-5 text-[11px] uppercase tracking-[0.16em] text-ink3">
              Other topics
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {others.map((t) => (
                <Link
                  key={t.slug}
                  href={`/topics/${t.slug}`}
                  className="rounded-full border border-line2 px-4 py-1.5 text-sm tracking-wide text-ink2 transition-colors hover:border-accent hover:text-accent"
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="pb-16 text-center">
          <Link
            href="/articles"
            className="text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
          >
            View all articles →
          </Link>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
