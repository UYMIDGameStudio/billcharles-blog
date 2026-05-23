export const SITE_URL = 'https://www.billcharles.net';

/** 将 frontmatter 日期转为 sitemap 可用的 Date；无效则返回 undefined */
export function toSitemapLastModified(date: string): Date | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
