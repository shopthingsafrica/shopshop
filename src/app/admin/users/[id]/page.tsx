'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Shield,
  ShoppingBag,
  Package,
  AlertTriangle,
  Edit,
  Ban,
  UserCheck,
  Key,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { AdminLayout } from '@/components/admin';
import { 
  updateUserRole, 
  suspendUser, 
  unsuspendUser, 
  deleteUser, 
  resetUserPassword,
  getAdminUserById
} from '../../actions';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  is_suspended?: boolean;
  suspension_reason?: string;
  suspended_at?: string;
  orders?: number;
  total_spent?: number;
  last_login?: string;
}

export default function AdminUserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const userData = await getAdminUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!user) return;

    setActionLoading(action);

    try {
      switch (action) {
        case 'edit':
          router.push(`/admin/users/${userId}/edit`);
          break;

        case 'make-admin':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} an admin?`)) {
            await updateUserRole(userId, 'admin');
            await fetchUserProfile();
          }
          break;

        case 'make-vendor':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} a vendor?`)) {
            await updateUserRole(userId, 'vendor');
            await fetchUserProfile();
          }
          break;

        case 'make-buyer':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} a buyer?`)) {
            await updateUserRole(userId, 'buyer');
            await fetchUserProfile();
          }
          break;

        case 'reset-password':
          if (confirm(`Send password reset email to ${user.email}?`)) {
            await resetUserPassword(userId, user.email);
            alert('Password reset email sent successfully!');
          }
          break;

        case 'suspend':
          const reason = prompt(`Reason for suspending ${user.full_name || user.email}:`);
          if (reason !== null) {
            await suspendUser(userId, reason);
            await fetchUserProfile();
          }
          break;

        case 'unsuspend':
          if (confirm(`Are you sure you want to unsuspend ${user.full_name || user.email}?`)) {
            await unsuspendUser(userId);
            await fetchUserProfile();
          }
          break;

        case 'delete':
          if (confirm(`⚠️ DANGER: Are you sure you want to permanently delete ${user.full_name || user.email}? This action cannot be undone!`)) {
            if (confirm('This will permanently delete all user data. Type "DELETE" to confirm:') && 
                prompt('Type DELETE to confirm:') === 'DELETE') {
              await deleteUser(userId);
              router.push('/admin/users');
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button onClick={() => handleAction('edit')}>
        <Edit className="w-4 h-4 mr-2" />
        Edit User
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <AdminLayout title="User Profile" headerActions={headerActions}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout title="User Profile" headerActions={headerActions}>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
          <p className="text-gray-500">The user you're looking for doesn't exist.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Profile" headerActions={headerActions}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt={user.full_name || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.full_name || 'No Name'}
                  </h1>
                  {user.is_suspended && (
                    <div className="flex items-center" title="Suspended">
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {user.is_suspended && user.suspension_reason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800">Suspended</p>
                    <p className="text-sm text-red-600">{user.suspension_reason}</p>
                    {user.suspended_at && (
                      <p className="text-xs text-red-500 mt-1">
                        Since {new Date(user.suspended_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{user.orders || 0}</p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₦{user.total_spent?.toLocaleString() || '0'}</p>
                  <p className="text-sm text-gray-500">Total Spent</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </p>
                  <p className="text-sm text-gray-500">Last Login</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => handleAction('edit')}
                disabled={actionLoading === 'edit'}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit User
              </Button>

              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => handleAction('reset-password')}
                disabled={actionLoading === 'reset-password'}
              >
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </Button>

              {user.is_suspended ? (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('unsuspend')}
                  disabled={actionLoading === 'unsuspend'}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Unsuspend User
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('suspend')}
                  disabled={actionLoading === 'suspend'}
                  className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Suspend User
                </Button>
              )}
            </div>
          </div>

          {/* Role Management */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Role Management</h3>
            <div className="space-y-2">
              {user.role !== 'buyer' && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('make-buyer')}
                  disabled={actionLoading === 'make-buyer'}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Make Buyer
                </Button>
              )}

              {user.role !== 'vendor' && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('make-vendor')}
                  disabled={actionLoading === 'make-vendor'}
                  className="text-purple-600 border-purple-300 hover:bg-purple-50"
                >
                  Make Vendor
                </Button>
              )}

              {user.role !== 'admin' && (
                <Button 
                  variant="outline" 
                  fullWidth 
                  onClick={() => handleAction('make-admin')}
                  disabled={actionLoading === 'make-admin'}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Make Admin
                </Button>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          {user.role !== 'admin' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border-red-200">
              <h3 className="font-semibold text-red-900 mb-4">Danger Zone</h3>
              <Button 
                variant="outline" 
                fullWidth 
                onClick={() => handleAction('delete')}
                disabled={actionLoading === 'delete'}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete User
              </Button>
              <p className="text-xs text-red-500 mt-2">
                This action cannot be undone.
              </p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}