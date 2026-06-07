// app/components/SupportTip.tsx
// Tip / "buy me a coffee" block. Two layouts:
//   - "section": a centered card for the home page
//   - "compact": a slim bar for the bottom of an article
import { SUPPORT_LINKS, type SupportLink } from '@/lib/support';

function TipButton({ link }: { link: SupportLink }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-sans font-medium text-white shadow-sm hover:bg-accent-dark transition-colors"
    >
      {link.label}
    </a>
  );
}

export default function SupportTip({
  variant = 'section',
}: {
  variant?: 'section' | 'compact';
}) {
  if (SUPPORT_LINKS.length === 0) return null;

  if (variant === 'compact') {
    return (
      <aside className="mt-16 rounded-2xl border border-stone-200 bg-[#FCFAF6] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="space-y-1">
          <p className="font-sans font-bold text-stone-900 flex items-center gap-2">
            <span aria-hidden>☕</span> Enjoyed this piece?
          </p>
          <p className="text-sm text-stone-600 font-serif">
            A small tip helps me keep writing and sharing.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {SUPPORT_LINKS.map((link) => (
            <TipButton key={link.href} link={link} />
          ))}
        </div>
      </aside>
    );
  }

  return (
    <section className="px-4">
      <div className="max-w-2xl mx-auto text-center bg-[#FCFAF6] border border-stone-200 rounded-3xl p-10 md:p-12 shadow-sm">
        <div className="text-3xl mb-4" aria-hidden>
          ☕
        </div>
        <h2 className="text-2xl font-bold font-sans text-stone-900 mb-3 tracking-tight">
          Support my work
        </h2>
        <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto font-serif">
          If my essays and notes have been valuable to you, consider buying me a
          coffee. Your support helps me keep thinking, writing, and sharing
          freely.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SUPPORT_LINKS.map((link) => (
            <div key={link.href} className="flex flex-col items-center gap-1.5">
              <TipButton link={link} />
              {link.hint && (
                <span className="text-xs font-mono text-stone-400">
                  {link.hint}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
