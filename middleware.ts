import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware protects /admin routes by checking NextAuth session cookies.
// Adjust cookie names if you use a custom session strategy.
// NextAuth default session token cookie names:
//  - next-auth.session-token (HTTP) or __Secure-next-auth.session-token (HTTPS)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip non-admin paths and Next internals
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Exclude Next.js internals and static assets from middleware
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Read NextAuth session cookie
  const sessionCookie =
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value;

  // If no session cookie, redirect to signin with callback to current path
  if (!sessionCookie) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = '/auth/signin';
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // Otherwise allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
