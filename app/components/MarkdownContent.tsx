import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const proseClassName =
  'prose prose-stone prose-lg max-w-none prose-p:leading-[1.8] prose-headings:font-sans prose-headings:font-bold prose-h2:text-2xl prose-h2:pt-8 prose-h2:mt-0 prose-h3:text-xl prose-h3:pt-6 prose-h3:text-stone-800 prose-h4:text-lg prose-h4:text-stone-600 prose-a:text-accent prose-a:font-medium prose-blockquote:border-l-4 prose-blockquote:border-accent/40 prose-blockquote:pl-6 py-2 prose-blockquote:italic prose-blockquote:text-stone-600 prose-blockquote:bg-stone-100/50 prose-blockquote:rounded-r-lg prose-pre:bg-stone-900 prose-pre:text-stone-100';

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export default function MarkdownContent({
  children,
  className = proseClassName,
}: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
