import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/app/components/JsonLd';
import SiteFooter from '@/app/components/SiteFooter';
import SiteHeader from '@/app/components/SiteHeader';
import { RSS_ALTERNATE_TYPES, AUTHOR_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

const title = 'Terms of Use';
const description =
  'Terms governing educational content, copyright, external links, voluntary support, and use of BillCharles Blog.';
const canonicalUrl = `${SITE_URL}/terms`;
const socialImage = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/terms', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: canonicalUrl,
    siteName: SITE_NAME,
    title: `${title} · ${SITE_NAME}`,
    description,
    images: [{ url: socialImage, width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [socialImage],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${canonicalUrl}#page`,
  name: title,
  description,
  url: canonicalUrl,
  dateModified: '2026-08-14',
  isPartOf: { '@id': `${SITE_URL}/#website` },
};

export default function TermsPage() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <article className="mx-auto max-w-[760px] px-6 py-16 md:px-8">
        <header className="border-b border-ink pb-10">
          <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-accent">Site Policy</p>
          <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-normal leading-tight tracking-tight text-ink">
            Terms of Use
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink2">
            By using this site, you agree to the terms below.
          </p>
          <p className="mt-4 text-sm text-ink3">Last updated: August 14, 2026</p>
        </header>

        <div className="space-y-12 py-12 text-[1.05rem] leading-[1.85] text-ink2">
          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Educational purpose</h2>
            <p>
              The site publishes academic research, commentary, and personal essays for educational and
              informational purposes. Nothing here is financial, investment, legal, medical, or professional
              advice, and no author-reader advisory relationship is created.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Accuracy and availability</h2>
            <p>
              Reasonable care is taken under the published{' '}
              <Link className="text-accent underline underline-offset-4" href="/editorial">
                editorial and corrections policy
              </Link>
              , but content may contain errors or become outdated. The site and its content are provided
              without a guarantee of uninterrupted availability, completeness, or fitness for a particular
              purpose.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Copyright and permitted use</h2>
            <p>
              Unless a page states otherwise, original text and site design are protected by copyright. You
              may quote brief passages with clear attribution and a link to the canonical page, and may use
              ordinary links, browser reading tools, and search indexing. Republishing substantial portions,
              removing attribution, or presenting the work as your own requires prior written permission.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">External links and archives</h2>
            <p>
              External sites, DOI records, repositories, and embedded services are controlled by their own
              operators and terms. Links are provided for evidence and convenience; they do not imply control
              over or endorsement of all content on those services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Voluntary support</h2>
            <p>
              Ko-fi contributions are voluntary support for the site, not payment for goods, professional
              services, investment returns, editorial coverage, or influence. Contributions do not alter the
              independence standards stated in the editorial policy.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Contact and changes</h2>
            <p>
              Questions about reuse or these terms may be sent to{' '}
              <a className="text-accent underline underline-offset-4" href={`mailto:${AUTHOR_EMAIL}`}>
                {AUTHOR_EMAIL}
              </a>
              . Material changes will be reflected in the last-updated date on this page.
            </p>
          </section>
        </div>

        <nav className="flex flex-wrap gap-6 border-t border-line pt-8 text-sm">
          <Link href="/editorial" className="text-ink3 transition-colors hover:text-accent">
            Editorial &amp; Corrections →
          </Link>
          <Link href="/privacy" className="text-ink3 transition-colors hover:text-accent">
            Privacy Policy →
          </Link>
        </nav>
      </article>

      <SiteFooter />
    </main>
  );
}
