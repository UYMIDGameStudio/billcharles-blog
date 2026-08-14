import { formatDisplayDate, getNoteBySlug, getNotes } from '@/lib/posts';
import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Research note on BillCharles Blog';

export function generateStaticParams() {
  return getNotes().map((note) => ({ slug: note.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return new Response('Not Found', { status: 404 });

  return renderOgCard({
    eyebrow: `${note.category} · ${formatDisplayDate(note.date)}`,
    title: note.title,
    description: note.excerpt,
  });
}
