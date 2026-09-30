import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

type NavKey = 'home' | 'articles' | 'publications' | 'about';
const navItems: { href: string; label: string; key: NavKey }[] = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/articles', label: 'Articles', key: 'articles' },
  { href: '/publications', label: 'Publications', key: 'publications' },
  { href: '/about', label: 'About', key: 'about' },
];

export default function SiteHeader({ activeNav }: { activeNav?: NavKey }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-brand" aria-label="BillCharles home">
          <Image src="/image_0.png" alt="" width={32} height={32} className="rounded-full" />
          <span>BillCharles<span className="brand-period">.</span></span>
        </Link>
        <nav aria-label="Main" className="site-nav">
          {navItems.map(({ href, label, key }) => (
            <Link key={key} href={href} aria-current={activeNav === key ? 'page' : undefined}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="site-theme"><ThemeToggle /></div>
      </div>
    </header>
  );
}
