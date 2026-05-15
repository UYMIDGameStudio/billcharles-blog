import Image from 'next/image';
import Link from 'next/link';

export default function Archive() {
  const posts = [
    {
      title: "The Epistemological Evolution of Modernity: From Foundationalism to the Transcendental Synthesis",
      slug: "psychoanalysis-intro",
      date: "2026-02-03",
      excerpt: "",
      category: "Philosophy"
    },
   
  ];

  return (
    <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif pb-20">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F1EFEA]/85 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-16 relative flex items-center justify-between font-sans text-stone-500">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-300">
              <Image src="/image_0.png" alt="Avatar" fill className="object-cover" />
            </div>
            <Link href="/" className="text-lg font-bold tracking-tight text-stone-800">BillCharles Blog</Link>
          </div>
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <Link href="/articles" className="text-stone-900 border-b border-stone-900">Articles</Link>
            <Link href="/notes" className="hover:text-stone-900 transition-colors capitalize">Notes</Link>
          </nav>
          <div className="w-32"></div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-12">Essays & Articles</h1>
        
        <div className="space-y-12">
          {posts.map((post) => (
            <Link key={post.slug} href={`/articles/${post.slug}`} className="block group">
              <article className="space-y-3">
                <div className="flex items-center gap-4 text-xs font-mono text-stone-400 uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span className="text-stone-200">/</span>
                  <span>{post.category}</span>
                </div>
                <h2 className="text-2xl font-bold font-sans group-hover:text-stone-500 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-stone-600 leading-relaxed max-w-xl">{post.excerpt}</p>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}