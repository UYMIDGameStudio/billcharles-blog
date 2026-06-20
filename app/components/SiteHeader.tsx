import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

type NavKey = 'home' | 'articles' | 'publications' | 'about';

export default function SiteHeader({ activeNav }: { activeNav?: NavKey }) {
  const navItems: { href: string; label: string; key: NavKey }[] = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/articles', label: 'Articles', key: 'articles' },
    { href: '/about', label: 'About', key: 'about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1080px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative block h-[34px] w-[34px] flex-none overflow-hidden rounded-full border border-line2">
            <Image src="/image_0.png" alt="Bill Charles" fill className="object-cover" />
          </span>
          <span className="hidden text-base font-bold tracking-tight text-ink sm:inline">
            BillCharles
          </span>
        </Link>

        <nav className="flex items-center gap-3.5 text-[13px] uppercase tracking-wide sm:gap-7 sm:text-sm sm:tracking-wider">
          {navItems.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              aria-current={activeNav === key ? 'page' : undefined}
              className={
                activeNav === key
                  ? 'border-b border-accent pb-0.5 text-accent'
                  : 'text-ink2 transition-colors hover:text-accent'
              }
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
