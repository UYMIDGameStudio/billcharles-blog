import { describe, expect, it } from 'vitest';
import { getArticles, getNotes, getPostBySlug } from '../lib/posts';
import { PUBLICATIONS } from '../lib/publications';
import { getTopics } from '../lib/topics';

describe('published content integrity', () => {
  it('requires usable metadata and valid calendar dates for every published item', () => {
    for (const post of [...getArticles(), ...getNotes()]) {
      expect(typeof post.title, post.slug).toBe('string');
      expect(post.title.trim(), post.slug).not.toBe('');
      expect(typeof post.category, post.slug).toBe('string');
      expect(post.category.trim(), post.slug).not.toBe('');
      if (post.excerpt !== undefined) expect(typeof post.excerpt, post.slug).toBe('string');
      for (const value of [post.date, post.updated].filter((d): d is string => d !== undefined)) {
        expect(value, post.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        const date = new Date(value);
        expect(Number.isNaN(date.getTime()), post.slug).toBe(false);
        expect(date.toISOString().slice(0, 10), post.slug).toBe(value);
      }
      if (post.updated) expect(post.updated >= post.date, post.slug).toBe(true);
    }
  });

  it('keeps publication links, titles and authors consistent with on-site copies', () => {
    for (const publication of PUBLICATIONS) {
      if (!publication.articleSlug) continue;
      const post = getPostBySlug(publication.articleSlug);
      expect(post, publication.articleSlug).not.toBeNull();
      expect(post?.title, publication.articleSlug).toBe(publication.title);
      expect(post?.author, publication.articleSlug).toBe(publication.authors);
    }
  });

  it('gives each category a distinct nonempty URL', () => {
    const topics = getTopics();
    expect(topics.every((topic) => Boolean(topic.slug))).toBe(true);
    expect(new Set(topics.map((topic) => topic.slug)).size).toBe(topics.length);
  });
});
