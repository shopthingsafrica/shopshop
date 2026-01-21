'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  MoreVertical,
  UserCog,
  Users,
  Edit,
  Ban,
  Trash2,
  Key,
  UserCheck,
  Shield,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AdminLayout } from '@/components/admin';
import { 
  getAdminUsersList, 
  updateUserRole, 
  suspendUser, 
  unsuspendUser, 
  deleteUser, 
  resetUserPassword 
} from '../actions';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  buyer: { bg: 'bg-blue-100', text: 'text-blue-800' },
  vendor: { bg: 'bg-purple-100', text: 'text-purple-800' },
  admin: { bg: 'bg-red-100', text: 'text-red-800' },
};

interface UserActionsDropdownProps {
  user: any;
  onAction: (action: string, userId: string) => void;
}

function UserActionsDropdown({ user, onAction }: UserActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    // View Profile
    {
      icon: Eye,
      label: 'View Profile',
      action: 'view',
      color: 'text-gray-600',
      available: true,
    },
    // Edit User
    {
      icon: Edit,
      label: 'Edit User',
      action: 'edit',
      color: 'text-blue-600',
      available: true,
    },
    // Role Management
    ...(user.role !== 'admin' ? [
      {
        icon: Shield,
        label: 'Make Admin',
        action: 'make-admin',
        color: 'text-red-600',
        available: user.role !== 'admin',
      }
    ] : []),
    ...(user.role !== 'vendor' ? [
      {
        icon: UserCog,
        label: 'Make Vendor',
        action: 'make-vendor',
        color: 'text-purple-600',
        available: user.role !== 'vendor',
      }
    ] : []),
    ...(user.role !== 'buyer' ? [
      {
        icon: Users,
        label: 'Make Buyer',
        action: 'make-buyer',
        color: 'text-blue-600',
        available: user.role !== 'buyer',
      }
    ] : []),
    // Password Reset
    {
      icon: Key,
      label: 'Reset Password',
      action: 'reset-password',
      color: 'text-orange-600',
      available: true,
    },
    // Suspension
    ...(user.is_suspended ? [
      {
        icon: UserCheck,
        label: 'Unsuspend User',
        action: 'unsuspend',
        color: 'text-green-600',
        available: true,
      }
    ] : [
      {
        icon: Ban,
        label: 'Suspend User',
        action: 'suspend',
        color: 'text-yellow-600',
        available: true,
      }
    ]),
    // Delete (dangerous action)
    {
      icon: Trash2,
      label: 'Delete User',
      action: 'delete',
      color: 'text-red-600',
      available: user.role !== 'admin', // Can't delete admin users
      dangerous: true,
    },
  ].filter(action => action.available);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More actions"
      >
        <MoreVertical className="w-4 h-4" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  onAction(action.action, user.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3
                  ${action.dangerous ? 'hover:bg-red-50' : ''}
                  ${action.color}
                `}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { users: fetchedUsers, count } = await getAdminUsersList(currentPage, 20, searchQuery);
        if (active) {
          setUsers(fetchedUsers);
          setTotalCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [currentPage, searchQuery]);

  const handleUserAction = async (action: string, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setActionLoading(userId);

    try {
      switch (action) {
        case 'view':
          // Navigate to user profile view
          window.open(`/admin/users/${userId}`, '_blank');
          break;

        case 'edit':
          // Navigate to user edit form
          window.open(`/admin/users/${userId}/edit`, '_blank');
          break;

        case 'make-admin':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} an admin?`)) {
            await updateUserRole(userId, 'admin');
            // Refresh the list
            const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
            setUsers(updatedUsers);
          }
          break;

        case 'make-vendor':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} a vendor?`)) {
            await updateUserRole(userId, 'vendor');
            const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
            setUsers(updatedUsers);
          }
          break;

        case 'make-buyer':
          if (confirm(`Are you sure you want to make ${user.full_name || user.email} a buyer?`)) {
            await updateUserRole(userId, 'buyer');
            const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
            setUsers(updatedUsers);
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
            const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
            setUsers(updatedUsers);
          }
          break;

        case 'unsuspend':
          if (confirm(`Are you sure you want to unsuspend ${user.full_name || user.email}?`)) {
            await unsuspendUser(userId);
            const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
            setUsers(updatedUsers);
          }
          break;

        case 'delete':
          if (confirm(`⚠️ DANGER: Are you sure you want to permanently delete ${user.full_name || user.email}? This action cannot be undone!`)) {
            if (confirm('This will permanently delete all user data. Type "DELETE" to confirm:') && 
                prompt('Type DELETE to confirm:') === 'DELETE') {
              await deleteUser(userId);
              const { users: updatedUsers } = await getAdminUsersList(currentPage, 20, searchQuery);
              setUsers(updatedUsers);
            }
          }
          break;

        default:
          console.log(`Action ${action} not implemented yet`);
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const headerActions = (
    <div className='flex items-center gap-2'>
      <Button variant='outline'>
        <Download className='w-4 h-4 mr-2' />
        Export
      </Button>
      <Button>
        <UserCog className='w-4 h-4 mr-2' />
        Add User
      </Button>
    </div>
  );

  return (
    <AdminLayout title="User Management" headerActions={headerActions}>
      {/* Filters and Search */}
      <div className='bg-white rounded-xl shadow-sm p-4 mb-6'>
        <div className='flex flex-col md:flex-row items-center gap-4 justify-between'>
          <div className='relative w-full md:w-96'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            <Input
              placeholder='Search by name, email...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b'>
              <tr>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  User
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Joined
                </th>
                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Orders
                </th>
                <th className='px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {isLoading ? (
                <tr><td colSpan={6} className='p-8 text-center'>Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className='p-8 text-center'>No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                          {user.avatar_url ? (
                            <img 
                              src={user.avatar_url} 
                              alt={user.full_name || 'User'} 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <Users className='w-5 h-5 text-gray-500' />
                          )}
                        </div>
                        <div>
                          <div className='font-medium text-gray-900 flex items-center gap-2'>
                            {user.full_name || 'No Name'}
                            {user.is_suspended && (
                              <div className="inline-flex items-center ml-2" title="Suspended">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              </div>
                            )}
                          </div>
                          <div className='text-sm text-gray-500'>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        ROLE_COLORS[user.role]?.bg || 'bg-gray-100'
                      } ${ROLE_COLORS[user.role]?.text || 'text-gray-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_suspended 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.is_suspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500'>
                      {user.orders}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      {actionLoading === user.id ? (
                        <div className="w-8 h-8 flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                        </div>
                      ) : (
                        <UserActionsDropdown 
                          user={user} 
                          onAction={handleUserAction}
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className='px-6 py-4 border-t flex items-center justify-between'>
            <div className='text-sm text-gray-500'>
              Page {currentPage} • {totalCount} total users
            </div>
            <div className='flex gap-2'>
                <Button 
                  variant='outline' 
                  size='sm' 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant='outline' 
                  size='sm' 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  disabled={users.length < 20}
                >
                  Next
                </Button>
            </div>
        </div>
      </div>
    </AdminLayout>
  );
}
