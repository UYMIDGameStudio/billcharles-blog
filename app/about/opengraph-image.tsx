import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'About Bill Charles and Wang Xinhua';

export default function Image() {
  return renderOgCard({
    eyebrow: 'AUTHOR PROFILE',
    title: 'Bill Charles · Wang Xinhua',
    description: 'Research in Western philosophy, post-Marxism, and psychoanalysis.',
  });
}
