'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  ArrowLeft, 
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Crown,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Grid,
  List,
  Plus,
  Trash2,
  Send,
  FileEdit,
  Calendar as CalendarIcon,
  Ship,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  status: string;
  totalAmount: number;
  bookingDate: string;
  travelDate: string;
  guests: number;
  packageName?: string;
  itineraryName?: string | null;
  dahabiyaName?: string;
  bookingReference?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BookingsManagement() {
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  useEffect(() => {
    if (session?.user?.role && ['ADMIN', 'MANAGER'].includes(session.user.role)) {
      fetchBookings();
    }
  }, [session]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/bookings', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Bookings loaded:', data);
        setBookings(data.bookings || []);
        if (data.bookings && data.bookings.length > 0) {
          toast.success(`✅ Loaded ${data.bookings.length} bookings`);
        } else {
          toast.info('No bookings found');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to load bookings:', errorData);
        toast.error(`Failed to load bookings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error(`Error loading bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleExportBookings = async () => {
    try {
      const response = await fetch('/api/admin/export/bookings');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Bookings exported successfully!');
      } else {
        toast.error('Failed to export bookings');
      }
    } catch (error) {
      console.error('Error exporting bookings:', error);
      toast.error('Error exporting bookings');
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Booking status updated to ${newStatus}`);
        fetchBookings();
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedBookings.length === 0) {
      toast.error('Please select bookings first');
      return;
    }

    try {
      const promises = selectedBookings.map(id => handleStatusUpdate(id, status));
      await Promise.all(promises);
      setSelectedBookings([]);
      toast.success(`Updated ${selectedBookings.length} bookings`);
    } catch (error) {
      toast.error('Error updating bookings');
    }
  };

  const handleSelectAll = () => {
    if (selectedBookings.length === filteredBookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(filteredBookings.map(b => b.id));
    }
  };

  const handleSelectBooking = (bookingId: string) => {
    setSelectedBookings(prev => 
      prev.includes(bookingId) 
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      CONFIRMED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      COMPLETED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' || (() => {
      const bookingDate = new Date(booking.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today': return daysDiff === 0;
        case 'week': return daysDiff <= 7;
        case 'month': return daysDiff <= 30;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-amber-800 text-lg">Loading Bookings...</p>
        </div>
      </div>
    );
  }

  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 to-navy-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-amber-800 mb-4">Access Denied</h1>
          <p className="text-amber-600">Only administrators and managers may access booking management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-blue-50 via-navy-blue-50 to-deep-blue-100">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-ocean-blue-600 via-navy-blue-600 to-deep-blue-700 rounded-lg shadow-lg">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <Calendar className="w-10 h-10 text-amber-200" />
            <div>
              <h1 className="text-4xl font-bold text-white">Bookings Management</h1>
              <p className="text-amber-200">Manage all customer reservations and bookings</p>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-green-900">{bookings.length}</p>
                  <p className="text-xs text-green-600 mt-1">All time</p>
                </div>
                <div className="bg-green-200 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Confirmed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {bookings.length > 0 ? Math.round((bookings.filter(b => b.status === 'CONFIRMED').length / bookings.length) * 100) : 0}% confirmed
                  </p>
                </div>
                <div className="bg-blue-200 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {bookings.filter(b => b.status === 'PENDING').length}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">Needs attention</p>
                </div>
                <div className="bg-yellow-200 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 mt-1">All bookings</p>
                </div>
                <div className="bg-purple-200 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-teal-600">Avg. Guests</p>
                  <p className="text-2xl font-bold text-teal-900">
                    {bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.guests, 0) / bookings.length) : 0}
                  </p>
                  <p className="text-xs text-teal-600 mt-1">Per booking</p>
                </div>
                <div className="bg-teal-200 p-3 rounded-full">
                  <Users className="h-6 w-6 text-teal-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg. Value</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ${bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.totalAmount, 0) / bookings.length).toLocaleString() : 0}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Per booking</p>
                </div>
                <div className="bg-orange-200 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Filters and Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Actions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleExportBookings} className="bg-amber-600 hover:bg-amber-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

              <Button onClick={fetchBookings} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Bulk Actions */}
            {selectedBookings.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedBookings.length} booking{selectedBookings.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('CONFIRMED')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('PENDING')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pending
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleBulkStatusUpdate('CANCELLED')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedBookings([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              All Bookings ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedBookings.length === filteredBookings.length && filteredBookings.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                          <span>Select</span>
                        </div>
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-900">Booking Details</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Customer</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Travel Info</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Status & Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className={`border-b hover:bg-gray-50 ${
                        selectedBookings.includes(booking.id) ? 'bg-blue-50' : ''
                      }`}>
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedBookings.includes(booking.id)}
                            onChange={() => handleSelectBooking(booking.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900">#{booking.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">
                              Booked: {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                            {booking.packageName && (
                              <p className="text-sm text-blue-600">{booking.packageName}</p>
                            )}
                            {booking.itineraryName && (
                              <p className="text-sm text-green-600">{booking.itineraryName}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-900">{booking.customerName}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {booking.customerEmail}
                            </div>
                            {booking.customerPhone && (
                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                {booking.customerPhone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.travelDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Users className="w-3 h-3" />
                              {booking.guests} guests
                            </div>
                            {booking.dahabiyaName && (
                              <div className="flex items-center gap-1 text-sm text-blue-600">
                                <MapPin className="w-3 h-3" />
                                {booking.dahabiyaName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            {getStatusBadge(booking.status)}
                            <p className="text-lg font-bold text-gray-900 mt-1">
                              ${booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1 flex-wrap">
                            <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-gray-600 hover:bg-gray-50">
                              <FileEdit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-purple-600 hover:bg-purple-50">
                              <Mail className="w-3 h-3" />
                            </Button>
                            {booking.status === 'PENDING' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            {booking.status !== 'CANCELLED' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                    ? 'No bookings match your current filters.' 
                    : 'No bookings have been made yet.'}
                </p>
                {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setDateFilter('all');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}