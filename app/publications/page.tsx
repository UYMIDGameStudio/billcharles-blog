import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { PUBLICATIONS } from '@/lib/publications';
import { AUTHOR_ACADEMIC_NAME, AUTHOR_NAME, SITE_NAME, SITE_URL } from '@/lib/site';

const description = `Academic publications and papers by ${AUTHOR_ACADEMIC_NAME} (${AUTHOR_NAME}).`;

export const metadata: Metadata = {
  title: 'Publications',
  description,
  alternates: { canonical: '/publications' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/publications`,
    siteName: SITE_NAME,
    title: `Publications · ${SITE_NAME}`,
    description,
  },
};

const publicationsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Publications',
  url: `${SITE_URL}/publications`,
  description,
  about: { '@id': `${SITE_URL}/#author` },
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: PUBLICATIONS.map((pub, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'ScholarlyArticle',
        name: pub.title,
        author: { '@id': `${SITE_URL}/#author` },
        datePublished: String(pub.year),
        ...(pub.links[0] ? { url: pub.links[0].href } : {}),
      },
    })),
  },
};

export default function PublicationsPage() {
  return (
    <main>
      <JsonLd data={publicationsJsonLd} />
      <SiteHeader activeNav="publications" />

      <div className="mx-auto max-w-[860px] px-6 md:px-8">
        {/* HEAD */}
        <section className="border-b border-ink py-16">
          <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-accent">Academic Record</p>
          <h1 className="text-[clamp(2.4rem,5.5vw,3.4rem)] font-normal leading-[1.04] tracking-tight text-ink">
            Publications
          </h1>
          <p className="mt-5 max-w-[44em] text-[18px] leading-relaxed text-ink2">
            Papers and formal academic work. Each entry links to its archived record of permanent citation,
            and to an on-site copy where available.
          </p>
        </section>

        {/* LIST */}
        <ol className="pb-10">
          {PUBLICATIONS.map((pub, i) => (
            <li
              key={pub.title}
              className="grid grid-cols-[60px_1fr] items-baseline gap-6 border-b border-line py-9"
            >
              <span className="text-[15px] italic text-ink3">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-3 text-[12.5px] uppercase tracking-[0.06em] text-ink3">
                  <span className="text-accent">{pub.year}</span>
                  <span className="h-px w-4 bg-line2" />
                  <span>{pub.venue}</span>
                </div>
                <h2 className="text-[clamp(1.4rem,3vw,1.85rem)] font-normal leading-snug tracking-tight text-ink">
                  {pub.title}
                </h2>
                <p className="mt-3 text-[15px] text-ink2">{pub.authors}</p>
                <div className="mt-4 flex flex-wrap gap-6 text-[13px]">
                  {pub.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-accent/40 pb-0.5 text-accent transition-colors hover:border-accent"
                    >
                      {l.label} →
                    </a>
                  ))}
                  {pub.articleSlug && (
                    <Link
                      href={`/articles/${encodeURIComponent(pub.articleSlug)}`}
                      className="border-b border-line2 pb-0.5 text-ink3 transition-colors hover:text-accent"
                    >
                      Read on this site →
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <SiteFooter />
    </main>
  );
}
