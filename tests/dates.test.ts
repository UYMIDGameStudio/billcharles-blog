import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const postsUrl = pathToFileURL(path.resolve('lib/posts.ts')).href;

describe('calendar dates across deployment time zones', () => {
  it.each(['UTC', 'America/Los_Angeles', 'Asia/Shanghai'])('preserves the publication day in %s', (timeZone) => {
    const script = 'import { formatDisplayDate } from ' + JSON.stringify(postsUrl) + '; console.log(formatDisplayDate("2026-08-09"));';
    const result = execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', script], {
      encoding: 'utf8',
      env: { ...process.env, TZ: timeZone, NODE_NO_WARNINGS: '1' },
    });
    expect(result.trim()).toBe('August 9, 2026');
  });
});
