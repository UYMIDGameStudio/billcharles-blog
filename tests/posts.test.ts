import { describe, expect, it } from 'vitest';
import {
  getArticles,
  getPostBySlug,
  isValidArticleSlug,
  RETIRED_ARTICLE_SLUGS,
  parseFrontmatter,
} from '../lib/posts';

describe('article frontmatter', () => {
  it('preserves YAML dates, multiline metadata and the Markdown body', () => {
    const raw = '---\ntitle: "測試: YAML"\ndate: 2026-10-11\nexcerpt: |\n  first line\n  second line\n---\n# Heading\n\nBody with --- inside.\n';
    const { data, content } = parseFrontmatter(raw);
    expect(data.title).toBe('測試: YAML');
    expect(data.date).toEqual(new Date('2026-10-11T00:00:00.000Z'));
    expect(data.excerpt).toBe('first line\nsecond line\n');
    expect(content).toBe('# Heading\n\nBody with --- inside.\n');
  });

  it('rejects executable YAML tags', () => {
    expect(() => parseFrontmatter('---\nvalue: !!js/function "function () {}"\n---\nBody')).toThrow();
  });

  it('limits repeated empty YAML merge sources', () => {
    const sources = Array(200).fill('{}').join(',');
    const targets = '  - <<: *sources\n'.repeat(200);
    expect(() => parseFrontmatter(`---\nsources: &sources [${sources}]\ntargets:\n${targets}---\nBody`)).toThrow();
  });
});

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
