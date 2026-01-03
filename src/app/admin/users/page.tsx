'use client';

import { useState } from 'react';
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
  Filter,
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

// Mock users data
const MOCK_USERS = [
  {
    id: '1',
    name: 'Amina Johnson',
    email: 'amina@example.com',
    role: 'buyer',
    status: 'active',
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2024-01-18T14:25:00Z',
    avatar: null,
    orders: 12,
  },
  {
    id: '2',
    name: 'Kwame Asante',
    email: 'kwame@example.com',
    role: 'vendor',
    status: 'active',
    created_at: '2024-01-10T08:15:00Z',
    last_login: '2024-01-18T09:00:00Z',
    avatar: null,
    orders: 0,
    store_name: 'Accra Textiles',
  },
  {
    id: '3',
    name: 'Sarah Okonkwo',
    email: 'sarah@example.com',
    role: 'buyer',
    status: 'active',
    created_at: '2024-01-08T16:45:00Z',
    last_login: '2024-01-17T11:30:00Z',
    avatar: null,
    orders: 8,
  },
  {
    id: '4',
    name: 'David Mensah',
    email: 'david@example.com',
    role: 'vendor',
    status: 'inactive',
    created_at: '2023-12-20T11:20:00Z',
    last_login: '2024-01-05T16:00:00Z',
    avatar: null,
    orders: 0,
    store_name: 'Ghana Crafts',
  },
  {
    id: '5',
    name: 'Fatima Bello',
    email: 'fatima@example.com',
    role: 'buyer',
    status: 'active',
    created_at: '2024-01-05T14:00:00Z',
    last_login: '2024-01-18T08:15:00Z',
    avatar: null,
    orders: 15,
  },
  {
    id: '6',
    name: 'John Ade',
    email: 'john.ade@example.com',
    role: 'admin',
    status: 'active',
    created_at: '2023-06-01T09:00:00Z',
    last_login: '2024-01-18T12:00:00Z',
    avatar: null,
    orders: 0,
  },
  {
    id: '7',
    name: 'Grace Olu',
    email: 'grace@example.com',
    role: 'buyer',
    status: 'suspended',
    created_at: '2023-11-15T10:30:00Z',
    last_login: '2024-01-02T14:00:00Z',
    avatar: null,
    orders: 3,
  },
  {
    id: '8',
    name: 'Peter Nnamdi',
    email: 'peter@example.com',
    role: 'vendor',
    status: 'pending',
    created_at: '2024-01-17T08:00:00Z',
    last_login: null,
    avatar: null,
    orders: 0,
    store_name: 'Lagos Designs',
  },
];

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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
  suspended: { bg: 'bg-red-100', text: 'text-red-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
};

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleDeactivateUser = (userId: string) => {
    console.log('Deactivate user:', userId);
    setShowActions(null);
  };

  const handleEditUser = (userId: string) => {
    setShowEditModal(userId);
    setShowActions(null);
  };

  const getUser = (id: string) => MOCK_USERS.find(u => u.id === id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-8 h-8 text-secondary" />
            <span className="font-heading font-bold text-lg">
              Shop<span className="text-secondary">Things</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Admin Panel</p>
              <p className="text-xs text-white/60">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin/users';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? 'bg-secondary text-white' : 'text-white/80 hover:bg-white/10'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Store className="w-5 h-5" />
            <span>View Store</span>
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-heading font-bold text-primary">User Management</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-primary mt-1">{MOCK_USERS.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Buyers</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {MOCK_USERS.filter(u => u.role === 'buyer').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Vendors</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {MOCK_USERS.filter(u => u.role === 'vendor').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {MOCK_USERS.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="vendor">Vendor</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="px-4 pb-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedUsers.length} selected
                </span>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Selected
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <UserX className="w-4 h-4 mr-2" />
                  Deactivate Selected
                </Button>
              </div>
            )}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                      Last Login
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          ROLE_COLORS[user.role]?.bg
                        } ${ROLE_COLORS[user.role]?.text}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          STATUS_COLORS[user.status]?.bg
                        } ${STATUS_COLORS[user.status]?.text}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : 'Never'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === user.id ? null : user.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {showActions === user.id && (
                            <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => handleEditUser(user.id)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                              >
                                <Edit className="w-4 h-4" />
                                Edit User
                              </button>
                              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                <Mail className="w-4 h-4" />
                                Send Email
                              </button>
                              <hr />
                              {user.status === 'active' ? (
                                <button
                                  onClick={() => handleDeactivateUser(user.id)}
                                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                >
                                  <UserX className="w-4 h-4" />
                                  Deactivate
                                </button>
                              ) : (
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-green-50">
                                  <UserCog className="w-4 h-4" />
                                  Activate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {MOCK_USERS.length} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm px-3">Page {currentPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary">Edit User</h2>
              <button
                onClick={() => setShowEditModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {(() => {
                const user = getUser(showEditModal);
                if (!user) return null;

                return (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                      <Input type="text" defaultValue={user.name} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                      <Input type="email" defaultValue={user.email} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Role</label>
                      <select
                        defaultValue={user.role}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        <option value="buyer">Buyer</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Status</label>
                      <select
                        defaultValue={user.status}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </>
                );
              })()}
            </div>
            <div className="p-4 border-t flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditModal(null)}>
                Cancel
              </Button>
              <Button onClick={() => setShowEditModal(null)}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
