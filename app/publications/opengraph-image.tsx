import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Academic publications by Wang Xinhua';

export default function Image() {
  return renderOgCard({
    eyebrow: 'ACADEMIC RECORD',
    title: 'Publications',
    description: 'Papers with DOI archives and permanent citation records.',
  });
}
