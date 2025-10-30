"use client";

import { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export function AdminLayout({ 
  children, 
  className, 
  title,
  description 
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile sidebar when route changes
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <AdminSidebar activePath={pathname} />
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-40 md:hidden transition-opacity duration-300',
        sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
        <div className={cn(
          'fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <AdminSidebar activePath={pathname} onClose={closeSidebar} />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className={cn("py-6 px-4 sm:px-6 lg:px-8 min-h-screen", className)}>
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold tracking-tight">{title}</h1>}
              {description && (
                <p className="text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}
