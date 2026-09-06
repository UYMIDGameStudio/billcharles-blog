// lib/posts.ts
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

const ARTICLE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RETIRED_ARTICLE_SLUGS = ['psychoanalysis-intro'] as const;
const retiredArticleSlugs = new Set<string>(RETIRED_ARTICLE_SLUGS);

type ArticleEntry = {
  slug: string;
  filePath: string;
  raw: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  excerpt?: string;
  /** BCP-47 tag, e.g. 'en', 'zh-Hant', 'zh-Hans'. */
  lang: string;
  type: 'article';
};

export type Note = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  category: string;
  excerpt?: string;
  tags: string[];
  lang: string;
  type: 'note';
};

const CJK = /[一-鿿]/;

/**
 * Language of a post. A frontmatter `lang` always wins — the script of a
 * Chinese post (Traditional vs Simplified) cannot be inferred from the title
 * alone, so it must be declared. The heuristic is only a fallback.
 */
export function resolveLang(data: Record<string, unknown>, title: string): string {
  if (typeof data.lang === 'string' && data.lang.trim()) return data.lang.trim();
  return CJK.test(title) ? 'zh-Hans' : 'en';
}

/** Open Graph wants `zh_HK`-style locales, not BCP-47 tags. */
export function ogLocale(lang: string): string {
  const map: Record<string, string> = {
    'zh-Hant': 'zh_HK',
    'zh-Hans': 'zh_CN',
    en: 'en_US',
  };
  return map[lang] ?? lang.replace('-', '_');
}

export type PostWithContent = Post & {
  content: string;
  /** Optional shorter title for the <title> tag (full title stays as headline). */
  shortTitle?: string;
  /** Optional byline override (e.g. the academic name on a published paper). */
  author?: string;
};

export type NoteWithContent = Note & { content: string };

function frontmatterDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().split('T')[0];
  return typeof value === 'string' ? value : '';
}

function readMarkdownMeta(raw: string, slug: string): Post {
  const { data } = matter(raw);
  const title = data.title || '未命名';
  return {
    slug,
    title,
    date: frontmatterDate(data.date),
    updated: frontmatterDate(data.updated) || undefined,
    category: data.category || 'Uncategorized',
    excerpt: data.excerpt,
    lang: resolveLang(data, title),
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
    // Keep retired source files available for reference while ensuring they
    // never re-enter archives, static params, feeds, or the sitemap.
    if (retiredArticleSlugs.has(slug)) return;
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
  const title = data.title || '未命名';

  return {
    slug: normalizedSlug,
    title,
    shortTitle: typeof data.shortTitle === 'string' ? data.shortTitle : undefined,
    author: typeof data.author === 'string' ? data.author : undefined,
    date: frontmatterDate(data.date),
    updated: frontmatterDate(data.updated) || undefined,
    category: data.category || 'Uncategorized',
    excerpt: data.excerpt,
    lang: resolveLang(data, title),
    type: 'article',
    content,
  };
});

type NoteEntry = {
  slug: string;
  raw: string;
};

const getNoteEntries = cache((): NoteEntry[] => {
  const notesDir = path.join(process.cwd(), 'app', 'content', 'notes');
  if (!fs.existsSync(notesDir)) return [];

  const seenSlugs = new Set<string>();
  return fs
    .readdirSync(notesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => {
      const raw = fs.readFileSync(path.join(notesDir, entry.name), 'utf8');
      const { data } = matter(raw);
      const slug = effectiveSlug(data, entry.name);
      if (!isValidArticleSlug(slug)) {
        throw new Error(`Invalid note slug "${slug}" in app/content/notes/${entry.name}.`);
      }
      if (seenSlugs.has(slug)) {
        throw new Error(`Duplicate note slug "${slug}" in app/content/notes.`);
      }
      seenSlugs.add(slug);
      return { slug, raw };
    });
});

function readNote(entry: NoteEntry): NoteWithContent {
  const { data, content } = matter(entry.raw);
  const title = typeof data.title === 'string' ? data.title : 'Untitled note';
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === 'string')
    : [];

  return {
    slug: entry.slug,
    title,
    date: frontmatterDate(data.date),
    updated: frontmatterDate(data.updated) || undefined,
    category: typeof data.category === 'string' ? data.category : 'Notes',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
    tags,
    lang: resolveLang(data, title),
    type: 'note',
    content,
  };
}

export const getNotes = cache((): Note[] =>
  getNoteEntries()
    .map((entry) => {
      const note = readNote(entry);
      return {
        slug: note.slug,
        title: note.title,
        date: note.date,
        updated: note.updated,
        category: note.category,
        excerpt: note.excerpt,
        tags: note.tags,
        lang: note.lang,
        type: note.type,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

export const getNoteBySlug = cache((slug: string): NoteWithContent | null => {
  const normalizedSlug = slug.replace(/\.md$/, '');
  if (!isValidArticleSlug(normalizedSlug)) return null;
  const entry = getNoteEntries().find((note) => note.slug === normalizedSlug);
  return entry ? readNote(entry) : null;
});

export function formatDisplayDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
