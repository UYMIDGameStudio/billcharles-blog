import { ImageResponse } from 'next/og';
import { loadOgFonts, OG_SIZE } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

type OgCardOptions = {
  eyebrow: string;
  title: string;
  description?: string;
};

function titleFontSize(title: string): number {
  const length = Array.from(title).length;
  if (length > 80) return 46;
  if (length > 52) return 56;
  return 70;
}

export async function renderOgCard({ eyebrow, title, description }: OgCardOptions) {
  const domain = new URL(SITE_URL).host;
  const fonts = await loadOgFonts(`${eyebrow}${title}${description ?? ''}${SITE_NAME}${domain}`);

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
            fontSize: 23,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#8a2e38',
          }}
        >
          {eyebrow}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1040 }}>
          <div
            style={{
              display: 'flex',
              fontSize: titleFontSize(title),
              fontWeight: 700,
              color: '#1c1917',
              lineHeight: 1.16,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: 'flex',
                marginTop: 22,
                maxWidth: 940,
                fontSize: 27,
                fontWeight: 400,
                color: '#57514a',
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 25,
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
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined }
  );
}
