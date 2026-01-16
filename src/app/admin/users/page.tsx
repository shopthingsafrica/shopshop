'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  Shield,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  UserCog,
  UserX,
  Mail,
  Eye,
  Edit,
  FileText,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { getAdminUsersList } from '../actions';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Vendors', href: '/admin/vendors', icon: Store },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  buyer: { bg: 'bg-blue-100', text: 'text-blue-800' },
  vendor: { bg: 'bg-purple-100', text: 'text-purple-800' },
  admin: { bg: 'bg-red-100', text: 'text-red-800' },
};

// Helper for role color fallback
const getRoleColor = (role: string) => ROLE_COLORS[role] || { bg: 'bg-gray-100', text: 'text-gray-800' };

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

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

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-4 border-b border-white/10'>
          <Link href='/' className='flex items-center gap-2'>
            <Store className='w-8 h-8 text-secondary' />
            <span className='font-heading font-bold text-lg'>
              Shop<span className='text-secondary'>Things</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className='lg:hidden p-1 hover:bg-white/10 rounded'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Admin Badge */}
        <div className='p-4 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center'>
              <Shield className='w-5 h-5 text-red-400' />
            </div>
            <div className='flex-1 min-w-0'>
              <p className='font-medium'>Admin Panel</p>
              <p className='text-xs text-white/60'>Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='p-4 space-y-1'>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin/users';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className='w-5 h-5' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-white/10'>
          <Link
            href='/'
            className='flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors'
          >
            <Store className='w-5 h-5' />
            <span>View Store</span>
          </Link>
          <button className='flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full'>
            <LogOut className='w-5 h-5' />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className='lg:ml-64'>
        {/* Top Header */}
        <header className='bg-white border-b sticky top-0 z-30'>
          <div className='flex items-center justify-between px-4 lg:px-6 py-4'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => setSidebarOpen(true)}
                className='lg:hidden p-2 hover:bg-gray-100 rounded-lg'
              >
                <Menu className='w-5 h-5' />
              </button>
              <h1 className='text-xl font-heading font-bold text-primary'>User Management</h1>
            </div>

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
          </div>
        </header>

        {/* Dashboard Content */}
        <main className='p-4 lg:p-6'>
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
                               <Users className='w-5 h-5 text-gray-500' />
                            </div>
                            <div>
                              <div className='font-medium text-gray-900'>{user.full_name || 'No Name'}</div>
                              <div className='text-sm text-gray-500'>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4'>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className='px-6 py-4'>
                          <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                            Active
                          </span>
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-500'>
                          {user.orders}
                        </td>
                        <td className='px-6 py-4 text-right'>
                          <Button variant='ghost' size='sm'>
                            <MoreVertical className='w-4 h-4' />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className='px-6 py-4 border-t flex items-center justify-between'>
                <div className='text-sm text-gray-500'>Page {currentPage}</div>
                <div className='flex gap-2'>
                    <Button variant='outline' size='sm' onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
                    <Button variant='outline' size='sm' onClick={() => setCurrentPage(p => p + 1)} disabled={users.length < 20}>Next</Button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
