// app/opengraph-image.tsx — default social share image for the whole site.
import { ImageResponse } from 'next/og';
import { loadOgFonts, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og';
import { SITE_NAME, SITE_URL } from '@/lib/site';

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${SITE_NAME} — personal academic blog`;

const TAGLINE =
  'Essays & notes on Western philosophy, post-Marxism, psychoanalysis & cryptography.';
const LABEL = 'PERSONAL ACADEMIC BLOG';
const domain = new URL(SITE_URL).host;

export default async function Image() {
  const fonts = await loadOgFonts(`${SITE_NAME}${TAGLINE}${LABEL}${domain}`);

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
          padding: '80px',
          fontFamily: 'Noto Sans SC',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#a8a29e',
          }}
        >
          {LABEL}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 88,
              fontWeight: 700,
              color: '#1c1917',
              lineHeight: 1.1,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 34,
              fontWeight: 400,
              color: '#57534e',
              marginTop: 24,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {TAGLINE}
          </div>
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
          {domain}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
