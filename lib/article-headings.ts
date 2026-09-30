import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export type ArticleHeading = { id: string; title: string };

type MarkdownNode = {
  type: string;
  depth?: number;
  value?: string;
  alt?: string | null;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
};

function headingText(node: MarkdownNode): string {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
  if (node.type === 'image' || node.type === 'imageReference') return node.alt ?? '';
  if (node.type === 'break') return ' ';
  return node.children?.map(headingText).join('') ?? '';
}

// The outline and the rendered headings share this traversal and ID allocator.
// Reading the Markdown AST excludes fences and preserves inline-format text.
function assignHeadingIds(tree: MarkdownNode): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const used = new Set<string>();
  function visit(node: MarkdownNode) {
    if (node.type === 'heading' && node.depth === 2) {
      const title = headingText(node).replace(/\s+/g, ' ').trim();
      const slug = title.normalize('NFC').toLowerCase()
        .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '')
        .replace(/[\s-]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled';
      const base = 'section-' + slug;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = base + '-' + suffix++;
      used.add(id);
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } };
      // Empty headings still receive a stable ID, but offer no useful outline text.
      if (title) headings.push({ id, title });
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return headings;
}

export function getArticleHeadings(markdown: string): ArticleHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
  return assignHeadingIds(tree);
}

export function remarkArticleHeadings() {
  return (tree: MarkdownNode) => { assignHeadingIds(tree); };
}
