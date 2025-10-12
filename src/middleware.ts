import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  // Check if user is authenticated (check for admin token in cookies or localStorage)
  // For now, we'll use a simple check - in production, verify JWT token
  const isAuthenticated = request.cookies.get('exobeAdminToken')?.value;
  const role = request.cookies.get('exobeAdminRole')?.value as string | undefined;
  const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';
  
  if (!isPublicRoute && (!isAuthenticated || !hasAdminAccess) && pathname !== '/auth/login') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (isPublicRoute && isAuthenticated && hasAdminAccess && pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

