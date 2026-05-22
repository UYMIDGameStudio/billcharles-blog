// app/notes/page.tsx
import SiteHeader from '../components/SiteHeader';

export const metadata = {
  title: 'Notes | BillCharles Blog',
};

const notes = [
  {
    id: 1,
    date: 'May 10, 2026',
    content:
      "Re-reading Zizek's interpretation of the 'Body without Organs'. The implications for DAO structural integrity are striking. If a DAO lacks a central 'organ' of governance, does it fall into schizophrenic production or achieve true democratization?",
    tags: ['Psychoanalysis', 'DAO'],
  },
  {
    id: 2,
    date: 'April 28, 2026',
    content:
      "In 'Objectivity', Daston & Galison show how epistemic virtues shift over time. Today, the cryptographic proof (ZK-rollups) is perhaps the ultimate manifestation of 'mechanical objectivity'—truth without the knowing subject.",
    tags: ['Epistemology', 'Cryptography'],
  },
  {
    id: 3,
    date: 'April 15, 2026',
    content:
      "Marx's concept of commodity fetishism takes on a literal meaning in the context of NFTs. The digital asset is stripped of its use-value, existing purely as an exchange-value validated by consensus.",
    tags: ['Political Economy', 'Web3'],
  },
];

export default function Notes() {
  return (
    <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif pb-20">
      <SiteHeader activeNav="notes" />

      <section className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-4">Research Notes</h1>
        <p className="text-stone-500 font-sans mb-16 text-sm tracking-wide">
          Fragments, reading logs, and unrefined thoughts.
        </p>

        <div className="space-y-10">
          {notes.map((note) => (
            <article
              key={note.id}
              className="bg-[#FCFAF6] border border-stone-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-mono text-stone-400 mb-4">{note.date}</div>
              <p className="text-stone-800 leading-relaxed text-lg mb-6">{note.content}</p>
              <div className="flex gap-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-stone-100 text-stone-500 px-2 py-1 rounded-md border border-stone-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
