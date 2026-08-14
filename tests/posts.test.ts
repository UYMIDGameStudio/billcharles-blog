import { describe, expect, it } from 'vitest';
import {
  getArticles,
  getPostBySlug,
  isValidArticleSlug,
  RETIRED_ARTICLE_SLUGS,
} from '../lib/posts';

describe('article slugs', () => {
  it('accepts canonical URL-safe slugs', () => {
    expect(isValidArticleSlug('knowledge-systems-change-and-invariance')).toBe(true);
  });

  it.each(['Uppercase', 'two--hyphens', 'has space', 'has/slash', 'has%percent'])(
    'rejects invalid slug %s',
    (slug) => {
      expect(isValidArticleSlug(slug)).toBe(false);
    }
  );

  it('keeps every current article slug valid and unique', () => {
    const slugs = getArticles().map((article) => article.slug);

    expect(slugs.every(isValidArticleSlug)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('returns null instead of throwing for malformed route input', () => {
    expect(getPostBySlug('%')).toBeNull();
  });

  it('keeps retired redirects out of every article collection', () => {
    const slugs = getArticles().map((article) => article.slug);
    expect(slugs).not.toEqual(expect.arrayContaining([...RETIRED_ARTICLE_SLUGS]));
  });
});
