'use client';

// Ko-fi floating "Support me" button — home page only.
//
// Ko-fi injects its button straight into <body>, outside React's tree, so it
// survives client-side navigation. We manage the script by hand and reconcile
// on every route change: draw the button on "/", and remove the injected DOM
// everywhere else (and on unmount).
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const KOFI_SRC = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
const SCRIPT_ID = 'kofi-overlay-script';

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (username: string, config: Record<string, string>) => void;
    };
  }
}

function removeKofi() {
  document
    .querySelectorAll(
      '[class*="floatingchat-container-wrap"], [class*="floating-chat-kofi-popup-iframe"]'
    )
    .forEach((el) => el.remove());
}

function drawKofi() {
  // Clear any existing instance first so we never stack duplicates.
  removeKofi();
  window.kofiWidgetOverlay?.draw('billcharles', {
    type: 'floating-chat',
    'floating-chat.donateButton.text': 'Support me',
    // Match the site's claret accent instead of Ko-fi's default coral.
    'floating-chat.donateButton.background-color': '#8a2e38',
    'floating-chat.donateButton.text-color': '#ffffff',
  });
}

export default function KofiWidget() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') {
      removeKofi();
      return;
    }

    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;

    const ensureDrawn = () => {
      if (cancelled) return true; // navigated away before the script was ready
      if (window.kofiWidgetOverlay) {
        drawKofi();
        return true;
      }
      return false;
    };

    if (!ensureDrawn()) {
      if (document.getElementById(SCRIPT_ID)) {
        // Script tag exists but the global isn't ready yet — wait for it.
        poll = setInterval(() => {
          if (ensureDrawn()) clearInterval(poll);
        }, 200);
      } else {
        const script = document.createElement('script');
        script.id = SCRIPT_ID;
        script.src = KOFI_SRC;
        script.async = true;
        script.onload = () => ensureDrawn();
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      removeKofi();
    };
  }, [pathname]);

  return null;
}
