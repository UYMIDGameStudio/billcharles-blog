import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

// Tuned for Times New Roman / 宋体 long-form reading: generous line-height,
// normal-weight serif headings, claret links and rules. Colors are token-based
// so the prose follows light/dark theme automatically.
const proseClassName = [
  'prose prose-lg max-w-none',
  'text-ink leading-[2] text-[1.1rem] [overflow-wrap:anywhere]',
  'prose-p:my-7 prose-p:text-ink prose-p:tracking-[0.01em]',
  'prose-headings:font-normal prose-headings:text-ink prose-headings:tracking-[0.005em]',
  'prose-h2:text-[1.7rem] prose-h2:mt-14 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-line',
  'prose-h3:text-[1.35rem] prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-ink2',
  'prose-strong:text-ink prose-strong:font-bold',
  'prose-em:italic',
  'prose-a:text-accent prose-a:font-normal prose-a:underline prose-a:decoration-accent/40 prose-a:underline-offset-4 hover:prose-a:decoration-accent',
  'prose-blockquote:border-l-[3px] prose-blockquote:border-accent prose-blockquote:pl-6 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-ink2',
  'prose-li:marker:text-accent prose-li:my-2',
  'prose-hr:border-line',
  'prose-th:text-ink prose-td:text-ink prose-thead:border-line2 prose-tr:border-line',
  'prose-img:rounded-sm prose-img:border prose-img:border-line',
  'prose-code:text-ink prose-code:font-mono prose-code:text-[0.92em]',
  'prose-pre:rounded-sm prose-pre:border prose-pre:border-line2 prose-pre:bg-surface',
].join(' ');

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
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto" role="region" aria-label="Scrollable table" tabIndex={0}>
              <table className="my-0 min-w-[32rem]">{children}</table>
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
