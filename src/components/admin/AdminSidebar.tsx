'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Ship, Package, Users, Settings, Mail, Bell, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Dahabiyas', href: '/admin/dahabiyas', icon: Ship },
    { name: 'Packages', href: '/admin/packages', icon: Package },
    { name: 'Email Templates', href: '/admin/email-templates', icon: Mail },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Back to Site', href: '/', icon: Home },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <h1 className="text-2xl font-bold text-egyptian-blue">Admin Panel</h1>
          </div>
          <nav className="flex-1 px-2 space-y-1 bg-white">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-4 py-3 text-sm font-medium rounded-md',
                    isActive
                      ? 'bg-egyptian-blue/10 text-egyptian-blue border-r-4 border-egyptian-blue'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-egyptian-blue' : 'text-gray-400 group-hover:text-gray-500',
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
