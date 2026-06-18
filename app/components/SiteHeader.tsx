import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

type NavKey = 'home' | 'articles';

export default function SiteHeader({ activeNav }: { activeNav?: NavKey }) {
  const navItems: { href: string; label: string; key: NavKey }[] = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/articles', label: 'Articles', key: 'articles' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-[66px] max-w-[1080px] items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative block h-[34px] w-[34px] flex-none overflow-hidden rounded-full border border-line2">
            <Image src="/image_0.png" alt="Bill Charles" fill className="object-cover" />
          </span>
          <span className="text-base font-bold tracking-tight text-ink">
            BillCharles
          </span>
        </Link>

        <nav className="flex items-center gap-7 text-sm uppercase tracking-wider">
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
