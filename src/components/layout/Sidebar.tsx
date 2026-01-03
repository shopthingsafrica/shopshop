'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  Settings,
  Store,
  BarChart3,
  Users,
  Shield,
  Tag,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const VENDOR_MENU: SidebarItem[] = [
  { label: 'Dashboard', href: '/vendor', icon: LayoutDashboard },
  { label: 'Products', href: '/vendor/products', icon: Package },
  { label: 'Orders', href: '/vendor/orders', icon: ShoppingBag },
  { label: 'Wallet', href: '/vendor/wallet', icon: Wallet },
  { label: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { label: 'Store Settings', href: '/vendor/settings', icon: Store },
];

const ADMIN_MENU: SidebarItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Vendors', href: '/admin/vendors', icon: Store },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

interface SidebarProps {
  type: 'vendor' | 'admin';
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export default function Sidebar({ 
  type, 
  userName = 'User', 
  userRole = type === 'vendor' ? 'Vendor' : 'Administrator',
  avatarUrl,
}: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = type === 'vendor' ? VENDOR_MENU : ADMIN_MENU;
  
  const isActive = (href: string) => {
    if (href === '/vendor' || href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-primary text-white transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <Link href="/" className="block">
            {isCollapsed ? (
              <Image
                src="/images/logo.jpeg"
                alt="ShopThings"
                width={40}
                height={40}
                className="h-8 w-8 mx-auto brightness-0 invert"
              />
            ) : (
              <Image
                src="/images/logo.jpeg"
                alt="ShopThings"
                width={120}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            )}
          </Link>
        </div>
        
        {/* User info */}
        <div className={`p-4 border-b border-white/10 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-semibold flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
              ) : (
                userName.charAt(0).toUpperCase()
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="font-medium truncate">{userName}</p>
                <p className="text-sm text-white/60 truncate">{userRole}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-secondary text-white'
                      : 'text-white/80 hover:bg-white/10'
                  } ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Bottom section */}
        <div className="p-4 border-t border-white/10">
          <button
            className={`flex items-center w-full px-3 py-2.5 rounded-lg text-white/80 hover:bg-white/10 transition-colors ${
              isCollapsed ? 'justify-center' : 'space-x-3'
            }`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
        
        {/* Collapse toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 p-1.5 bg-secondary rounded-full text-white hover:bg-secondary/90 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
