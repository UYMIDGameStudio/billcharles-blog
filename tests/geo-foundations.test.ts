import { describe, expect, it } from 'vitest';
import robots from '../app/robots';
import sitemap from '../app/sitemap';

describe('GEO crawl foundations', () => {
  it('keeps retired redirects out of the canonical sitemap', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).not.toContain(
      'https://www.billcharles.net/articles/psychoanalysis-intro'
    );
    expect(urls).toContain('https://www.billcharles.net/notes');
    expect(urls).toContain('https://www.billcharles.net/editorial');
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('allows search retrieval while blocking selected training crawlers', () => {
    const rules = robots().rules;
    expect(Array.isArray(rules)).toBe(true);
    if (!Array.isArray(rules)) return;

    expect(rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ userAgent: 'OAI-SearchBot', allow: '/' }),
        expect.objectContaining({ userAgent: 'PerplexityBot', allow: '/' }),
        expect.objectContaining({ userAgent: 'GPTBot', disallow: '/' }),
        expect.objectContaining({ userAgent: 'Google-Extended', disallow: '/' }),
      ])
    );
  });
});
