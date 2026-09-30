import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import SupportTip from '@/app/components/SupportTip';
import WritingPager, { type WritingPage } from '@/app/components/WritingPager';
import KofiButton from '@/app/components/KofiButton';
import { formatDisplayDate, getArticles } from '@/lib/posts';
import { PUBLICATIONS } from '@/lib/publications';
import { getTopics } from '@/lib/topics';
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
  // The writing pager is generated from content/*.md — add a markdown file and it appears here.
  const topics = getTopics();
  const pages: WritingPage[] = getArticles()
    .slice(0, 5)
    .map((post, i) => ({
      num: String(i + 1).padStart(2, '0'),
      kicker: post.category,
      date: formatDisplayDate(post.date),
      title: post.title,
      excerpt: post.excerpt ?? '',
      href: `/articles/${encodeURIComponent(post.slug)}`,
    }));

  return (
    <main>
      <JsonLd data={homeJsonLd} />
      <SiteHeader activeNav="home" />

      <div className="mx-auto max-w-[1120px] px-6 md:px-8">
        <section id="author" className="home-hero">
          <div>
            <p className="eyebrow hero-kicker">Personal academic journal <span aria-hidden> / </span> Zhejiang, China</p>
            <h1 className="hero-title">Bill Charles<span className="text-accent">.</span></h1>
            <p className="hero-byline"><span lang="zh-Hans">王鑫桦</span><span aria-hidden> / </span>Wang Xinhua</p>
            <p className="hero-intro">A space where rigorous thinking meets diverse insight. I write on Western philosophy, post-Marxism, and psychoanalysis — and chase the same questions through cryptography and decentralized systems.</p>
            <p className="hero-detail">Secretary-General of the organizing committee for the 2nd &amp; 3rd Zhejiang Secondary School Philosophy Conference (SSPC). Co-founder, Ateleios Diexodos.</p>
            <div className="hero-actions">
              <Link href="#writing" className="action-link">Explore the writing <span aria-hidden>↗</span></Link>
              <Link href="/about" className="text-link">About the author <span aria-hidden>→</span></Link>
            </div>
          </div>
          <figure className="hero-portrait">
            <div className="portrait-mat">
              <Image src="/image_0.png" alt="Abstract geometric portrait" width={360} height={360} sizes="(min-width: 768px) 320px, 260px" priority className="aspect-square w-full object-cover" />
            </div>
            <figcaption><span>Philosophy &amp; cryptography</span><span aria-hidden>01 — BC</span></figcaption>
          </figure>
        </section>

        {/* FIELDS */}
        <section className="field-strip">
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink3">
            Fields
          </span>
          <div className="flex flex-wrap gap-2.5">
            {FIELDS.map((f) => (
              <span
                key={f}
                className="field-label"
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* PUBLICATIONS (dynamic from lib/publications) */}
        <section id="publications" className="scroll-mt-20 pt-16">
          <div className="flex items-baseline justify-between border-b border-ink pb-3.5">
            <h2 className="text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
              Publications
            </h2>
            <Link
              href="/publications"
              className="text-xs uppercase tracking-[0.08em] text-ink3 transition-colors hover:text-accent"
            >
              All publications →
            </Link>
          </div>
          {PUBLICATIONS.map((pub) => (
            <div
              key={pub.title}
              className="grid items-baseline gap-3 border-b border-line py-7 pr-3 md:grid-cols-[120px_1fr] md:gap-10"
            >
              <div className="text-xs leading-relaxed text-ink3">
                <div className="font-medium text-accent">{pub.year}</div>
                <div>{pub.venue}</div>
              </div>
              <div>
                <h3 className="mb-2 text-[clamp(1.25rem,3vw,1.6rem)] font-normal leading-snug tracking-tight text-ink">
                  {pub.title}
                </h3>
                {pub.abstract && (
                  <p className="mb-3 max-w-[46em] text-[15px] leading-relaxed text-ink2">
                    {pub.abstract}
                  </p>
                )}
                <div className="flex flex-wrap gap-6 text-[13px]">
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
            </div>
          ))}
        </section>

        {/* WRITING — manually browsed selections from content/*.md */}
        <WritingPager pages={pages} />

        {/* TOPICS — crawlable entry points into each subject */}
        <section className="flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <span className="text-[11px] uppercase tracking-[0.16em] text-ink3">
            Topics
          </span>
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="rounded-full border border-line2 px-3.5 py-1 text-[13px] text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              {topic.name}
              <span className="ml-1.5 text-ink3">{topic.posts.length}</span>
            </Link>
          ))}
        </section>

        {/* COLUMNS */}
        <section id="columns" className="scroll-mt-20 pt-20">
          <div className="research-columns grid md:grid-cols-2">
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
                  <dd className="m-0 min-w-0">
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
      <KofiButton />
    </main>
  );
}
