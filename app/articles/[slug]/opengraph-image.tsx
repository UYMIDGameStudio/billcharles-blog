// app/articles/[slug]/opengraph-image.tsx — per-article social share image.
import { ImageResponse } from 'next/og';
import { formatDisplayDate, getArticles, getPostBySlug } from '@/lib/posts';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} article`;

// Prerender one image per article at build time.
export function generateStaticParams() {
  return getArticles().map((post) => ({ slug: encodeURIComponent(post.slug) }));
}

const domain = new URL(SITE_URL).host;

/** Smaller type for longer titles so they stay on-canvas. */
function titleFontSize(title: string): number {
  if (title.length > 80) return 46;
  if (title.length > 48) return 58;
  return 70;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? SITE_NAME;
  const meta = post
    ? [post.category, formatDisplayDate(post.date)].filter(Boolean).join('  ·  ')
    : '';

  const fonts = await loadOgFonts(`${title}${meta}${SITE_NAME}${domain}`);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F1EFEA',
          padding: '72px 80px',
          fontFamily: 'Noto Sans SC',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#a8a29e',
          }}
        >
          {meta}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: titleFontSize(title),
            fontWeight: 700,
            color: '#1c1917',
            lineHeight: 1.18,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 26,
            fontWeight: 400,
            color: '#78716c',
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: '#1c1917',
              marginRight: 16,
            }}
          />
          {SITE_NAME}　·　{domain}
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
