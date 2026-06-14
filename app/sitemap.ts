// app/sitemap.ts — 自动生成 /sitemap.xml
import type { MetadataRoute } from 'next';
import { getArticles } from '@/lib/posts';
import { SITE_URL, toSitemapLastModified } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticles();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/site-map`,
      changeFrequency: 'monthly',
      priority: 0.3,
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

  return [...staticPages, ...articlePages];
}
