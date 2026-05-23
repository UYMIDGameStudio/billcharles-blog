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
  type: 'article' | 'note';   // 新增
};

export const getAllPosts = cache((): Post[] => {
  const allPosts: Post[] = [];

  // 读取 articles
  const articlesDir = path.join(contentDir, 'articles');
  if (fs.existsSync(articlesDir)) {
    const files = fs.readdirSync(articlesDir);
    files.filter(f => f.endsWith('.md')).forEach(file => {
      const content = fs.readFileSync(path.join(articlesDir, file), 'utf8');
      const { data } = matter(content);
      allPosts.push({
        slug: file.replace(/\.md$/, ''),
        title: data.title || '未命名',
        date: data.date || '',
        category: data.category || 'Uncategorized',
        excerpt: data.excerpt,
        type: 'article' as const,
      });
    });
  }

  // 读取 notes
  const notesDir = path.join(contentDir, 'notes');
  if (fs.existsSync(notesDir)) {
    const files = fs.readdirSync(notesDir);
    files.filter(f => f.endsWith('.md')).forEach(file => {
      const content = fs.readFileSync(path.join(notesDir, file), 'utf8');
      const { data } = matter(content);
      allPosts.push({
        slug: file.replace(/\.md$/, ''),
        title: data.title || '未命名笔记',
        date: data.date || '',
        category: 'Note',
        excerpt: data.excerpt,
        type: 'note' as const,
      });
    });
  }

  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});