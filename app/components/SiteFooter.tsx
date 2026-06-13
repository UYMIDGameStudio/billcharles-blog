// app/components/SiteFooter.tsx
import Link from 'next/link';
import { AUTHOR_EMAIL, AUTHOR_NAME, AUTHOR_ORCID } from '@/lib/site';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 mt-24 bg-[#F1EFEA]/60">
      <div className="max-w-5xl mx-auto px-6 py-12 font-sans text-sm text-stone-500 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
        <div className="space-y-1.5">
          <p className="font-bold text-stone-800 tracking-tight">{AUTHOR_NAME}</p>
          <p className="max-w-xs leading-relaxed text-stone-500">
            Essays and notes on Western philosophy, post-Marxism, psychoanalysis,
            and cryptography.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
            Explore
          </span>
          <Link href="/" className="hover:text-accent transition-colors w-fit">
            Home
          </Link>
          <Link
            href="/articles"
            className="hover:text-accent transition-colors w-fit"
          >
            Articles
          </Link>
          <Link
            href="/site-map"
            className="hover:text-accent transition-colors w-fit"
          >
            Site Map
          </Link>
          <Link
            href="/privacy"
            className="hover:text-accent transition-colors w-fit"
          >
            Privacy
          </Link>
        </nav>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
            Contact
          </span>
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="hover:text-accent transition-colors w-fit"
          >
            Email
          </a>
          <a
            href={AUTHOR_ORCID}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors w-fit"
          >
            ORCID
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-10">
        <p className="text-xs font-mono text-stone-400">
          © {year} {AUTHOR_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
