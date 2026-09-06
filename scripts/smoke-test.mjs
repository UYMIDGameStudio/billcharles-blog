import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Run against the freshly built application, without contacting the public site.
const port = process.env.SMOKE_PORT ?? '3210';
const base = 'http://127.0.0.1:' + port;
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', port], {
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
let launchError;
server.on('error', (error) => { launchError = error; });
server.stdout.on('data', (chunk) => { output += chunk; });
server.stderr.on('data', (chunk) => { output += chunk; });

async function request(path) {
  return fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(10000) });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    if (launchError) throw launchError;
    if (server.exitCode !== null) throw new Error('Preview server exited: ' + output);
    if (output.includes('Ready in')) { ready = true; break; }
    await delay(250);
  }
  assert(ready, 'Preview server did not become ready: ' + output);
  const sitemapResponse = await request('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  assert(paths.length > 0, 'Sitemap must contain pages');
  assert.equal(new Set(paths).size, paths.length, 'Canonical URLs must be unique');
  assert(!paths.some((path) => path === '/notes' || path.startsWith('/notes/')), 'Retired Notes must stay out of the sitemap');
  const images = new Set();
  for (const path of paths) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert(response.headers.get('content-security-policy')?.includes("object-src 'none'"), path + ': CSP');
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff', path);
    const html = await response.text();
    assert(html.includes('<h1'), path + ': missing heading');
    assert(html.includes('application/rss+xml'), path + ': RSS discovery');
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
    assert(canonical, path + ': canonical');
    assert.equal(new URL(canonical[1]).pathname, path, path + ': canonical mismatch');
    const twitterTitle = html.match(/<meta name="twitter:title" content="([^"]+)"/);
    assert(twitterTitle, path + ': Twitter title');
    if (path !== '/') assert.notEqual(twitterTitle[1], 'BillCharles Blog', path + ': inherited homepage title');
    for (const image of html.matchAll(/<meta (?:property="og:image"|name="twitter:image") content="([^"]+)"/g)) {
      const url = new URL(image[1]);
      images.add(url.pathname + url.search);
    }
  }
  for (const path of images) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert(response.headers.get('content-type')?.includes('image/png'), path + ': image type');
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert.deepEqual([...bytes.slice(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], path + ': PNG signature');
  }
  for (const section of ['articles', 'notes', 'topics']) {
    for (const suffix of ['%', '%E0%A4%A', 'not-a-published-item', 'example/extra']) {
      const path = '/' + section + '/' + suffix;
      assert.equal((await request(path)).status, 404, path);
    }
  }
  // Main intentionally retired Notes; do not resurrect its pages or images.
  for (const path of [
    '/notes',
    '/notes/opengraph-image',
    '/notes/2026-05-10-dao-and-bwo',
    '/notes/2026-04-28-objectivity',
    '/notes/2026-04-15-commodity-fetishism-nft',
    '/notes/2026-05-10-dao-and-bwo/opengraph-image',
  ]) assert.equal((await request(path)).status, 404, path);
  const llms = await (await request('/llms.txt')).text();
  assert(!llms.includes('/notes'), 'Retired Notes must stay out of llms.txt');
  const redirect = await request('/articles/psychoanalysis-intro');
  assert.equal(redirect.status, 308);
  assert(redirect.headers.get('location')?.endsWith('/articles/modernity-epistemology-bacon-to-kant'));
  for (const path of ['/feed.xml', '/llms.txt', '/robots.txt']) assert.equal((await request(path)).status, 200, path);
  console.log('Production smoke test passed: ' + paths.length + ' pages, ' + images.size + ' share images, error routes and redirects.');
} finally {
  server.kill();
}
