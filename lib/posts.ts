// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
};

export type PostWithContent = Post & {
  content: string;
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

  return allPostsData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getPostBySlug(slug: string): PostWithContent | null {
  // Decode in case slug is URL-encoded (e.g. Chinese filenames)
  const decodedSlug = decodeURIComponent(slug).replace(/\.md$/, '');
  const fullPath = path.join(contentDirectory, `${decodedSlug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: decodedSlug,
      title: data.title || '未命名文章',
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category || 'Uncategorized',
      excerpt: data.excerpt,
      content,
    };
  } catch {
    return null;
  }
}
