// app/articles/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';   // ← 确保路径正确

export default function Archive() {
  const posts = getAllPosts();   // ← 直接同步调用，极简！

  return (
    <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif pb-20">
      
      {/* --- 替换为响应式修复后的眉页 (Header) --- */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F1EFEA]/85 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-5 md:px-6 h-16 relative flex items-center justify-between font-sans text-stone-500">
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-300 flex-shrink-0">
              <Image src="/image_0.png" alt="Avatar" fill className="object-cover" />
            </div>
            {/* hidden sm:block 让标题在手机端自动隐藏 */}
            <Link href="/" className="hidden sm:block text-lg font-bold tracking-tight text-stone-800 hover:opacity-70 transition-opacity">
              BillCharles Blog
            </Link>
          </div>
          
          {/* md: 前缀让绝对居中只在电脑端生效，手机端自动靠右 */}
          <nav className="flex items-center gap-5 sm:gap-8 text-sm font-medium md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <Link href="/articles" className="text-stone-900 border-b border-stone-900">Articles</Link>
            <Link href="/notes" className="hover:text-stone-900 transition-colors capitalize">Notes</Link>
          </nav>
          
          <div className="w-32 hidden md:block"></div>
        </div>
      </header>

      {/* --- 下方的文章列表主体保持您的原样 --- */}
      <section className="max-w-3xl mx-auto px-6 py-20 space-y-16">
        <h1 className="text-4xl font-bold font-sans tracking-tight mb-12">Essays & Articles</h1>
        
        <div className="space-y-12">
          {posts.length === 0 ? (
            <p className="text-stone-500 italic">暂无文章，敬请期待…</p>
          ) : (
            posts.map((post) => (
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
                  {post.excerpt && (
                    <p className="text-stone-600 leading-relaxed max-w-xl">{post.excerpt}</p>
                  )}
                </article>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}