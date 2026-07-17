import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const ARTICLE_PATH_PATTERN =
  /^\/articles\/[a-z0-9]+(?:-[a-z0-9]+)*(?:\/opengraph-image)?\/?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === '/articles' ||
    pathname === '/articles/' ||
    ARTICLE_PATH_PATTERN.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Reject malformed encoded segments before Next.js attempts to decode the
  // dynamic route. This keeps invalid URLs on the normal 404 path.
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const config = {
  matcher: '/articles/:path*',
};
