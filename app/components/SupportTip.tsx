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
      className="action-link"
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
      <aside className="support-inline" lang="en">
        <div className="space-y-1">
          <p className="font-sans font-bold text-ink flex items-center gap-2">
            <span aria-hidden>☕</span> Enjoyed this piece?
          </p>
          <p className="text-sm text-ink2 font-serif">
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
    <section className="support-section" lang="en">
      <div className="support-panel">
        <div className="text-3xl mb-4" aria-hidden>
          ☕
        </div>
        <h2 className="text-2xl font-bold font-sans text-ink mb-3 tracking-tight">
          Support my work
        </h2>
        <p className="text-ink2 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto font-serif">
          If my essays and notes have been valuable to you, consider buying me a
          coffee. Your support helps me keep thinking, writing, and sharing
          freely.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SUPPORT_LINKS.map((link) => (
            <div key={link.href} className="flex flex-col items-center gap-1.5">
              <TipButton link={link} />
              {link.hint && (
                <span className="text-xs font-mono text-ink3">
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
