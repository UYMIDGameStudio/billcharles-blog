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

// Exercise every guarded namespace, including archive and image endpoints.
describe.each(['articles', 'notes', 'topics'])('%s path validation', (section) => {
  it.each(['', '/', '/example', '/opengraph-image', '/example/opengraph-image'])('allows %s', (suffix) => {
    const response = proxy(new NextRequest(`https://www.billcharles.net/${section}${suffix}`));
    expect(response.headers.get('x-middleware-next')).toBe('1');
  });
  it.each(['/%', '/%E0%A4%A', '/%25', '/has%20space', '/example/extra'])('rejects %s before route decoding', (suffix) => {
    const response = proxy(new NextRequest(`https://www.billcharles.net/${section}${suffix}`));
    expect(response.status).toBe(404);
  });
});
