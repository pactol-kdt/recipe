import { auth } from '~/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // Redirect all unauthenticated users to /auth
  if (!req.auth && !req.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.rewrite(new URL('/not-found', req.url));
  }
});

// ✅ Protect every page (except auth, api, and Next.js internals)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
