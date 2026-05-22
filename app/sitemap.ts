// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

const SITE_URL = 'https://www.billcharles.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/notes`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/articles/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
