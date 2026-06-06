// app/not-found.tsx
import Link from 'next/link';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main>
      <SiteHeader />

      <section className="max-w-2xl mx-auto px-6 py-32 text-center space-y-6">
        <p className="font-mono text-xs uppercase tracking-widest text-stone-400">
          404
        </p>
        <h1 className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-stone-900">
          Page not found
        </h1>
        <p className="text-stone-600 font-serif leading-relaxed">
          The page you were looking for doesn’t exist, or it may have been moved.
        </p>
        <div className="pt-4 font-sans text-sm">
          <Link
            href="/"
            className="text-stone-500 hover:text-accent underline transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
