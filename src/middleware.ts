import { auth } from '~/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isAuthPage = nextUrl.pathname.startsWith('/auth');
  const isUnauthorizedPage = nextUrl.pathname.startsWith('/unauthorized');
  const hasUnauthorizedCookie = req.cookies.get('unauthorized-access');

  // 🔐 Protect everything except auth, static, and unauthorized (conditionally)
  if (!session && !isAuthPage && !isUnauthorizedPage) {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }

  // 🧠 Allow /unauthorized only if cookie exists
  if (isUnauthorizedPage && !hasUnauthorizedCookie) {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }
});

// ✅ Protect every page (except auth, api, and Next.js internals)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
