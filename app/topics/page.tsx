import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { getTopics } from '@/lib/topics';
import { RSS_ALTERNATE_TYPES, SITE_NAME, SITE_URL } from '@/lib/site';

const description =
  'Browse the writing on BillCharles Blog by subject — philosophy, philosophy of science, essays, and cryptography.';

export const metadata: Metadata = {
  title: 'Topics',
  description,
  alternates: { canonical: '/topics', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/topics`,
    siteName: SITE_NAME,
    title: 'Topics',
    description,
  },
};

export default function TopicsPage() {
  const topics = getTopics();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Topics',
    url: `${SITE_URL}/topics`,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: topics.map((topic, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/topics/${topic.slug}`,
        name: topic.name,
      })),
    },
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <SiteHeader activeNav="articles" />

      <div className="mx-auto max-w-[1080px] px-6 md:px-8">
        <section className="border-b border-ink py-20">
          <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-accent">
            Browse by subject
          </p>
          <h1 className="text-[clamp(2.6rem,6vw,3.75rem)] font-normal leading-[1.04] tracking-tight text-ink">
            Topics
          </h1>
          <p className="mt-5 max-w-[40em] text-[19px] leading-relaxed text-ink2">
            {description}
          </p>
        </section>

        <div className="pb-10">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group grid grid-cols-1 gap-2 border-b border-line py-8 pr-3 transition-[background,padding] duration-200 hover:bg-surface hover:pl-3.5 sm:grid-cols-[150px_1fr_30px] sm:items-baseline sm:gap-7"
            >
              <span className="text-[12.5px] uppercase tracking-[0.1em] text-accent">
                {topic.posts.length}{' '}
                {topic.posts.length === 1 ? 'article' : 'articles'}
              </span>
              <span>
                <span className="mb-2.5 block text-[1.7rem] font-normal leading-snug tracking-[-0.005em] text-ink">
                  {topic.name}
                </span>
                <span className="block max-w-[48em] text-base leading-relaxed text-ink2">
                  {topic.description}
                </span>
              </span>
              <span className="hidden text-right text-xl text-ink3 transition-colors group-hover:text-accent sm:block">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="pb-16 pt-8 text-center">
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
