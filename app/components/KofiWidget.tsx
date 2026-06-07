'use client';

// Ko-fi floating "Support me" button. Loads the Ko-fi overlay script during
// browser idle time, then draws the floating button in the site's claret color.
import Script from 'next/script';

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: Record<string, string>) => void;
    };
  }
}

export default function KofiWidget() {
  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="lazyOnload"
      onLoad={() => {
        window.kofiWidgetOverlay?.draw('billcharles', {
          type: 'floating-chat',
          'floating-chat.donateButton.text': 'Support me',
          // Match the site's claret accent instead of Ko-fi's default coral.
          'floating-chat.donateButton.background-color': '#8a2e38',
          'floating-chat.donateButton.text-color': '#ffffff',
        });
      }}
    />
  );
}
