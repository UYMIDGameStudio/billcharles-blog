// app/components/JsonLd.tsx
// Renders a <script type="application/ld+json"> block for structured data (SEO).

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

export function serializeJsonLd(data: JsonLdProps['data']): string {
  // Prevent author-controlled strings from closing the surrounding script tag.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
