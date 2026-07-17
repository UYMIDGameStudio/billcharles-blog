import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { proxy } from '../proxy';

describe('article path proxy', () => {
  it('allows canonical article and Open Graph paths', () => {
    const article = proxy(
      new NextRequest('https://www.billcharles.net/articles/example-article')
    );
    const image = proxy(
      new NextRequest(
        'https://www.billcharles.net/articles/example-article/opengraph-image'
      )
    );

    expect(article.headers.get('x-middleware-next')).toBe('1');
    expect(image.headers.get('x-middleware-next')).toBe('1');
  });

  it.each([
    '/articles/%25',
    '/articles/has%20space',
    '/articles/two--hyphens',
    '/articles/example/extra-segment',
  ])('returns 404 for malformed article path %s', (pathname) => {
    const response = proxy(
      new NextRequest(`https://www.billcharles.net${pathname}`)
    );

    expect(response.status).toBe(404);
  });
});
