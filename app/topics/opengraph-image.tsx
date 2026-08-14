import { renderOgCard } from '@/lib/og-card';
import { OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = 'Topics on BillCharles Blog';

export default function Image() {
  return renderOgCard({
    eyebrow: 'BROWSE BY SUBJECT',
    title: 'Topics',
    description: 'Explore the archive by research area and form.',
  });
}
