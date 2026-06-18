import type { Metadata } from 'next';
import './globals.css';
import { SITE_URL } from '@/lib/site';
import KofiWidget from '@/app/components/KofiWidget';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: { 'application/rss+xml': `${SITE_URL}/feed.xml` },
  },
  title: {
    default: 'BillCharles Blog',
    template: '%s · BillCharles Blog',
  },
  description:
    'Personal academic blog of Bill Charles — essays and notes on Western philosophy, post-Marxism, psychoanalysis, and cryptography.',
  authors: [{ name: 'Bill Charles' }],
  keywords: [
    'Bill Charles',
    'Philosophy',
    'Post-Marxism',
    'Psychoanalysis',
    'Cryptography',
    'DAO',
    'Blog',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'BillCharles Blog',
    title: 'BillCharles Blog',
    description:
      'Essays and notes on Western philosophy, post-Marxism, psychoanalysis, and cryptography.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillCharles Blog',
    description:
      'Essays and notes on Western philosophy, post-Marxism, psychoanalysis, and cryptography.',
  },
  robots: { index: true, follow: true },
};

// Applies the saved theme before first paint to avoid a light/dark flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-screen bg-paper text-ink font-serif antialiased selection:bg-accent/15"
        suppressHydrationWarning
      >
        {children}
        <KofiWidget />
      </body>
    </html>
  );
}
