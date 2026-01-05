import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  ShoppingBag,
  Heart,
  Package,
  MapPin,
  Store,
  ChevronRight,
  User,
  Bell,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Dashboard | ShopThings',
  description: 'Your personal dashboard',
};

export default async function CustomerDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/dashboard');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<{ id: string; email: string; full_name: string | null; role: string }>();

  // Check if user is a vendor - redirect to vendor dashboard
  if ((profile as any)?.role === 'vendor') {
    redirect('/vendor/dashboard');
  }

  // Check if user is an admin - redirect to admin dashboard
  if ((profile as any)?.role === 'admin') {
    redirect('/admin/dashboard');
  }

  // Get recent orders count
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get wishlist count
  const { count: wishlistCount } = await supabase
    .from('wishlist_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get addresses count
  const { count: addressesCount } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const quickLinks = [
    {
      title: 'My Orders',
      description: `${ordersCount || 0} orders`,
      icon: Package,
      href: '/orders',
      color: 'bg-blue-500',
    },
    {
      title: 'Wishlist',
      description: `${wishlistCount || 0} items saved`,
      icon: Heart,
      href: '/wishlist',
      color: 'bg-pink-500',
    },
    {
      title: 'Addresses',
      description: `${addressesCount || 0} addresses`,
      icon: MapPin,
      href: '/account/addresses',
      color: 'bg-green-500',
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: Settings,
      href: '/account/profile',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
          Welcome back, {(profile as any)?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your account
        </p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${link.color}`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-foreground mt-4">{link.title}</h3>
            <p className="text-sm text-muted-foreground">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Become a Seller CTA */}
      <div className="bg-gradient-to-r from-secondary to-secondary/80 rounded-2xl p-8 text-white mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-white/20 rounded-xl">
              <Store className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-bold mb-2">
                Start Selling on ShopThings
              </h2>
              <p className="text-white/90 max-w-lg">
                Turn your passion into profit! Join thousands of African artisans and entrepreneurs 
                selling authentic products to customers worldwide.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Zero listing fees to get started
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Reach millions of customers globally
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  Secure payments and fast withdrawals
                </li>
              </ul>
            </div>
          </div>
          <Link href="/vendor/apply">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-secondary hover:bg-white/90 whitespace-nowrap"
            >
              Become a Seller
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="bg-white rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Continue Shopping</h2>
          <Link href="/products" className="text-secondary hover:underline text-sm">
            View all products
          </Link>
        </div>
        <p className="text-muted-foreground mb-4">
          Explore our curated collection of authentic African products
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/categories/african-fashion">
            <Button variant="outline" size="sm">Fashion</Button>
          </Link>
          <Link href="/categories/art-sculptures">
            <Button variant="outline" size="sm">Art & Sculptures</Button>
          </Link>
          <Link href="/categories/home-decor">
            <Button variant="outline" size="sm">Home Decor</Button>
          </Link>
          <Link href="/categories/gourmet-foods">
            <Button variant="outline" size="sm">Gourmet Foods</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
