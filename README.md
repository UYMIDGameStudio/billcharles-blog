# BillCharles Blog

Personal academic blog for Bill Charles, built with Next.js 16, React 19,
TypeScript, Tailwind CSS, and Markdown.

## Local development

Use Node.js 22 or newer:

```bash
npm ci
npm run dev
```

Then open <http://localhost:3000>.

## Content

Articles live in `content/*.md` or `content/articles/*.md`. Each file uses
frontmatter:

```yaml
---
title: "Article title"
slug: "lowercase-url-slug"
date: "2026-07-17"
category: "Essay"
excerpt: "A short summary."
---
```

Slugs must contain lowercase letters, numbers, and single hyphens. Duplicate or
invalid slugs fail the build instead of silently shadowing another article.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Run all checks together with `npm run check`. GitHub Actions runs the same
checks and audits production dependencies on every pull request and main-branch
push.

## AI demo

The optional streaming demo uses the AI Gateway:

```bash
export AI_GATEWAY_API_KEY="your-key"
npm run ai:demo
```

The blog itself does not use this key or call an AI model at runtime.

## Deployment and privacy

The site is designed for Vercel and statically generates its pages, RSS feed,
sitemap, and Open Graph images. Security headers are configured in
`next.config.ts`. The Ko-fi support control is a normal external link; it does
not load third-party scripts or contact Ko-fi until a visitor clicks it.
