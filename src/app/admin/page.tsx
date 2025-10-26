"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import AdminDataOverview from '@/components/admin/AdminDataOverview';
import AdminQuickActions from '@/components/admin/AdminQuickActions';
import {
  Users,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Image,
  MapPin,
  Star,
  Crown,
  Ship,
  Mail,
  Bell,
  Settings,
  Code,
  Handshake,
  MessageCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalPackages: 0
  });

  // Fetch dashboard data
  useEffect(() => {
    if (session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await fetch('/api/dashboard/metrics');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats({
          totalBookings: statsData.overview?.totalBookings || 0,
          totalUsers: statsData.overview?.totalUsers || 0,
          totalRevenue: 0,
          totalPackages: statsData.overview?.totalPackages || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3\"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('common.loading')}</h1>
            <p className="text-gray-600">{t('common.loading')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show signin prompt if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('auth.signIn')}</h1>
            <p className="text-gray-600 mb-6">{t('auth.signIn')}</p>
            <Link href="/auth/signin?callbackUrl=/admin">
              <Button className="bg-blue-600 hover:bg-blue-700">{t('auth.signIn')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!session.user.role || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-3">{t('errors.accessDenied')}</h1>
            <p className="text-red-700 mb-6">{t('errors.accessDenied')}</p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700">{t('nav.home')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-4\">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">{t('nav.home')}</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 truncate">{t('common.welcome')}, {session.user.name}</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 self-start sm:self-auto">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              {session.user.role}
            </Badge>
          </div>
        </div>

        {/* Stats Grid - 3 per line on all screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600">{t('booking.title')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                  <p className="text-xs text-green-600 mt-1">↗ {t('booking.title')}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-full flex-shrink-0">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600">{t('profile.title')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-purple-600 mt-1">↗ {t('profile.title')}</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600">{t('packages.title')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
                  <p className="text-xs text-blue-600 mt-1">↗ {t('packages.title')}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600">{t('booking.totalPrice')}</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                  <p className="text-xs text-orange-600 mt-1">↗ {t('booking.totalPrice')}</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-full flex-shrink-0">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Data Overview */}
        <div className="mb-8">
          <AdminDataOverview />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <AdminQuickActions />
        </div>

        {/* Core Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Crown className="w-6 h-6 text-blue-600 mr-2" />
            Core Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bookings Management */}
            <Link href="/admin/bookings">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
<Badge className="bg-green-100 text-green-800 text-xs">Essential</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('booking.title')}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t('booking.title')}</p>
                  <div className="text-xs text-green-600 font-medium">→ {t('common.viewAll')}</div>
                </CardContent>
              </Card>
            </Link>

            {/* Dahabiyas Management */}
            <Link href="/admin/dahabiyas">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-teal-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <Ship className="w-6 h-6 text-teal-600" />
                    </div>
                    <Badge className="bg-teal-100 text-teal-800 text-xs">Fleet</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('dahabiyas.title')}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t('dahabiyas.subtitle')}</p>
                  <div className="text-xs text-teal-600 font-medium">→ {t('common.viewAll')}</div>
                </CardContent>
              </Card>
            </Link>

            {/* User Management */}
            <Link href="/admin/users">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-indigo-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-600" />
                    </div>
<Badge className="bg-indigo-100 text-indigo-800 text-xs">Users</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('profile.title')}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t('profile.personalInfo')}</p>
                  <div className="text-xs text-indigo-600 font-medium">→ {t('common.viewAll')}</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Content Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 text-purple-600 mr-2" />
            Content Management
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Website Content */}
            <Link href="/admin/website">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
<Badge className="bg-blue-100 text-blue-800 text-xs">Content</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('nav.home')}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t('nav.home')}</p>
                  <div className="text-xs text-blue-600 font-medium">→ {t('common.edit')}</div>
                </CardContent>
              </Card>
            </Link>

            {/* Packages Management */}
            <Link href="/admin/packages">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
