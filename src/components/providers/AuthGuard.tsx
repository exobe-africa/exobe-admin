"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, hasHydrated, fetchMe } = useAuthStore();

  const publicRoutes = ['/auth/login', '/auth/forgot-password', '/auth/reset-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Fetch user data on mount if authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated && !user) {
      fetchMe();
    }
  }, [hasHydrated, isAuthenticated, user, fetchMe]);

  useEffect(() => {
    // Only proceed if hydration is complete
    if (!hasHydrated) return;

    const hasAdminAccess = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    // Redirect to login if not authenticated and trying to access protected route
    if ((!isAuthenticated || !hasAdminAccess) && !isPublicRoute) {
      router.push('/auth/login');
    }

    // Redirect to dashboard if authenticated and trying to access auth pages
    if (isAuthenticated && hasAdminAccess && isPublicRoute) {
      router.push('/');
    }
  }, [isAuthenticated, user, hasHydrated, isPublicRoute, pathname, router]);

  // Show loading while hydrating or checking authentication
  if (!hasHydrated || ((!isAuthenticated || !user) && !isPublicRoute)) {
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
