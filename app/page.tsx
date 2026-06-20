import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import SupportTip from '@/app/components/SupportTip';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { PUBLICATIONS } from '@/lib/publications';
import {
  AUTHOR_EMAIL,
  AUTHOR_ORCID,
  AUTHOR_SCHOLAR,
  ORGANIZATION_SCHEMA,
  PERSON_SCHEMA,
  RSS_ALTERNATE_TYPES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WEBSITE_SCHEMA,
} from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'BillCharles Blog — Philosophy, Post-Marxism & Cryptography' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'BillCharles Blog — Philosophy, Post-Marxism & Cryptography',
    description: SITE_DESCRIPTION,
  },
};

const homeJsonLd = [WEBSITE_SCHEMA, ORGANIZATION_SCHEMA, PERSON_SCHEMA];

const FIELDS = [
  'Western Philosophy',
  'Post-Marxism',
  'Psychoanalysis',
  'Political Economy',
  'Cryptography',
  'DAO',
];

const CRYPTO_TOPICS = [
  { k: '01', label: 'Web3' },
  { k: '02', label: 'DAO' },
  { k: '03', label: 'ZK Rollups' },
];

const HUMANITIES_TOPICS = [
  { k: '01', label: 'Philosophy' },
  { k: '02', label: 'Psychology' },
  { k: '03', label: 'Psychoanalysis' },
  { k: '04', label: 'Literature' },
];

const READING = [
  { title: 'Organs without Bodies: On Deleuze and Consequences', author: 'Slavoj Žižek' },
  { title: 'Spinoza: Philosophie Pratique', author: 'Gilles Deleuze' },
  { title: 'The World as Will and Representation', author: 'Arthur Schopenhauer' },
  { title: 'Street Corner Society', author: 'William Foote Whyte' },
  { title: 'Objectivity', author: 'Lorraine J. Daston' },
];

const CONNECT = [
  { k: 'Email', href: `mailto:${AUTHOR_EMAIL}`, label: AUTHOR_EMAIL },
  { k: 'ORCID', href: AUTHOR_ORCID, label: '0009-0000-4322-5195' },
  { k: 'Scholar', href: AUTHOR_SCHOLAR, label: 'Google Scholar profile' },
  {
    k: 'GitHub',
    href: 'https://github.com/UYMIDGameStudio/billcharles-blog',
    label: 'UYMIDGameStudio/billcharles-blog',
  },
];

