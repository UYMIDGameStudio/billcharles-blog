import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif selection:bg-stone-200 pb-20"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
