import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('as_admin_auth_token')?.value;

  // 1. Protect Admin Panel Pages
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect Admin API Endpoints
  if (pathname.startsWith('/api/admin')) {
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized access. Authentication token required.' },
        { status: 401 }
      );
    }
  }

  // 3. Response with Comprehensive Security Headers
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

  // XSS Protection for Legacy Browsers
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, icons)
     */
    '/((?!_next/static|_next/image|favicon.ico|recipes/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
