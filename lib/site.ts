export const SITE_URL = 'https://www.billcharles.net';
export const SITE_NAME = 'BillCharles Blog';
export const SITE_DESCRIPTION =
  'Personal academic blog of Bill Charles — essays and notes on Western philosophy, post-Marxism, psychoanalysis, and cryptography.';

export const RSS_URL = `${SITE_URL}/feed.xml`;
/** Reuse in each page's `alternates` so the RSS link survives metadata merging. */
export const RSS_ALTERNATE_TYPES = { 'application/rss+xml': RSS_URL };

export const AUTHOR_NAME = 'Bill Charles';
export const AUTHOR_ORCID = 'https://orcid.org/0009-0000-4322-5195';
export const AUTHOR_EMAIL = 'billcharles310012@gmail.com';

export const AUTHOR_ACADEMIC_NAME = 'Wang Xinhua'; // matches the PhilPapers record byline
export const AUTHOR_NAME_HANZI = '王鑫桦';          // legal Chinese name (NOT 王欣华)
export const AUTHOR_ORCID_ID = '0009-0000-4322-5195';
export const AUTHOR_SCHOLAR = 'https://scholar.google.com/citations?user=9gI3scEAAAAJ';

// Canonical Person node — reused on the home page and /about (same @id = one entity).
export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: AUTHOR_NAME,
  alternateName: [AUTHOR_ACADEMIC_NAME, 'Xinhua Wang', AUTHOR_NAME_HANZI],
  url: SITE_URL,
  image: `${SITE_URL}/image_0.png`,
  email: AUTHOR_EMAIL,
  description:
    'Student researcher in Western philosophy, post-Marxism, and psychoanalysis, based in Zhejiang, China; Secretary-General of the organizing committee of the Zhejiang Secondary School Philosophy Conference (SSPC).',
  jobTitle: 'Secretary-General, Organizing Committee',
  affiliation: {
    '@type': 'Organization',
    name: 'Zhejiang Secondary School Philosophy Conference (SSPC)',
  },
  identifier: { '@type': 'PropertyValue', propertyID: 'ORCID', value: AUTHOR_ORCID_ID },
  sameAs: [AUTHOR_ORCID, AUTHOR_SCHOLAR],
  knowsAbout: [
    'Western Philosophy',
    'Post-Marxism',
    'Psychoanalysis',
    'Political Economy',
    'Cryptography',
    'DAO',
  ],
};

// Canonical WebSite + Organization nodes (one @id each) so articles can reference
// them via isPartOf / publisher and processors merge the entity graph.
export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/image_0.png`,
  founder: { '@id': `${SITE_URL}/#author` },
};

/** 将 frontmatter 日期转为 sitemap 可用的 Date；无效则返回 undefined */
export function toSitemapLastModified(date: string): Date | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
