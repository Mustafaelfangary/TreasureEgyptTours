'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import AdminTextFixer from '@/components/admin/AdminTextFixer';
import '../globals.css';
import '../../styles/admin.css';
import '../../styles/admin-contrast-fix.css';
import '../../styles/mui-admin-override.css';

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
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className="admin-layout min-h-screen text-black overflow-x-hidden notranslate" style={{ color: '#000000', background: '#f5f1e8' }} translate="no">
          <AdminTextFixer />
          <div className="admin-header-mobile">
            <AdminHeader />
          </div>
          <main className="admin-content w-full px-2 sm:px-4 lg:px-6">
            <div className="w-full max-w-full overflow-x-hidden">
              <div className="py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="admin-mobile-container">
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </SessionProvider>
    </QueryClientProvider>
  );
}
