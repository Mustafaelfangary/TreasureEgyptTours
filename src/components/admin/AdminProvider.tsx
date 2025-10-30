'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (status === 'loading') return;
      
      try {
        // Force a session update to ensure we have the latest data
        const updatedSession = await update();
        
        // If not authenticated, redirect to signin with callback URL
        if (status === 'unauthenticated' || !updatedSession) {
          console.log('Not authenticated, redirecting to signin');
          const callbackUrl = encodeURIComponent(pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''));
          window.location.href = `/auth/signin?callbackUrl=${callbackUrl}`;
          return;
        }

        // If user doesn't have admin or manager role, redirect to home
        if (updatedSession.user?.role && !['ADMIN', 'MANAGER'].includes(updatedSession.user.role)) {
          console.log('User does not have required role, redirecting to home');
          window.location.href = '/';
          return;
        }

        // If we get here, user is authenticated and has the right role
        console.log('User is authenticated and authorized');
        setIsCheckingAuth(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
        window.location.href = '/auth/signin';
      } finally {
        setInitialCheckDone(true);
      }
    };

    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [status, pathname, searchParams, update]);

  // Show loading state while checking auth
  if (!initialCheckDone || status === 'loading' || isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-egyptian-blue-600" />
      </div>
    );
  }

  // Only render children if we're authenticated and have the right role
  if (status === 'authenticated' && session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return <>{children}</>;
  }

  // Default return (should be caught by the redirect above)
  return null;
}
