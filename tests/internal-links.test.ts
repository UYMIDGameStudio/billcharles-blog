import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const aboutPage = readFileSync(join(process.cwd(), 'app/about/page.tsx'), 'utf8');

describe('critical internal links', () => {
  it.each(['/publications', '/articles'])(
    'uses a native same-tab navigation for %s',
    (href) => {
      const escapedHref = href.replace('/', '\\/');
      const linkPattern = new RegExp(
        `<a\\s+href=["']${escapedHref}["'][^>]*>`,
        'm'
      );

      expect(aboutPage).toMatch(linkPattern);
    }
  );

  it('does not opt the About page links into downloads or new tabs', () => {
    expect(aboutPage).not.toMatch(/<(?:a|Link)[^>]+download(?:=|\s|>)/);
    expect(aboutPage).not.toMatch(
      /<a\s+href=["']\/(?:publications|articles)["'][^>]+target=/
    );
  });
});
