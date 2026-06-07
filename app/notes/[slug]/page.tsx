// app/notes/[slug]/page.tsx — individual research note (citable URL).
import type { Metadata } from 'next';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { formatDisplayDate, getNoteBySlug, getNotes } from '@/lib/posts';
import { AUTHOR_NAME, SITE_NAME, SITE_URL } from '@/lib/site';

type RouteParams = { slug: string };

function toIsoDate(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
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
  return {
    title: note.title,
    description: note.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_NAME,
      title: note.title,
      description: note.excerpt,
      authors: [AUTHOR_NAME],
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
    return (
      <main>
        <SiteHeader activeNav="notes" />
        <section className="max-w-2xl mx-auto px-6 py-32 text-center space-y-6">
          <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
            404
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-stone-900">
            Note not found
          </h1>
          <Link
            href="/notes"
            className="text-stone-500 hover:text-accent underline transition-colors font-sans text-sm"
          >
            ← Back to notes
          </Link>
        </section>
      </main>
    );
  }

  const canonicalUrl = `${SITE_URL}/notes/${note.slug}`;
  const publishedTime = toIsoDate(note.date);
  const inLanguage = /[一-鿿]/.test(note.title) ? 'zh-CN' : 'en-US';

  const noteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: note.title,
    description: note.excerpt,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    articleSection: note.category,
    keywords: note.tags.join(', '),
    inLanguage,
    ...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
    author: { '@type': 'Person', name: AUTHOR_NAME, alternateName: 'Wang Xinhua', url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Notes', item: `${SITE_URL}/notes` },
      { '@type': 'ListItem', position: 3, name: note.title, item: canonicalUrl },
    ],
  };

  return (
    <main>
      <JsonLd data={[noteJsonLd, breadcrumbJsonLd]} />
      <SiteHeader activeNav="notes" />

      <article className="max-w-2xl mx-auto px-6 py-20">
        <header className="mb-12 space-y-5">
          <div className="flex items-center gap-4 text-sm font-sans text-stone-500 uppercase tracking-widest">
            <span>{formatDisplayDate(note.date)}</span>
            <span className="w-1 h-1 bg-accent/50 rounded-full" />
            <span className="text-accent">{note.category}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-sans text-stone-900 leading-tight tracking-tight">
            {note.title}
          </h1>
        </header>

        <MarkdownContent className="prose prose-stone prose-lg max-w-none text-stone-800 leading-relaxed prose-a:text-accent prose-a:font-medium">
          {note.content}
        </MarkdownContent>

        {note.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded-md border border-stone-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <footer className="mt-16 pt-10 border-t border-stone-200 font-sans text-sm">
          <Link
            href="/notes"
            className="text-stone-400 hover:text-accent transition-colors"
          >
            ← Back to Notes
          </Link>
        </footer>
      </article>

      <SiteFooter />
    </main>
  );
}
