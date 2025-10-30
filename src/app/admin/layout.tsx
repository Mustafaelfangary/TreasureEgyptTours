'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminProvider } from '@/components/admin/AdminProvider';
import AdminTextFixer from '@/components/admin/AdminTextFixer';
import { Loader2 } from 'lucide-react';
import '../globals.css';
import '../../styles/admin.css';
import '../../styles/admin-contrast-fix.css';
import '../../styles/mui-admin-override.css';

// Wrapper component to handle session and loading state
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while checking session on the client
  if (!isClient || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-egyptian-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminTextFixer />
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <AdminProvider>
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
        </AdminProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
