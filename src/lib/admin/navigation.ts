import {
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  Home,
  FileText,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: any;
}

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Vendors', href: '/admin/vendors', icon: Store },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export const getActiveNavItem = (pathname: string): string => {
  // Handle exact matches first
  const exactMatch = ADMIN_NAV_ITEMS.find(item => item.href === pathname);
  if (exactMatch) return exactMatch.href;
  
  // Handle sub-routes (e.g., /admin/users/123 should highlight Users)
  const pathMatch = ADMIN_NAV_ITEMS.find(item => 
    pathname.startsWith(item.href) && item.href !== '/admin/dashboard'
  );
  
  return pathMatch?.href || '/admin/dashboard';
};