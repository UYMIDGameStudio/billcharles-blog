import Link from 'next/link';
import { AUTHOR_EMAIL, AUTHOR_NAME, AUTHOR_NAME_HANZI, AUTHOR_ORCID } from '@/lib/site';
import { SUPPORT_LINKS } from '@/lib/support';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-wordmark">Bill Charles<span className="text-accent">.</span></p>
          <p className="footer-note">A personal journal on philosophy, knowledge, and decentralized systems.</p>
        </div>
        <div>
          <p className="footer-label">Explore</p>
          <nav aria-label="Footer" className="footer-nav">
            <Link href="/articles">Articles</Link><Link href="/topics">Topics</Link><Link href="/publications">Publications</Link><Link href="/about">About</Link><Link href="/site-map">Site map</Link><a href="/feed.xml">RSS ↗</a>
          </nav>
        </div>
        <div>
          <p className="footer-label">Elsewhere &amp; support</p>
          <div className="footer-nav">
            <a href={`mailto:${AUTHOR_EMAIL}`}>Email</a><a href={AUTHOR_ORCID} target="_blank" rel="noopener noreferrer">ORCID ↗</a><a href="https://github.com/UYMIDGameStudio/billcharles-blog" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            {SUPPORT_LINKS.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {AUTHOR_NAME} (<span lang="zh-Hans">{AUTHOR_NAME_HANZI}</span>)</p>
        <nav aria-label="Site policies" className="footer-nav"><Link href="/editorial">Editorial &amp; corrections</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
      </div>
    </footer>
  );
}
