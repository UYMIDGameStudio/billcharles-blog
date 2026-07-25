// lib/topics.ts — crawlable topic (category) pages.
// The `/articles` filter is client-side only, so category views had no URL of
// their own. These give every category a real, indexable page.
import { getArticles, type Post } from './posts';

export type Topic = {
  slug: string;
  name: string;
  description: string;
  posts: Post[];
};

/** "Philosophy of Science" -> "philosophy-of-science" */
export function topicSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Hand-written so each topic page has its own substance rather than a
 * templated sentence with the name swapped in.
 */
const DESCRIPTIONS: Record<string, string> = {
  philosophy:
    'Essays on Western philosophy — the epistemology of modernity, Kant on the limits of reason, and the questions modern thought inherited from the Scientific Revolution.',
  'philosophy-of-science':
    'How systems of knowledge evolve: theoretical identity, what persists as a theory changes, and the dialectic between transformation and invariance.',
  essay:
    'Long-form essays — on rigour and what it costs, on public discourse, and on the distance between a structure and the body that stands in for it.',
  cryptography:
    'Research notes on cryptography, Web3, and decentralized systems — tokenized real-world assets, on-chain collateral, and DAO governance.',
};

function describe(name: string, slug: string): string {
  return (
    DESCRIPTIONS[slug] ??
    `Essays and notes filed under ${name} on BillCharles Blog.`
  );
}

/** Every topic that has at least one article, ordered by article count. */
export function getTopics(): Topic[] {
  const byName = new Map<string, Post[]>();
  for (const post of getArticles()) {
    const list = byName.get(post.category);
    if (list) list.push(post);
    else byName.set(post.category, [post]);
  }

  return Array.from(byName, ([name, posts]) => {
    const slug = topicSlug(name);
    return { slug, name, description: describe(name, slug), posts };
  }).sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export function getTopic(slug: string): Topic | null {
  return getTopics().find((t) => t.slug === slug) ?? null;
}
