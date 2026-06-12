// lib/og.ts — helpers for dynamically generated OpenGraph images (next/og).
// Loads a subsetted Noto Sans SC font at build time so titles render in both
// Latin and CJK without bundling a multi-megabyte font file.

type FontWeight = 400 | 700;

async function loadGoogleFont(
  text: string,
  weight: FontWeight
): Promise<ArrayBuffer> {
  // Deduplicate characters to keep the request URL short.
  const subset = Array.from(new Set(Array.from(text))).join('');
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@${weight}&text=${encodeURIComponent(
    subset
  )}`;
  // With no special User-Agent, Google serves TrueType (satori cannot read
  // woff2/eot). Prefer an explicitly truetype-tagged source when present.
  const css = await fetch(url).then((res) => res.text());
  const ttf = css.match(/src:\s*url\(([^)]+)\)\s*format\('truetype'\)/);
  const any = css.match(/src:\s*url\(([^)]+)\)/);
  const fontUrl = ttf?.[1] ?? any?.[1];
  if (!fontUrl) throw new Error(`Could not resolve a font URL for "${subset}"`);
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: 'normal';
};

/**
 * Load regular + bold Noto Sans SC subsets covering exactly `text`.
 * Returns an empty array if the fonts can't be fetched (e.g. no network during
 * build) so OG image generation falls back to the default font instead of
 * failing the whole build.
 */
export async function loadOgFonts(text: string): Promise<OgFont[]> {
  try {
    const [regular, bold] = await Promise.all([
      loadGoogleFont(text, 400),
      loadGoogleFont(text, 700),
    ]);
    return [
      { name: 'Noto Sans SC', data: regular, weight: 400, style: 'normal' },
      { name: 'Noto Sans SC', data: bold, weight: 700, style: 'normal' },
    ];
  } catch (err) {
    console.warn('[og] font load failed, using default font:', err);
    return [];
  }
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';
