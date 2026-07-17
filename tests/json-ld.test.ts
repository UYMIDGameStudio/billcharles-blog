import { describe, expect, it } from 'vitest';
import { serializeJsonLd } from '../app/components/JsonLd';

describe('serializeJsonLd', () => {
  it('prevents a value from closing the script element', () => {
    const headline = '</script><script>alert("xss")</script>';
    const serialized = serializeJsonLd({ headline });

    expect(serialized).not.toContain('</script>');
    expect(JSON.parse(serialized)).toEqual({ headline });
  });
});
