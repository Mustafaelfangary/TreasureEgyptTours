"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, UserPlus, Download, Shield, Crown, User, ArrowLeft, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function UsersManagement() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<Array<{id: string; name: string; email: string; role: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string; name: string; email: string; role: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ADMIN'
  });

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [session]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await fetch('/api/admin/export/users');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `users-export-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export users');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin user created successfully!');
        setShowCreateModal(false);
        setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
        fetchUsers(); // Refresh the users list
      } else {
        toast.error(data.message || 'Failed to create admin user');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Failed to create admin user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleViewUser = (user: {id: string; name: string; email: string; role: string}) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: {id: string; name: string; email: string; role: string}) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setCreateLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('User updated successfully!');
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({ name: '', email: '', password: '', role: 'ADMIN' });
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('User deleted successfully!');
        fetchUsers();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="admin-container admin-font-pharaonic flex items-center justify-center">
        <Card className="admin-card w-96">
          <CardContent className="p-8 text-center">
            <div className="admin-spinner"></div>
            <h1 className="text-2xl font-bold text-amber-900 mb-2">𓇳 Loading Users 𓇳</h1>
            <p className="text-amber-700 admin-text-justify">
              Loading user information from the database...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !['ADMIN', 'MANAGER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex items-center justify-center admin-font-pharaonic">
        <Card className="admin-card w-96 border-red-200">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 mb-4">𓊪 Access Denied 𓊪</h1>
            <p className="text-red-700 mb-6 admin-text-justify">
              You do not have the required privileges to access this page. Only administrators may access user management.
            </p>
            <Link href="/admin">
              <Button className="bg-red-600 hover:bg-red-700 admin-focus flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="admin-container admin-font-pharaonic">
      {/* Pharaonic Header */}
      <div className="admin-header">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full shadow-lg">
                <Crown className="w-8 h-8 text-amber-900" />
              </div>
              <div>
                <h1 className="admin-header-title">
                  𓇳 User Management 𓇳
                </h1>
                <p className="admin-header-subtitle admin-text-justify">
                  User Administration and Management
                </p>
              </div>
            </div>
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="bg-amber-100 border-amber-300 text-amber-900 hover:bg-blue-200 shadow-lg admin-focus flex items-center gap-1 h-8 text-xs font-medium"
              >
                <ArrowLeft className="w-3 h-3" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
              <span className="admin-stat-label text-blue-900">Total Users</span>
            </div>
            <div className="admin-stat-number text-blue-800">{users.length}</div>
            <p className="admin-stat-description admin-text-justify">
              Complete registry of all users in the system, including administrators and customers.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-purple-700" />
              </div>
              <span className="admin-stat-label text-purple-900">Admin Users</span>
            </div>
            <div className="admin-stat-number text-purple-800">
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Administrators with full privileges to manage the dahabiya fleet and oversee all operations.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-green-700" />
              </div>
              <span className="admin-stat-label text-green-900">Customer Users</span>
            </div>
            <div className="admin-stat-number text-green-800">
              {users.filter(u => u.role === 'USER').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Valued customers and distinguished guests who have chosen to embark on magical journeys along the eternal Nile.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Edit className="w-6 h-6 text-orange-700" />
              </div>
              <span className="admin-stat-label text-orange-900">Managers</span>
            </div>
            <div className="admin-stat-number text-orange-800">
              {users.filter(u => u.role === 'MANAGER').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Operations managers with administrative access to manage content and users.
            </p>
          </div>

          <div className="admin-stat-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Eye className="w-6 h-6 text-blue-700" />
              </div>
              <span className="admin-stat-label text-blue-900">Guides</span>
            </div>
            <div className="admin-stat-number text-blue-800">
              {users.filter(u => u.role === 'GUIDE').length}
            </div>
            <p className="admin-stat-description admin-text-justify">
              Tour guides with content management access for itineraries and tours.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="admin-card mb-8">
          <CardHeader className="admin-card-header">
            <CardTitle className="admin-card-title">
              <UserPlus className="w-6 h-6" />
              <span>𓊪 Quick Actions 𓊪</span>
            </CardTitle>
            <p className="admin-card-description">
              Perform administrative tasks efficiently. These tools allow you to manage users, export data, and configure permissions.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
                <DialogTrigger asChild>
                  <Button className="admin-btn-secondary h-12 admin-focus">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add New Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white border-2 border-amber-200 shadow-2xl">
                  <DialogHeader className="pb-4 border-b border-amber-100">
                    <DialogTitle className="flex items-center gap-2 text-amber-800 text-xl font-bold">
                      <Crown className="w-6 h-6 text-amber-600" />
                      Create New Admin User
                    </DialogTitle>
                    <p className="text-amber-600 text-sm mt-2">
                      Add a new administrator to the system
                    </p>
                  </DialogHeader>
                  <form onSubmit={handleCreateAdmin} className="space-y-6 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-amber-800 font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        required
                        className="border-2 border-amber-200 focus:border-blue-400 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-amber-800 font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        required
                        className="border-2 border-amber-200 focus:border-blue-400 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-amber-800 font-semibold">
                        Password *
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password (min 6 characters)"
                        required
                        minLength={6}
                        className="border-2 border-amber-200 focus:border-blue-400 focus:ring-blue-200 bg-white text-gray-900 placeholder-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-amber-800 font-semibold">
                        Role *
                      </Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger className="border-2 border-amber-200 focus:border-blue-400 focus:ring-blue-200 bg-white text-gray-900">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-amber-200">
                          <SelectItem value="ADMIN" className="text-gray-900 hover:bg-blue-50">
                            👑 Admin - Full system access
                          </SelectItem>
                          <SelectItem value="MANAGER" className="text-gray-900 hover:bg-blue-50">
                            📊 Manager - Administrative access
                          </SelectItem>
                          <SelectItem value="GUIDE" className="text-gray-900 hover:bg-blue-50">
                            🗺️ Guide - Tour management access
                          </SelectItem>
                          <SelectItem value="USER" className="text-gray-900 hover:bg-blue-50">
                            👤 User - Customer access
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-3 pt-6 border-t border-amber-100">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowCreateModal(false)}
                        disabled={createLoading}
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-ocean-blue-600 to-navy-blue-600 hover:from-ocean-blue-700 hover:to-navy-blue-700 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                        disabled={createLoading}
                      >
                        {createLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Creating Admin...
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Create Admin User
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                className="admin-btn-primary h-12 admin-focus"
                onClick={handleExportUsers}
              >
                <Download className="w-5 h-5 mr-2" />
                Export User List
              </Button>
              <Button className="admin-btn-secondary h-12 admin-focus">
                <Shield className="w-5 h-5 mr-2" />
                User Permissions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card className="admin-card">
          <CardHeader className="admin-card-header">
            <CardTitle className="admin-card-title">
              <Users className="w-6 h-6" />
              <span>𓇳 All Users 𓇳</span>
            </CardTitle>
            <p className="admin-card-description">
              Complete registry of all users in the royal system with their roles and privileges. This comprehensive archive contains detailed information about every soul who has joined our pharaonic journey.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            {users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-text-justify">
                        User Details
                      </th>
                      <th className="admin-text-justify">
                        Role & Status
                      </th>
                      <th className="admin-text-justify">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                              user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                              user.role === 'MANAGER' ? 'bg-gradient-to-r from-deep-blue-500 to-navy-blue-600' :
                              user.role === 'GUIDE' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}>
                              {user.role === 'ADMIN' ? <Crown className="w-5 h-5" /> :
                               user.role === 'MANAGER' ? <Edit className="w-5 h-5" /> :
                               user.role === 'GUIDE' ? <Eye className="w-5 h-5" /> :
                               <User className="w-5 h-5" />}
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900">
                                {user.name || user.email}
                              </div>
                              <div className="text-sm text-gray-600 admin-text-justify">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge
                            className={`admin-badge ${
                              user.role === 'ADMIN' ? 'admin-badge-purple' :
                              user.role === 'MANAGER' ? 'admin-badge-orange' :
                              user.role === 'GUIDE' ? 'admin-badge-blue' :
                              'admin-badge-green'
                            }`}
                          >
                            {user.role === 'ADMIN' ? '👑 Admin' :
                             user.role === 'MANAGER' ? '📊 Manager' :
                             user.role === 'GUIDE' ? '🗺️ Guide' :
                             '👤 Customer'}
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            Active Member
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-blue-300 text-blue-700 hover:bg-blue-50 admin-focus"
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-green-300 text-green-700 hover:bg-green-50 admin-focus"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-red-300 text-red-700 hover:bg-red-50 admin-focus"
                              onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-loading flex-col py-16">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600 admin-text-justify max-w-md mx-auto mb-6">
                  The royal archives appear to be empty. Begin by adding the first administrator to establish the kingdom&apos;s digital presence and unlock the full potential of this powerful system.
                </p>
                <Button className="admin-btn-primary admin-focus">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add First User
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md bg-white border-2 border-amber-200 shadow-2xl">
            <DialogHeader className="pb-4 border-b border-amber-100">
              <DialogTitle className="flex items-center gap-2 text-amber-800 text-xl font-bold">
                <Edit className="w-6 h-6 text-amber-600" />
                Edit User
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-6 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-amber-800 font-semibold">Full Name *</Label>
                <Input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="border-2 border-amber-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-amber-800 font-semibold">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="border-2 border-amber-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-amber-800 font-semibold">
                  New Password (leave blank to keep current)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter new password or leave blank"
                  className="border-2 border-amber-200 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-amber-800 font-semibold">Role *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="border-2 border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-amber-200">
                    <SelectItem value="ADMIN">👑 Admin</SelectItem>
                    <SelectItem value="MANAGER">📊 Manager</SelectItem>
                    <SelectItem value="GUIDE">🗺️ Guide</SelectItem>
                    <SelectItem value="USER">👤 User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-amber-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={createLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-ocean-blue-600 to-navy-blue-600"
                  disabled={createLoading}
                >
                  {createLoading ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View User Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="sm:max-w-md bg-white border-2 border-blue-200 shadow-2xl">
            <DialogHeader className="pb-4 border-b border-blue-100">
              <DialogTitle className="flex items-center gap-2 text-blue-800 text-xl font-bold">
                <Eye className="w-6 h-6 text-blue-600" />
                User Details
              </DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 pt-4">
                <div>
                  <Label className="text-gray-600 text-sm">Name</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedUser.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Email</Label>
                  <p className="text-lg font-semibold text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-sm">Role</Label>
                  <Badge className={`mt-1 ${
                    selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    selectedUser.role === 'MANAGER' ? 'bg-orange-100 text-orange-800' :
                    selectedUser.role === 'GUIDE' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role === 'ADMIN' ? '👑 Admin' :
                     selectedUser.role === 'MANAGER' ? '📊 Manager' :
                     selectedUser.role === 'GUIDE' ? '🗺️ Guide' :
                     '👤 Customer'}
                  </Badge>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-blue-100">
                  <Button
                    variant="outline"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditUser(selectedUser);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}