// lib/posts.ts
import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';

const contentDir = path.join(process.cwd(), 'content');
const notesDir = path.join(contentDir, 'notes');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
  type: 'article' | 'note';
};

export type PostWithContent = Post & {
  content: string;
};

export type Note = Post & {
  content: string;
  tags: string[];
};

function parseTags(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.tags)) {
    return data.tags.filter((t): t is string => typeof t === 'string');
  }
  if (typeof data.tags === 'string') {
    return data.tags.split(',').map((t) => t.trim()).filter(Boolean);
  }
  return [];
}

function readMarkdownMeta(
  filePath: string,
  slug: string,
  type: 'article' | 'note'
): Post {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data } = matter(raw);
  return {
    slug,
    title: data.title || (type === 'note' ? '未命名笔记' : '未命名'),
    date: data.date || '',
    category:
      type === 'note' ? data.category || 'Note' : data.category || 'Uncategorized',
    excerpt: data.excerpt,
    type,
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

function readNoteFile(filePath: string, slug: string): Note | null {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const body = content.trim();
  if (!body) return null;

  return {
    slug,
    title: data.title || '未命名笔记',
    date: data.date || '',
    category: data.category || 'Note',
    excerpt: data.excerpt,
    type: 'note',
    content: body,
    tags: parseTags(data),
  };
}

export const getAllPosts = cache((): Post[] => {
  const allPosts: Post[] = getArticleEntries().map(({ slug, filePath }) =>
    readMarkdownMeta(filePath, slug, 'article')
  );

  if (fs.existsSync(notesDir)) {
    for (const file of fs.readdirSync(notesDir)) {
      if (!file.endsWith('.md')) continue;
      const note = readNoteFile(path.join(notesDir, file), file.replace(/\.md$/, ''));
      if (note) {
        allPosts.push({
          slug: note.slug,
          title: note.title,
          date: note.date,
          category: note.category,
          excerpt: note.excerpt,
          type: note.type,
        });
      }
    }
  }

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

export const getArticles = cache((): Post[] =>
  getAllPosts().filter((post) => post.type === 'article')
);

export const getNotes = cache((): Note[] => {
  if (!fs.existsSync(notesDir)) return [];

  const notes: Note[] = [];
  for (const file of fs.readdirSync(notesDir)) {
    if (!file.endsWith('.md')) continue;
    const note = readNoteFile(path.join(notesDir, file), file.replace(/\.md$/, ''));
    if (note) notes.push(note);
  }

  return notes.sort(
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
