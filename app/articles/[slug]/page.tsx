// app/articles/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  
  const resolvedParams = await params;
  
  // 🔥 关键修复：解码中文 slug
  let slug = decodeURIComponent(resolvedParams.slug);
  
  // 额外健壮处理：如果 slug 末尾带了 .md 也自动去掉（防止双重问题）
  if (slug.endsWith('.md')) {
    slug = slug.replace(/\.md$/, '');
  }

  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  
  let fileContent = '';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return (
      <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Article not found</h1>
        {/* 调试信息现在会显示解码后的真实文件名，更好排查 */}
        <p className="text-stone-500 mb-8 font-sans text-sm">
          Looking for: <span className="font-mono text-red-600">{slug}.md</span>
        </p>
        <Link href="/articles" className="text-stone-500 hover:text-stone-900 underline">
          Return to articles
        </Link>
      </main>
    );
  }

  // 解析 Markdown
  const { data, content } = matter(fileContent);

  return (
    <main className="min-h-screen bg-[#F1EFEA] text-stone-900 font-serif selection:bg-stone-200">
      
      {/* --- 替换为响应式修复后的眉页 (Header) --- */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F1EFEA]/85 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-5 md:px-6 h-16 relative flex items-center justify-between font-sans">
          
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
          <nav className="flex items-center gap-5 sm:gap-8 text-sm font-medium tracking-wide text-stone-500 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
            <Link href="/articles" className="text-stone-900 border-b border-stone-900 transition-colors">Articles</Link>
            <Link href="/notes" className="hover:text-stone-900 transition-colors">Notes</Link>
          </nav>
          
          <div className="w-32 hidden md:block"></div>
        </div>
      </header>

      <article className="max-w-2xl mx-auto px-6 py-20">
        
        <header className="mb-16 space-y-6">
          <div className="flex items-center gap-4 text-sm font-sans text-stone-500 uppercase tracking-widest">
            <span>{data.date || 'No Date'}</span>
            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
            <span>{data.category || 'Uncategorized'}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold font-sans text-stone-900 leading-[1.1] tracking-tight">
            {data.title || 'Untitled Article'}
          </h1>
          
          {data.excerpt && (
            <p className="text-xl text-stone-500 italic font-serif leading-relaxed">
              {data.excerpt}
            </p>
          )}
        </header>

        <section className="prose prose-stone prose-lg max-w-none prose-p:leading-[1.8] prose-headings:font-sans prose-headings:font-bold prose-h2:text-2xl prose-h2:pt-8 prose-h2:mt-0 prose-h3:text-xl prose-h3:pt-6 prose-h3:text-stone-800 prose-h4:text-lg prose-h4:text-stone-600 prose-a:text-stone-600 prose-blockquote:border-l-4 prose-blockquote:border-stone-300 prose-blockquote:pl-6 py-2 prose-blockquote:italic prose-blockquote:text-stone-600 prose-blockquote:bg-stone-100/50 prose-blockquote:rounded-r-lg">
          <ReactMarkdown>{content}</ReactMarkdown>
        </section>

        <footer className="mt-20 pt-10 border-t border-stone-200 flex justify-between font-sans text-sm">
          <Link href="/articles" className="text-stone-400 hover:text-stone-900 transition-colors">← Back to Archive</Link>
        </footer>
      </article>
    </main>
  );
}