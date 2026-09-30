import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { describe, expect, it } from 'vitest';
import { getArticleHeadings, remarkArticleHeadings } from '../lib/article-headings';
import { getArticles, getPostBySlug } from '../lib/posts';

function renderedIds(markdown: string) {
  const html = renderToStaticMarkup(createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, remarkArticleHeadings],
  }, markdown));
  return [...html.matchAll(/<h2 id="([^"]+)">/g)].map((match) => match[1]);
}

describe('article heading navigation', () => {
  it('uses Markdown structure instead of matching heading-like text in code', () => {
    const markdown = ['# Title', '## First', '', '~~~md', '## Not a heading', '~~~', '', '    ## Indented code', '', 'Second', '------', '', '### Detail'].join('\n');
    expect(getArticleHeadings(markdown).map((heading) => heading.title)).toEqual(['First', 'Second']);
  });

  it('extracts readable titles from inline formatting, images and HTML', () => {
    const markdown = '## **Change** &amp; [trust](https://example.com) in `Lean 4` <em>today</em> ![diagram](x.png)';
    expect(getArticleHeadings(markdown)).toEqual([{
      title: 'Change & trust in Lean 4 today diagram',
      id: 'section-change-trust-in-lean-4-today-diagram',
    }]);
  });

  it('preserves Chinese and normalizes composed Unicode', () => {
    const markdown = '## 知識與「變化」\n\n## Cafe\u0301\n\n## Café';
    expect(getArticleHeadings(markdown).map((heading) => heading.id)).toEqual([
      'section-知識與變化', 'section-café', 'section-café-2',
    ]);
  });

  it('allocates unique IDs even when a heading already has a numeric suffix', () => {
    const markdown = '## Change\n\n## Change\n\n## Change-2\n\n## Change\n\n## !!!\n\n## !!!';
    expect(getArticleHeadings(markdown).map((heading) => heading.id)).toEqual([
      'section-change', 'section-change-2', 'section-change-2-2', 'section-change-3',
      'section-untitled', 'section-untitled-2',
    ]);
    expect(renderedIds(markdown)).toEqual(getArticleHeadings(markdown).map((heading) => heading.id));
  });

  it('leaves an essay with no sections without an outline', () => {
    expect(getArticleHeadings('An essay with **emphasis**, but no headings.')).toEqual([]);
  });

  it('keeps every real article outline aligned with its rendered heading targets', () => {
    for (const post of getArticles()) {
      const content = getPostBySlug(post.slug)!.content;
      const headings = getArticleHeadings(content);
      expect(renderedIds(content), post.slug).toEqual(headings.map((heading) => heading.id));
      expect(new Set(headings.map((heading) => heading.id)).size).toBe(headings.length);
    }
  });
});
