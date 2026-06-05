// app/notes/page.tsx
import type { Metadata } from 'next';
import MarkdownContent from '@/app/components/MarkdownContent';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import { formatDisplayDate, getNotes } from '@/lib/posts';
import { SITE_NAME, SITE_URL } from '@/lib/site';

const description = 'Research notes and reading fragments by Bill Charles';

export const metadata: Metadata = {
  title: 'Notes',
  description,
  alternates: { canonical: '/notes' },
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

  return (
    <main>
      <SiteHeader activeNav="notes" />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-4">
          Research Notes
        </h1>
        <p className="text-stone-500 font-sans mb-16 text-sm tracking-wide">
          Fragments, reading logs, and unrefined thoughts.
        </p>

        <div className="space-y-10">
          {notes.length === 0 ? (
            <p className="text-stone-500 italic">暂无笔记，敬请期待…</p>
          ) : (
            notes.map((note) => (
              <article
                key={note.slug}
                className="bg-[#FCFAF6] border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-xs font-mono text-stone-400 mb-4">
                  {formatDisplayDate(note.date)}
                </div>
                {note.title && (
                  <h2 className="text-lg font-bold font-sans text-stone-900 mb-4">
                    {note.title}
                  </h2>
                )}
                <MarkdownContent className="prose prose-stone prose-base max-w-none text-stone-800 leading-relaxed mb-6">
                  {note.content}
                </MarkdownContent>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
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
              </article>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
