import Link from 'next/link';
import { AUTHOR_EMAIL, AUTHOR_NAME, AUTHOR_NAME_HANZI, AUTHOR_ORCID } from '@/lib/site';

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line bg-paper/60">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-6 py-12 md:px-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs space-y-2">
          <p className="text-lg font-bold tracking-tight text-ink">
            BillCharles Blog
          </p>
          <p className="text-sm leading-relaxed text-ink3">
            Essays and notes on Western philosophy, post-Marxism, psychoanalysis,
            and cryptography.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2.5 text-sm">
          <span className="text-[11px] uppercase tracking-widest text-ink3">
            Explore
          </span>
          <Link href="/" className="w-fit text-ink2 transition-colors hover:text-accent">
            Home
          </Link>
          <Link href="/articles" className="w-fit text-ink2 transition-colors hover:text-accent">
            Articles
          </Link>
          <Link href="/topics" className="w-fit text-ink2 transition-colors hover:text-accent">
            Topics
          </Link>
          <Link href="/publications" className="w-fit text-ink2 transition-colors hover:text-accent">
            Publications
          </Link>
          <Link href="/about" className="w-fit text-ink2 transition-colors hover:text-accent">
            About
          </Link>
          <Link href="/site-map" className="w-fit text-ink2 transition-colors hover:text-accent">
            Site Map
          </Link>
          <Link href="/privacy" className="w-fit text-ink2 transition-colors hover:text-accent">
            Privacy
          </Link>
          <Link href="/editorial" className="w-fit text-ink2 transition-colors hover:text-accent">
            Editorial &amp; Corrections
          </Link>
          <Link href="/terms" className="w-fit text-ink2 transition-colors hover:text-accent">
            Terms
          </Link>
        </nav>

        <div className="flex flex-col gap-2.5 text-sm">
          <span className="text-[11px] uppercase tracking-widest text-ink3">
            Contact
          </span>
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="w-fit text-ink2 transition-colors hover:text-accent"
          >
            Email
          </a>
          <a
            href={AUTHOR_ORCID}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-ink2 transition-colors hover:text-accent"
          >
            ORCID
          </a>
          <a
            href="https://github.com/UYMIDGameStudio/billcharles-blog"
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-ink2 transition-colors hover:text-accent"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[1080px] px-6 pb-10 md:px-8">
        <p className="text-xs text-ink3">
          © {year} {AUTHOR_NAME} ({AUTHOR_NAME_HANZI}). All rights reserved.
        </p>
      </div>
    </footer>
  );
}
