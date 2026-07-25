// app/sitemap.ts — 自动生成 /sitemap.xml
import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/posts';
import { getTopics } from '@/lib/topics';
import { SITE_URL, toSitemapLastModified } from '@/lib/site';

/** Newest article date, so list pages report a truthful lastModified. */
function newestDate(dates: string[]): Date | undefined {
  const parsed = dates
    .map(toSitemapLastModified)
    .filter((d): d is Date => d instanceof Date);
  if (parsed.length === 0) return undefined;
  return new Date(Math.max(...parsed.map((d) => d.getTime())));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();
  const topics = getTopics();
  const latest = newestDate(articles.map((a) => a.date));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      ...(latest ? { lastModified: latest } : {}),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/topics`,
      ...(latest ? { lastModified: latest } : {}),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/publications`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/site-map`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((post) => {
    const lastModified = toSitemapLastModified(post.date);
    return {
      url: `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'yearly',
      priority: 0.7,
    };
  });

  const topicPages: MetadataRoute.Sitemap = topics.map((topic) => {
    const lastModified = newestDate(topic.posts.map((p) => p.date));
    return {
      url: `${SITE_URL}/topics/${topic.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'weekly',
      priority: 0.5,
    };
  });

  return [...staticPages, ...topicPages, ...articlePages];
}
