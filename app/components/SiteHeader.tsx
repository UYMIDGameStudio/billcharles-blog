// app/components/SiteHeader.tsx
import Image from 'next/image';
import Link from 'next/link';

type NavKey = 'home' | 'articles' | 'notes';

export default function SiteHeader({ activeNav }: { activeNav?: NavKey }) {
  const navItems: { href: string; label: string; key: NavKey }[] = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/articles', label: 'Articles', key: 'articles' },
    { href: '/notes', label: 'Notes', key: 'notes' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F1EFEA]/85 border-b border-stone-200">
      <div className="max-w-5xl mx-auto px-5 md:px-6 h-16 relative flex items-center justify-between font-sans">
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-300 flex-shrink-0">
            <Image src="/image_0.png" alt="Avatar" fill className="object-cover" />
          </div>
          <Link
            href="/"
            className="hidden sm:block text-lg font-bold tracking-tight text-stone-800 hover:opacity-70 transition-opacity"
          >
            BillCharles Blog
          </Link>
        </div>

        <nav className="flex items-center gap-5 sm:gap-8 text-sm font-medium tracking-wide text-stone-500 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          {navItems.map(({ href, label, key }) => (
            <Link
              key={key}
              href={href}
              aria-current={activeNav === key ? 'page' : undefined}
              className={
                activeNav === key
                  ? 'text-stone-900 border-b border-stone-900'
                  : 'hover:text-stone-900 transition-colors'
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="w-32 hidden md:block" />
      </div>
    </header>
  );
}
