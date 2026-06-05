// app/feed.xml/route.ts — RSS 2.0 feed of all articles.
import { getArticles } from '@/lib/posts';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

// Content is known at build time; prerender the feed as a static file.
export const dynamic = 'force-static';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(date: string): string | undefined {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toUTCString();
}

export function GET() {
  const articles = getArticles();
  const feedUrl = `${SITE_URL}/feed.xml`;

  const items = articles
    .map((post) => {
      const link = `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`;
      const pubDate = toRfc822(post.date);
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        post.category ? `      <category>${escapeXml(post.category)}</category>` : '',
        pubDate ? `      <pubDate>${pubDate}</pubDate>` : '',
        post.excerpt
          ? `      <description>${escapeXml(post.excerpt)}</description>`
          : '',
        '    </item>',
      ]
        .filter(Boolean)
        .join('\n');
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
