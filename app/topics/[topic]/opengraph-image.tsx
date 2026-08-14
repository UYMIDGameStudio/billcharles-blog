import { getTopic, getTopics } from '@/lib/topics';
import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'BillCharles Blog topic';

export function generateStaticParams() {
  return getTopics().map((topic) => ({ topic: topic.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic: slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return new Response('Not Found', { status: 404 });

  return renderOgCard({
    eyebrow: `${topic.posts.length} ${topic.posts.length === 1 ? 'ARTICLE' : 'ARTICLES'}`,
    title: topic.name,
    description: topic.description,
  });
}