export default function Home() {
  // The writing index is generated from content/*.md — add a markdown file and it appears here.
  const posts = getArticles().slice(0, 6);
  const featured = PUBLICATIONS[0];

  return (
    <main>
      <JsonLd data={homeJsonLd} />
      <SiteHeader activeNav="home" />

      <div className="mx-auto max-w-[1080px] px-6 md:px-8">
        {/* HERO */}
        <section
          id="author"
          className="scroll-mt-24 grid items-center gap-14 py-16 md:grid-cols-[1fr_280px] md:py-20"
        >
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.18em] text-accent">
              Personal Academic Journal
            </p>
            <h1 className="text-[clamp(2.6rem,6vw,3.9rem)] font-normal leading-[1.02] tracking-tight text-ink">
              Bill Charles
            </h1>
            <p className="mt-2 text-[1.7rem] font-light italic text-ink2">
              王鑫桦 &nbsp;·&nbsp; Wang Xinhua
            </p>
            <p className="mt-7 max-w-[36em] text-lg leading-relaxed text-ink2">
              A space where rigorous thinking meets diverse insight. I write on{' '}
              <em className="not-italic text-ink underline decoration-accent/40 underline-offset-4">
                Western philosophy
              </em>
              , post-Marxism, and psychoanalysis — and chase the same questions
              through cryptography and decentralized systems.
            </p>
            <p className="mt-4 max-w-[34em] text-[15px] leading-relaxed text-ink3">
              Secretary-General of the organizing committee for the 2nd &amp; 3rd
              Zhejiang Secondary School Philosophy Conference (SSPC). Co-founder,
              Ateleios Diexodos.
            </p>
            <Link
              href="/about"
              className="mt-5 inline-block text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
            >
              More about me →
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -bottom-3.5 -right-3.5 left-3.5 top-3.5 rounded-sm border border-line2" />
            <div className="relative rounded-sm border border-line bg-panel p-2.5 shadow-[0_18px_40px_-28px_rgba(28,25,23,0.5)]">
              <Image
                src="/image_0.png"
                alt="Abstract geometric portrait"
                width={280}
                height={280}
                priority
                className="aspect-square w-full rounded-[2px] object-cover"
              />
            </div>
          </div>
        </section>

        {/* FIELDS */}
        <section className="flex flex-wrap items-center gap-4 border-y border-line py-5">
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink3">
            Fields
          </span>
          <div className="flex flex-wrap gap-2.5">
            {FIELDS.map((f) => (
              <span
                key={f}
                className="rounded-full border border-line2 px-3 py-1 text-[13px] text-ink2"
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURED PAPER */}
        <section className="pt-16">
          <div className="mb-6 flex items-baseline justify-between">
            <p className="text-xs uppercase tracking-[0.16em] text-ink3">Featured Paper</p>
            <Link
              href="/publications"
              className="text-xs uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
            >
              All publications →
            </Link>
          </div>
          <div className="grid items-start gap-10 md:grid-cols-[120px_1fr]">
            <div className="pt-1.5 text-[13px] leading-loose text-ink3">
              <div className="font-medium text-accent">{featured.year}</div>
              <div>{featured.venue}</div>
            </div>
            <div>
              <h2 className="text-[clamp(1.6rem,3.4vw,2.05rem)] font-normal leading-snug tracking-tight text-ink">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-[42em] text-[17px] leading-relaxed text-ink2">
                A study of how systems of knowledge evolve — what persists as a
                theory&apos;s identity through transformation, and what must change
                for it to remain true.
              </p>
              <div className="mt-5 flex flex-wrap gap-6 text-[13px]">
                {featured.links.map((l) => (
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
                {featured.articleSlug && (
                  <Link
                    href={`/articles/${encodeURIComponent(featured.articleSlug)}`}
                    className="border-b border-line2 pb-0.5 text-ink3 transition-colors hover:text-accent"
                  >
                    Read on this site →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* WRITING INDEX (dynamic from content/*.md) */}
        <section id="writing" className="scroll-mt-20 pt-20">
          <div className="mb-2 flex items-baseline justify-between border-b border-ink pb-3.5">
            <h2 className="text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
              Writing
            </h2>
            <span className="text-xs text-ink3">Essays &amp; notes</span>
          </div>
          {posts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/articles/${encodeURIComponent(post.slug)}`}
              className="grid grid-cols-1 gap-2 border-b border-line py-6 pr-4 transition-[background,padding] duration-200 hover:bg-surface hover:pl-4 sm:grid-cols-[54px_140px_1fr] sm:items-baseline sm:gap-6"
            >
              <span className="hidden text-[13px] italic text-ink3 sm:block">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex gap-2.5 text-[12px] leading-relaxed text-ink3 sm:block">
                <span className="sm:block">{formatDisplayDate(post.date)}</span>
                <span className="uppercase tracking-[0.08em] text-accent sm:block">
                  {post.category}
                </span>
              </span>
              <span>
                <span className="mb-1.5 block text-[1.45rem] font-normal leading-snug text-ink">
                  {post.title}
                </span>
                {post.excerpt && (
                  <span className="block max-w-[46em] text-[15px] leading-relaxed text-ink2">
                    {post.excerpt}
                  </span>
                )}
              </span>
            </Link>
          ))}
          <div className="pt-6 text-center">
            <Link
              href="/articles"
              className="text-[13px] uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
            >
              View all articles →
            </Link>
          </div>
        </section>

        {/* COLUMNS */}
        <section id="columns" className="scroll-mt-20 pt-20">
          <div className="grid overflow-hidden rounded-sm border border-line md:grid-cols-2">
            <div className="border-line p-9 md:border-r">
              <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-accent">
                Cryptography Column
              </p>
              <h3 className="mb-4 text-[1.55rem] font-normal tracking-tight text-ink">
                Decentralized systems &amp; trust
              </h3>
              <ul className="flex flex-col gap-3">
                {CRYPTO_TOPICS.map((t) => (
                  <li key={t.k} className="flex items-baseline gap-3 text-base text-ink2">
                    <span className="font-mono text-[11px] text-ink3">{t.k}</span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-line p-9 md:border-t-0">
              <p className="mb-4 text-[11px] uppercase tracking-[0.16em] text-accent">
                Humanities Column
              </p>
              <h3 className="mb-4 text-[1.55rem] font-normal tracking-tight text-ink">
                Thought, mind &amp; meaning
              </h3>
              <ul className="flex flex-col gap-3">
                {HUMANITIES_TOPICS.map((t) => (
                  <li key={t.k} className="flex items-baseline gap-3 text-base text-ink2">
                    <span className="font-mono text-[11px] text-ink3">{t.k}</span>
                    {t.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* READING + CONNECT */}
        <section className="grid gap-16 pt-20 md:grid-cols-2">
          <div>
            <h2 className="mb-6 border-b border-ink pb-3.5 text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
              Currently Reading
            </h2>
            <ul className="flex flex-col">
              {READING.map((r) => (
                <li key={r.title} className="border-b border-line py-3.5">
                  <span className="text-[18px] italic text-ink">{r.title}</span>
                  <span className="mt-1 block text-[12px] tracking-[0.02em] text-ink3">
                    {r.author}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div id="connect" className="scroll-mt-20">
            <h2 className="mb-6 border-b border-ink pb-3.5 text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
              Connect
            </h2>
            <dl className="text-[13px]">
              {CONNECT.map((c) => (
                <div
                  key={c.k}
                  className="grid grid-cols-[96px_1fr] items-baseline gap-4 border-b border-line py-3"
                >
                  <dt className="text-[10.5px] uppercase tracking-[0.12em] text-ink3">
                    {c.k}
                  </dt>
                  <dd className="m-0">
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words border-b border-transparent text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      {c.label}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-sm leading-relaxed text-ink3">
              中文交流请发邮件至上方邮箱。Open to correspondence on philosophy,
              post-Marxism, and DAO research.
            </p>
          </div>
        </section>

        {/* SUPPORT */}
        <SupportTip variant="section" />
        <div className="h-12" />
      </div>

      <SiteFooter />
    </main>
  );
}
