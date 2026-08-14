import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Essays and articles by Bill Charles';

export default function Image() {
  return renderOgCard({
    eyebrow: 'ARTICLE ARCHIVE',
    title: 'Essays & Articles',
    description: 'Philosophy, knowledge systems, political economy, and cryptography.',
  });
}
