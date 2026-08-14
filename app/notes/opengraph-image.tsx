import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Research notes by Bill Charles';

export default function Image() {
  return renderOgCard({
    eyebrow: 'RESEARCH NOTES',
    title: 'Notes & Reading Fragments',
    description: 'Short observations, reading logs, and questions in progress.',
  });
}