<Badge className="bg-purple-100 text-purple-800 text-xs">Packages</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{t('packages.title')}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{t('packages.subtitle')}</p>
                  <div className="text-xs text-purple-600 font-medium">→ {t('common.viewAll')}</div>
                </CardContent>
              </Card>
            </Link>

            {/* Gallery Management */}
            <Link href="/admin/gallery">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-pink-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Image className="w-6 h-6 text-pink-600" />
                    </div>
<Badge className="bg-pink-100 text-pink-800 text-xs">Media</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Gallery</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Manage photo gallery and image collections</p>
                  <div className="text-xs text-pink-600 font-medium">→ Manage Photos</div>
                </CardContent>
              </Card>
            </Link>

            {/* Partner Management */}
            <Link href="/admin/partners">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-emerald-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Handshake className="w-6 h-6 text-emerald-600" />
                    </div>
<Badge className="bg-emerald-100 text-emerald-800 text-xs">Partners</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Partners</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Manage business partners and collaborations</p>
                  <div className="text-xs text-emerald-600 font-medium">→ Manage Partners</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Operations Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Settings className="w-6 h-6 text-orange-600 mr-2" />
            Operations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Availability Management */}
            <Link href="/admin/availability">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-amber-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
<Badge className="bg-amber-100 text-amber-800 text-xs">Schedule</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Availability</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Manage scheduling and availability calendar</p>
                  <div className="text-xs text-amber-600 font-medium">→ Manage Schedule</div>
                </CardContent>
              </Card>
            </Link>

            {/* Itineraries Management */}
            <Link href="/admin/itineraries">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-orange-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
<Badge className="bg-orange-100 text-orange-800 text-xs">Routes</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Itineraries</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Manage journey routes and travel itineraries</p>
                  <div className="text-xs text-orange-600 font-medium">→ Manage Routes</div>
                </CardContent>
              </Card>
            </Link>

            {/* Reviews Management */}
            <Link href="/admin/reviews">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-yellow-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
<Badge className="bg-yellow-100 text-yellow-800 text-xs">Feedback</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Reviews</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Manage customer reviews and testimonials</p>
                  <div className="text-xs text-yellow-600 font-medium">→ View Reviews</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* System Settings Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Code className="w-6 h-6 text-gray-600 mr-2" />
            System & Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* General Settings */}
            <Link href="/admin/settings">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-gray-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Settings className="w-6 h-6 text-gray-600" />
                    </div>
<Badge className="bg-gray-100 text-gray-800 text-xs">Config</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Settings</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">System configuration and general settings</p>
                  <div className="text-xs text-gray-600 font-medium">→ System Config</div>
                </CardContent>
              </Card>
            </Link>

            {/* Email & Notifications */}
            <Link href="/admin/notification-settings">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-red-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <Bell className="w-6 h-6 text-red-600" />
                    </div>
<Badge className="bg-red-100 text-red-800 text-xs">Alerts</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Notifications</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Email templates and notification settings</p>
                  <div className="text-xs text-red-600 font-medium">→ Manage Alerts</div>
                </CardContent>
              </Card>
            </Link>

            {/* Developer Tools */}
            <Link href="/admin/developer-settings">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-slate-500">
                <CardContent className="p-4\">
                  <div className="flex items-center justify-between mb-3\">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Code className="w-6 h-6 text-slate-600" />
                    </div>
<Badge className="bg-slate-100 text-slate-800 text-xs">Dev</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Developer</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Advanced tools and development settings</p>
                  <div className="text-xs text-slate-600 font-medium">→ Dev Tools</div>
                </CardContent>
              </Card>
            </Link>

            {/* WhatsApp Settings */}
            <Link href="/admin/whatsapp-settings">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
<Badge className="bg-green-100 text-green-800 text-xs">WhatsApp</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">WhatsApp</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">Configure WhatsApp float button and contact number</p>
                  <div className="text-xs text-green-600 font-medium">→ Configure WhatsApp</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
