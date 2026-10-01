import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, TOKEN_NAME } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_NAME)?.value;

  // 1. Check if token is cryptographically valid
  let isAuthenticated = false;
  if (token) {
    const verified = await verifyToken(token);
    isAuthenticated = Boolean(verified && verified.role === 'ADMIN');
  }

  // 2. Redirect logged-in admin away from /admin/login to /admin dashboard
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  // 3. Protect Admin Panel Pages (/admin/* except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      if (token && !isAuthenticated) {
        // Clear invalid/expired cookie
        response.cookies.set(TOKEN_NAME, '', {
          path: '/',
          maxAge: 0,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
      }
      return response;
    }
  }

  // 4. Protect Admin API Endpoints (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized access. Valid administrator authentication token required.' },
        { status: 401 }
      );
    }
  }

  // 5. Response with Comprehensive Security Headers
  const response = NextResponse.next();

  // Prevent Clickjacking
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');

  // Prevent MIME Sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // Enforce HTTPS
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );

  // Control Referrer Information
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  // Restrict Powerful Browser Features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );

  // XSS Protection for Legacy Browsers & DNS Prefetch
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Instruct search crawlers to never index or archive admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|recipes/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
