// lib/posts.ts
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  type: 'article';
};

export type PostWithContent = Post & {
  content: string;
  /** Optional shorter title for the <title> tag (full title stays as headline). */
  shortTitle?: string;
  /** Optional byline override (e.g. the academic name on a published paper). */
  author?: string;
};

function readMarkdownMeta(filePath: string, slug: string): Post {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);
  return {
    slug,
    title: data.title || '未命名',
    date: data.date || '',
    category: data.category || 'Uncategorized',
    excerpt: data.excerpt,
    type: 'article',
  };
}

/** A frontmatter `slug` overrides the filename, enabling short URLs. */
function effectiveSlug(data: Record<string, unknown>, fileName: string): string {
  if (typeof data.slug === 'string' && data.slug.trim()) return data.slug.trim();
  return fileName.replace(/\.md$/, '');
}

/** Articles: `content/*.md` (root) and `content/articles/*.md` */
const getArticleEntries = cache((): { slug: string; filePath: string }[] => {
  const results: { slug: string; filePath: string }[] = [];

  const collect = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const filePath = path.join(dir, file);
      if (!fs.statSync(filePath).isFile()) continue;
      const { data } = matter(fs.readFileSync(filePath, 'utf8'));
      results.push({ slug: effectiveSlug(data, file), filePath });
    }
  };

  collect(contentDir);
  collect(path.join(contentDir, 'articles'));

  return results;
});

function resolveArticlePath(slug: string): string | null {
  const entry = getArticleEntries().find((e) => e.slug === slug);
  return entry ? entry.filePath : null;
}

export const getArticles = cache((): Post[] => {
  const articles = getArticleEntries().map(({ slug, filePath }) =>
    readMarkdownMeta(filePath, slug)
  );
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

export const getPostBySlug = cache((slug: string): PostWithContent | null => {
  const decodedSlug = decodeURIComponent(slug).replace(/\.md$/, '');
  const filePath = resolveArticlePath(decodedSlug);
  if (!filePath) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: decodedSlug,
    title: data.title || '未命名',
    shortTitle: typeof data.shortTitle === 'string' ? data.shortTitle : undefined,
    author: typeof data.author === 'string' ? data.author : undefined,
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category || 'Uncategorized',
    excerpt: data.excerpt,
    type: 'article',
    content,
  };
});

export function formatDisplayDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
