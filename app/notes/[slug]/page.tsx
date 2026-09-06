// app/notes/[slug]/page.tsx — individual research note (citable URL).
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { formatDisplayDate, getNoteBySlug, getNotes } from '@/lib/posts';
import {
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

export function generateStaticParams(): RouteParams[] {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return { title: 'Note Not Found' };

  const canonicalPath = `/notes/${note.slug}`;
  const publishedTime = toIsoDate(note.date);
  const modifiedTime = note.updated ? toIsoDate(note.updated) : undefined;
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: canonicalPath, types: RSS_ALTERNATE_TYPES },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      title: note.title,
      description: note.excerpt,
      authors: ['Bill Charles'],
      locale: note.lang === 'zh-Hant' ? 'zh_HK' : note.lang === 'zh-Hans' ? 'zh_CN' : 'en_US',
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);

  if (!note) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/notes/${note.slug}`;
  const publishedTime = toIsoDate(note.date);
  const modifiedTime = note.updated ? toIsoDate(note.updated) : undefined;
  const inLanguage = note.lang;

  const noteJsonLd = {
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#note`,
    headline: note.title,
    description: note.excerpt,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    articleSection: note.category,
    keywords: note.tags.join(', '),
    inLanguage,
    ...(publishedTime ? { datePublished: publishedTime } : {}),
    ...(modifiedTime ? { dateModified: modifiedTime } : {}),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    author: { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };

  const breadcrumbJsonLd = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Notes', item: `${SITE_URL}/notes` },
      { '@type': 'ListItem', position: 3, name: note.title, item: canonicalUrl },
    ],
  };

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      noteJsonLd,
      breadcrumbJsonLd,
      withoutContext(WEBSITE_SCHEMA),
      withoutContext(ORGANIZATION_SCHEMA),
      withoutContext(PERSON_SCHEMA),
    ],
  };

  return (
    <main>
      <JsonLd data={pageJsonLd} />
      <SiteHeader activeNav="notes" />

      <article className="max-w-2xl mx-auto px-6 py-20" lang={inLanguage}>
        <header className="mb-12 space-y-5">
          <div className="flex flex-wrap items-center gap-4 text-sm font-sans text-ink3 uppercase tracking-widest">
            <span>{formatDisplayDate(note.date)}</span>
            {note.updated && <span>Updated {formatDisplayDate(note.updated)}</span>}
            <span className="w-1 h-1 bg-accent/50 rounded-full" />
            <span className="text-accent">{note.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-ink leading-tight tracking-tight">
            {note.title}
          </h1>
        </header>

        <MarkdownContent>
          {note.content}
        </MarkdownContent>

        {note.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono bg-surface text-ink2 px-2 py-1 rounded-md border border-line"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <footer className="mt-16 pt-10 border-t border-line font-sans text-sm">
          <Link
            href="/notes"
            className="text-ink3 hover:text-accent transition-colors"
          >
            ← Back to Notes
          </Link>
        </footer>
      </article>

      <SiteFooter />
    </main>
  );
}
