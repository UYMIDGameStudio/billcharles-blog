import { describe, expect, it } from 'vitest';
import { getArticles, isValidArticleSlug, ogLocale, resolveLang } from '../lib/posts';
import { getTopic, getTopics, topicSlug } from '../lib/topics';

describe('post language', () => {
  it('prefers an explicit frontmatter lang over the heuristic', () => {
    // A Traditional essay has a Chinese title but must not be tagged zh-Hans.
    expect(resolveLang({ lang: 'zh-Hant' }, '結構的替身')).toBe('zh-Hant');
  });

  it('falls back to script detection when lang is absent', () => {
    expect(resolveLang({}, '回到粗糙的地面')).toBe('zh-Hans');
    expect(resolveLang({}, 'Tokenized Gold')).toBe('en');
  });

  it('ignores a blank lang', () => {
    expect(resolveLang({ lang: '   ' }, 'Tokenized Gold')).toBe('en');
  });

  it('declares a language for every article', () => {
    for (const post of getArticles()) {
      expect(post.lang, post.slug).toMatch(/^(en|zh-Han[st])$/);
    }
  });

  it('maps BCP-47 tags to Open Graph locales', () => {
    expect(ogLocale('zh-Hant')).toBe('zh_HK');
    expect(ogLocale('zh-Hans')).toBe('zh_CN');
    expect(ogLocale('en')).toBe('en_US');
  });
});

describe('topics', () => {
  it('slugifies category names into URL-safe segments', () => {
    expect(topicSlug('Philosophy of Science')).toBe('philosophy-of-science');
    expect(topicSlug('Cryptography')).toBe('cryptography');
  });

  it('produces a valid, resolvable slug for every topic', () => {
    const topics = getTopics();
    expect(topics.length).toBeGreaterThan(0);

    for (const topic of topics) {
      expect(isValidArticleSlug(topic.slug), topic.name).toBe(true);
      expect(getTopic(topic.slug)?.name).toBe(topic.name);
      expect(topic.posts.length).toBeGreaterThan(0);
    }
  });

  it('covers every article exactly once across topics', () => {
    const grouped = getTopics().flatMap((t) => t.posts.map((p) => p.slug));
    const all = getArticles().map((p) => p.slug);

    expect(grouped.sort()).toEqual(all.sort());
  });

  it('gives each topic its own description', () => {
    const descriptions = getTopics().map((t) => t.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('returns null for an unknown topic', () => {
    expect(getTopic('no-such-topic')).toBeNull();
  });
});
