// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;     // "Cryptography Column" 或 "Humanities Column"
  excerpt?: string;
};

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(contentDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || '未命名文章',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'Uncategorized',
        excerpt: data.excerpt,
      } as Post;
    });

  // 按日期最新在前排序
  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}