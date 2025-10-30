"use client";

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  ArrowUp, 
  ArrowDown,
  Plus,
  Settings,
  FileText,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { 
    title: 'Total Bookings', 
    value: '1,234', 
    change: '+12%', 
    changeType: 'increase',
    icon: Calendar,
    href: '/admin/bookings'
  },
  { 
    title: 'Total Revenue', 
    value: '$45,231', 
    change: '+19%', 
    changeType: 'increase',
    icon: CreditCard,
    href: '/admin/revenue'
  },
  { 
    title: 'Active Dahabiyas', 
    value: '24', 
    change: '+2', 
    changeType: 'increase',
    icon: Package,
    href: '/admin/dahabiyas'
  },
  { 
    title: 'New Customers', 
    value: '183', 
    change: '-3%', 
    changeType: 'decrease',
    icon: Users,
    href: '/admin/customers'
  },
];

const recentBookings = [
  { id: 1, customer: 'John Doe', dahabiya: 'Luxury Dahabiya', date: '2023-06-15', amount: '$2,500', status: 'confirmed' },
  { id: 2, customer: 'Jane Smith', dahabiya: 'Premium Dahabiya', date: '2023-06-14', amount: '$3,200', status: 'pending' },
  { id: 3, customer: 'Robert Johnson', dahabiya: 'Deluxe Dahabiya', date: '2023-06-13', amount: '$2,800', status: 'confirmed' },
  { id: 4, customer: 'Emily Davis', dahabiya: 'Luxury Dahabiya', date: '2023-06-12', amount: '$2,500', status: 'cancelled' },
  { id: 5, customer: 'Michael Wilson', dahabiya: 'Premium Dahabiya', date: '2023-06-11', amount: '$3,200', status: 'confirmed' },
];

const activities = [
  { id: 1, type: 'booking', user: 'John Doe', action: 'created a new booking', time: '2 hours ago', icon: Calendar },
  { id: 2, type: 'message', user: 'Jane Smith', action: 'sent a message', time: '3 hours ago', icon: MessageSquare },
  { id: 3, type: 'booking', user: 'Robert Johnson', action: 'cancelled a booking', time: '5 hours ago', icon: Calendar },
  { id: 4, type: 'review', user: 'Emily Davis', action: 'left a review', time: '1 day ago', icon: FileText },
  { id: 5, type: 'booking', user: 'Michael Wilson', action: 'updated booking details', time: '1 day ago', icon: Calendar },
];

export default function DashboardPage() {
  return (
    <AdminLayout 
      title="Dashboard" 
      description="Welcome back! Here's what's happening with your business today."
    >
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title} className="group">
            <Card className="h-full transition-all duration-200 group-hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={cn(
                  "text-xs flex items-center",
                  stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'
                )}>
                  {stat.changeType === 'increase' ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest 5 bookings from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{booking.customer}</p>
                    <p className="text-sm text-muted-foreground">{booking.dahabiya}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{booking.amount}</p>
                    <p className={`text-xs ${
                      booking.status === 'confirmed' ? 'text-green-500' : 
                      booking.status === 'pending' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-muted">
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/admin/bookings/new">
              <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>New Booking</span>
              </Button>
            </Link>
            <Link href="/admin/dahabiyas/new">
              <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center space-y-2">
                <Package className="h-6 w-6" />
                <span>Add Dahabiya</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" className="h-24 w-full flex flex-col items-center justify-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
