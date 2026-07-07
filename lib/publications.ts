// lib/publications.ts — formal academic publications (distinct from blog articles).
// `title` is the SINGLE canonical English title; the article frontmatter title in
// content/ must be kept byte-for-byte identical to it.

export type Publication = {
  authors: string;
  year: number;
  title: string;
  venue: string;
  abstract?: string; // one-paragraph summary shown on the home Publications list
  links: { label: string; href: string }[];
  articleSlug?: string; // present if there is an on-site copy
};

export const PUBLICATIONS: Publication[] = [
  {
    authors: 'Wang Xinhua',
    year: 2026,
    title:
      'The Dynamic Dialectic of Knowledge System Evolution: On "Change" and "Invariance" in Theoretical Identity',
    venue: '3rd Zhejiang Secondary School Philosophy Conference',
    abstract:
      'A study of how systems of knowledge evolve — what persists as a theory’s identity through transformation, and what must change for it to remain true.',
    links: [
      { label: 'PhilPapers record', href: 'https://philpapers.org/rec/WANTDD-2' },
      { label: 'Zenodo (DOI)', href: 'https://doi.org/10.5281/zenodo.20586216' },
    ],
    articleSlug: 'knowledge-systems-change-and-invariance',
  },
];
