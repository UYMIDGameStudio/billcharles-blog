import type { Metadata } from 'next';
import Image from 'next/image';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import {
  AUTHOR_ACADEMIC_NAME,
  AUTHOR_EMAIL,
  AUTHOR_NAME,
  AUTHOR_NAME_HANZI,
  AUTHOR_ORCID,
  AUTHOR_ORCID_ID,
  AUTHOR_PHILPEOPLE,
  AUTHOR_SCHOLAR,
  PERSON_SCHEMA,
  SITE_NAME,
  SITE_URL,
} from '@/lib/site';

const description = `About ${AUTHOR_NAME} (${AUTHOR_ACADEMIC_NAME} / ${AUTHOR_NAME_HANZI}) — researcher in Western philosophy, post-Marxism, and psychoanalysis.`;

export const metadata: Metadata = {
  title: 'About',
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'profile',
    url: `${SITE_URL}/about`,
    siteName: SITE_NAME,
    title: `About · ${SITE_NAME}`,
    description,
  },
};

const PROFILES = [
  { k: 'Email', href: `mailto:${AUTHOR_EMAIL}`, label: AUTHOR_EMAIL },
  { k: 'ORCID', href: AUTHOR_ORCID, label: AUTHOR_ORCID_ID },
  { k: 'Scholar', href: AUTHOR_SCHOLAR, label: 'Google Scholar profile' },
  { k: 'PhilPeople', href: AUTHOR_PHILPEOPLE, label: 'PhilPeople profile' },
  { k: 'PhilPapers', href: 'https://philpapers.org/rec/WANTDD-2', label: 'PhilPapers record' },
  {
    k: 'GitHub',
    href: 'https://github.com/UYMIDGameStudio/billcharles-blog',
    label: 'UYMIDGameStudio/billcharles-blog',
  },
];

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${SITE_URL}/about`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: { '@id': `${SITE_URL}/#author` },
};

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={[aboutJsonLd, PERSON_SCHEMA]} />
      <SiteHeader activeNav="about" />

      <div className="mx-auto max-w-[760px] px-6 md:px-8">
        {/* HEAD */}
        <section className="grid items-center gap-10 border-b border-ink py-16 sm:grid-cols-[1fr_140px]">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-accent">About</p>
            <h1 className="text-[clamp(2.2rem,5vw,3rem)] font-normal leading-[1.05] tracking-tight text-ink">
              {AUTHOR_NAME}
            </h1>
            <p className="mt-2 text-[1.4rem] font-light italic text-ink2">
              {AUTHOR_NAME_HANZI}&nbsp;·&nbsp;{AUTHOR_ACADEMIC_NAME}
            </p>
          </div>
          <div className="hidden sm:block">
            <span className="relative block aspect-square w-full overflow-hidden rounded-sm border border-line2">
              <Image src="/image_0.png" alt={AUTHOR_NAME} fill className="object-cover" />
            </span>
          </div>
        </section>

        {/* BIO */}
        <section className="space-y-6 py-12 text-[1.08rem] leading-[1.9] text-ink2">
          <p>
            I am <span className="text-ink">{AUTHOR_NAME}</span> — my legal and academic name is{' '}
            <span className="text-ink">
              {AUTHOR_ACADEMIC_NAME} ({AUTHOR_NAME_HANZI})
            </span>
            , under which I publish. I am a high school student based in Zhejiang, China, working primarily
            in Western philosophy, post-Marxism, and psychoanalysis.
          </p>
          <p>
            I serve as the Secretary-General of the organizing committee for the 2nd and 3rd Zhejiang
            Secondary School Philosophy Conferences (SSPC), and am a co-founder of the Ateleios Diexodos
            project. My interests extend into political economy and into cryptography and
            decentralized-systems (DAO) research — for me these are less pursuits of worldly success than
            ways to seek truth, cultivate rational discipline, and use thought to act on the world.
          </p>
          <p>
            My turn toward social theory began with Marx&apos;s <em>Das Kapital</em>, and I later refined my
            analytical framework at the National University of Singapore (NUS) Social Sciences Summer
            School. I have studied German since the eighth grade and picked up Japanese in high school; for
            me, language is a vessel for culture as much as a tool for communication.
          </p>
        </section>

        {/* ON THE NAME */}
        <section className="border-l-[3px] border-accent/40 py-1 pl-5 text-[0.98rem] italic leading-relaxed text-ink3">
          {AUTHOR_ACADEMIC_NAME} ({AUTHOR_NAME_HANZI}) is my legal and academic name, used on published work
          and indexed records. Bill Charles is the pen name and brand used on this site.
        </section>

        {/* PROFILES */}
        <section className="py-12">
          <h2 className="mb-6 border-b border-ink pb-3.5 text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
            Profiles &amp; Contact
          </h2>
          <dl className="text-[13px]">
            {PROFILES.map((p) => (
              <div
                key={p.k}
                className="grid grid-cols-[110px_1fr] items-baseline gap-4 border-b border-line py-3"
              >
                <dt className="text-[10.5px] uppercase tracking-[0.12em] text-ink3">{p.k}</dt>
                <dd className="m-0">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words border-b border-transparent text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {p.label}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* LINKS OUT */}
        <section className="flex flex-col gap-4 pb-20 text-sm sm:flex-row sm:gap-8">
          <a
            href="/publications"
            className="text-ink3 underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
          >
            View publications →
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- Hard navigation avoids exposing an RSC payload when a client router is stale. */}
          <a
            href="/articles"
            className="text-ink3 underline decoration-accent/40 underline-offset-4 transition-colors hover:text-accent"
          >
            Read essays &amp; articles →
          </a>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
