// app/llms.txt/route.ts — structured site map for AI agents (llms.txt standard).
import { getArticles, getNotes } from '@/lib/posts';
import { getTopics } from '@/lib/topics';
import { AUTHOR_NAME, SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const articles = getArticles();
  const notes = getNotes();
  const topics = getTopics();

  const lines = [
    `# ${AUTHOR_NAME}`,
    ``,
    `> Personal academic blog by ${AUTHOR_NAME} (also known as Wang Xinhua) — research in Western Philosophy, Post-Marxism, Psychoanalysis, and Cryptography/Web3/DAO. Secretary-General of the Zhejiang Secondary School Philosophy Conference.`,
    ``,
    `## Articles`,
    ``,
    ...articles.map((a) => {
      const url = `${SITE_URL}/articles/${encodeURIComponent(a.slug)}`;
      return `- [${a.title}](${url})${a.excerpt ? `: ${a.excerpt}` : ''}`;
    }),
    ``,
    `## Research Notes`,
    ``,
    ...notes.map((note) => {
      const url = `${SITE_URL}/notes/${encodeURIComponent(note.slug)}`;
      return `- [${note.title}](${url})${note.excerpt ? `: ${note.excerpt}` : ''}`;
    }),
    ``,
    `## Topics`,
    ``,
    ...topics.map(
      (t) =>
        `- [${t.name}](${SITE_URL}/topics/${t.slug}) (${t.posts.length}): ${t.description}`
    ),
    ``,
    `## About`,
    ``,
    `- [Homepage](${SITE_URL}/): Author bio, research interests, ORCID 0009-0000-4322-5195.`,
    `- [About](${SITE_URL}/about): Biography, research interests, name/identity, profiles.`,
    `- [Publications](${SITE_URL}/publications): Academic papers with archived records.`,
    `- [Editorial Standards & Corrections](${SITE_URL}/editorial): Sourcing, corrections, AI assistance, funding, and conflicts policy.`,
    ``,
    `## Optional`,
    ``,
    `- [RSS Feed](${SITE_URL}/feed.xml)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ``,
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
