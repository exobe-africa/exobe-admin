"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from '../../context/AdminContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn } = useAdmin();
  const role = (typeof document !== 'undefined'
    ? document.cookie.split('; ').find((r) => r.startsWith('exobeAdminRole='))?.split('=')[1]
    : undefined) as string | undefined;
  const hasAdminAccess = role === 'ADMIN' || role === 'SUPER_ADMIN';

  const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected route
    if ((!isLoggedIn || !hasAdminAccess) && !isPublicRoute) {
      router.push('/auth/login');
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    if (isLoggedIn && hasAdminAccess && isPublicRoute) {
      router.push('/');
    }
  }, [isLoggedIn, hasAdminAccess, isPublicRoute, pathname, router]);

  // Show loading or nothing while checking authentication
  if ((!isLoggedIn || !hasAdminAccess) && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

