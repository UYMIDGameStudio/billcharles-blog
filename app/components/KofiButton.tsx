import { SUPPORT_LINKS } from '@/lib/support';

export default function KofiButton() {
  const link = SUPPORT_LINKS[0];
  if (!link) return null;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-accent-dark sm:bottom-7 sm:right-7"
      aria-label={`${link.label} on Ko-fi`}
    >
      <span aria-hidden>☕</span>
      <span>Support me</span>
    </a>
  );
}
