// app/notes/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import JsonLd from '@/app/components/JsonLd';
import { formatDisplayDate, getNotes } from '@/lib/posts';
import { RSS_ALTERNATE_TYPES, SITE_NAME, SITE_URL } from '@/lib/site';

const description = 'Research notes and reading fragments by Bill Charles';

export const metadata: Metadata = {
  title: 'Notes',
  description,
  alternates: { canonical: '/notes', types: RSS_ALTERNATE_TYPES },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/notes`,
    siteName: SITE_NAME,
    title: 'Notes',
    description,
  },
};

export default function NotesPage() {
  const notes = getNotes();

  const listJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Research Notes',
    url: `${SITE_URL}/notes`,
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: notes.map((note, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/notes/${note.slug}`,
        name: note.title,
      })),
    },
  };

  return (
    <main>
      <JsonLd data={listJsonLd} />
      <SiteHeader activeNav="notes" />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-4">
          Research Notes
        </h1>
        <p className="text-ink3 font-sans mb-16 text-sm tracking-wide">
          Fragments, reading logs, and unrefined thoughts.
        </p>

        <div className="space-y-8">
          {notes.length === 0 ? (
            <p className="text-ink3 italic">暂无笔记，敬请期待…</p>
          ) : (
            notes.map((note) => (
              <Link
                key={note.slug}
                href={`/notes/${note.slug}`}
                className="block group bg-surface border border-line p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-line2 transition-all"
              >
                <div className="flex items-center gap-3 text-xs font-mono text-ink3 mb-3 uppercase tracking-widest">
                  <span>{formatDisplayDate(note.date)}</span>
                  <span className="text-line2">/</span>
                  <span className="text-accent">{note.category}</span>
                </div>
                <h2 className="text-lg font-bold font-sans text-ink mb-3 group-hover:text-accent transition-colors">
                  {note.title}
                </h2>
                {note.excerpt && (
                  <p className="text-ink2 leading-relaxed mb-4 text-sm">
                    {note.excerpt}
                  </p>
                )}
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono bg-paper text-ink3 px-2 py-1 rounded-md border border-line"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
