export const SITE_URL = 'https://www.billcharles.net';
export const SITE_NAME = 'BillCharles Blog';
export const SITE_DESCRIPTION =
  'Personal academic blog of Bill Charles — essays and notes on Western philosophy, post-Marxism, psychoanalysis, and cryptography.';

export const AUTHOR_NAME = 'Bill Charles';
export const AUTHOR_ORCID = 'https://orcid.org/0009-0000-4322-5195';
export const AUTHOR_EMAIL = 'billcharles310012@gmail.com';

/** 将 frontmatter 日期转为 sitemap 可用的 Date；无效则返回 undefined */
export function toSitemapLastModified(date: string): Date | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
