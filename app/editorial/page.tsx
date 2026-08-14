import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/app/components/JsonLd';
import SiteFooter from '@/app/components/SiteFooter';
import SiteHeader from '@/app/components/SiteHeader';
import { AUTHOR_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';

const title = 'Editorial Standards & Corrections';
const description =
  'How BillCharles Blog verifies claims, cites sources, handles corrections, discloses AI assistance, and protects editorial independence.';
const canonicalUrl = `${SITE_URL}/editorial`;
const socialImage = `${SITE_URL}/opengraph-image`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/editorial' },
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
  reviewedBy: { '@id': `${SITE_URL}/#author` },
};

export default function EditorialPage() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <SiteHeader />

      <article className="mx-auto max-w-[760px] px-6 py-16 md:px-8">
        <header className="border-b border-ink pb-10">
          <p className="mb-4 text-[13px] uppercase tracking-[0.18em] text-accent">
            Trust &amp; Transparency
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-normal leading-tight tracking-tight text-ink">
            Editorial Standards &amp; Corrections
          </h1>
          <p className="mt-5 max-w-[42em] text-lg leading-relaxed text-ink2">
            These standards apply to essays and research articles published on BillCharles Blog.
          </p>
          <p className="mt-4 text-sm text-ink3">Last updated: August 14, 2026</p>
        </header>

        <div className="space-y-12 py-12 text-[1.05rem] leading-[1.85] text-ink2">
          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Accuracy and sourcing</h2>
            <p>
              Factual claims are checked against the strongest reasonably available evidence. Precise
              statistics, legal claims, quotations, and time-sensitive statements should link to primary
              documents, original research, official datasets, or stable archives near the claim. Secondary
              reporting is used when it adds necessary context or when no primary source is public.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Analysis, opinion, and limitations</h2>
            <p>
              Interpretation is distinguished from reported fact. Research-oriented articles state their
              evidence and material limitations; personal essays are not presented as comprehensive academic
              reviews. Publication on this site does not imply institutional endorsement by any school,
              conference, archive, or profile platform named on the site.
            </p>
          </section>

          <section id="corrections" className="scroll-mt-24">
            <h2 className="mb-4 text-2xl font-normal text-ink">Corrections and retractions</h2>
            <p>
              Typographical fixes that do not change meaning may be made silently. A substantive correction
              receives an updated date and a note explaining what changed. If a central claim cannot be
              supported, the article will be corrected, clearly withdrawn, or removed while its canonical URL
              returns an explanatory notice where practical.
            </p>
            <p className="mt-4">
              To report an error, email{' '}
              <a className="text-accent underline underline-offset-4" href={`mailto:${AUTHOR_EMAIL}`}>
                {AUTHOR_EMAIL}
              </a>{' '}
              with the page URL, disputed passage, and supporting evidence. Good-faith reports are reviewed
              regardless of the sender&apos;s viewpoint.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">AI-assisted work</h2>
            <p>
              AI tools are not treated as factual authorities or cited as evidence. If they are used for
              brainstorming, translation checks, transcription, code assistance, or editorial review, the
              author remains responsible for verifying every published claim and source. Substantive generative
              use that materially shapes an article will be disclosed on that article.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Funding, support, and conflicts</h2>
            <p>
              Voluntary Ko-fi support does not purchase coverage, favorable conclusions, access to drafts, or
              influence over editorial decisions. Sponsorship, research funding, free products, financial
              interests, or other relationships that could reasonably affect a specific article will be
              disclosed on that page. If no disclosure appears, no such article-specific relationship has been
              declared by the author.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-normal text-ink">Authorship and revision record</h2>
            <p>
              Bill Charles is the site pen name; Wang Xinhua (王鑫桦) is the legal and academic name used on
              formal publications. Publication and substantive revision dates are shown on article pages and
              in structured data only when they reflect real editorial events.
            </p>
          </section>
        </div>

        <nav className="flex flex-wrap gap-6 border-t border-line pt-8 text-sm">
          <Link href="/about" className="text-ink3 transition-colors hover:text-accent">
            About the author →
          </Link>
          <Link href="/terms" className="text-ink3 transition-colors hover:text-accent">
            Terms of Use →
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
