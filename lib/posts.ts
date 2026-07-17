// lib/posts.ts
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

const ARTICLE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ArticleEntry = {
  slug: string;
  filePath: string;
  raw: string;
};

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

function readMarkdownMeta(raw: string, slug: string): Post {
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

export function isValidArticleSlug(slug: string): boolean {
  return ARTICLE_SLUG_PATTERN.test(slug);
}

/** Articles: `content/*.md` (root) and `content/articles/*.md` */
const getArticleEntries = cache((): ArticleEntry[] => {
  const results: ArticleEntry[] = [];
  const seenSlugs = new Map<string, string>();

  const register = (filePath: string, fileName: string, raw: string) => {
    const { data } = matter(raw);
    const slug = effectiveSlug(data, fileName);
    if (!isValidArticleSlug(slug)) {
      throw new Error(
        `Invalid article slug "${slug}" in ${path.relative(process.cwd(), filePath)}. ` +
          'Use lowercase letters, numbers, and single hyphens only.'
      );
    }
    const existing = seenSlugs.get(slug);
    if (existing) {
      throw new Error(
        `Duplicate article slug "${slug}" in ${path.relative(process.cwd(), existing)} ` +
          `and ${path.relative(process.cwd(), filePath)}.`
      );
    }
    seenSlugs.set(slug, filePath);
    results.push({ slug, filePath, raw });
  };

  for (const entry of fs.readdirSync(path.join(process.cwd(), 'content'), {
    withFileTypes: true,
  })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const filePath = path.join(process.cwd(), 'content', entry.name);
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'content', entry.name),
      'utf8'
    );
    register(filePath, entry.name, raw);
  }

  const nestedDir = path.join(process.cwd(), 'content', 'articles');
  if (fs.existsSync(nestedDir)) {
    for (const entry of fs.readdirSync(
      path.join(process.cwd(), 'content', 'articles'),
      { withFileTypes: true }
    )) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const filePath = path.join(process.cwd(), 'content', 'articles', entry.name);
      const raw = fs.readFileSync(
        path.join(process.cwd(), 'content', 'articles', entry.name),
        'utf8'
      );
      register(filePath, entry.name, raw);
    }
  }

  return results;
});

function resolveArticleEntry(slug: string): ArticleEntry | null {
  if (!isValidArticleSlug(slug)) return null;
  const entry = getArticleEntries().find((e) => e.slug === slug);
  return entry ?? null;
}

export const getArticles = cache((): Post[] => {
  const articles = getArticleEntries().map(({ slug, raw }) =>
    readMarkdownMeta(raw, slug)
  );
  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

export const getPostBySlug = cache((slug: string): PostWithContent | null => {
  // Next.js route params are already decoded; decoding again can turn valid
  // percent literals into malformed input.
  const normalizedSlug = slug.replace(/\.md$/, '');
  const entry = resolveArticleEntry(normalizedSlug);
  if (!entry) return null;

  const { data, content } = matter(entry.raw);

  return {
    slug: normalizedSlug,
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
