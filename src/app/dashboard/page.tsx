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
  ArrowRight,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui';
import ProductCard from '@/components/products/ProductCard';
import type { ProductWithDetails } from '@/types';

export const metadata = {
  title: 'Dashboard | ShopThings',
  description: 'Your personal dashboard',
};

export const dynamic = 'force-dynamic';

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

  if ((profile as any)?.role === 'vendor') {
    redirect('/vendor/dashboard');
  }

  if ((profile as any)?.role === 'admin') {
    redirect('/admin/dashboard');
  }

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: wishlistCount } = await supabase
    .from('wishlist_items')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const { count: addressesCount } = await supabase
    .from('addresses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Fetch Real Recommended Products (Latest Active Products)
  const { data: recommendedProducts } = await supabase
    .from('products')
    .select('*, vendor:vendors(store_name, id, is_verified, logo_url), category:categories(name, slug)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4);

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
    <div className='min-h-screen bg-muted/30'>
      <div className='max-w-7xl mx-auto px-4 py-8 md:py-12'>
        {/* Welcome Section */}
        <div className='mb-10'>
          <div className='flex items-center gap-4 mb-3'>
            <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-lg shadow-secondary/20'>
              <User className='w-7 h-7 text-white' />
            </div>
            <div>
              <h1 className='text-2xl md:text-3xl font-heading font-bold text-foreground'>
                Welcome back, {(profile as any)?.full_name?.split(' ')[0] || 'there'}!
              </h1>
              <p className='text-muted-foreground'>
                Here&apos;s what&apos;s happening with your account
              </p>
              <div className='mt-2 inline-flex items-center gap-2 rounded-full bg-white border border-border/70 px-3 py-1 text-xs font-semibold text-muted-foreground'>
                <span className='inline-block w-2 h-2 rounded-full bg-secondary' aria-hidden />
                Customer account
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8'>
          {[
            { label: 'Track order', href: '/orders', icon: Package },
            { label: 'Reorder items', href: '/orders', icon: ShoppingBag },
            { label: 'Start a return', href: '/orders', icon: ArrowRight },
            { label: 'Contact support', href: '/help', icon: Heart },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className='flex items-center gap-3 rounded-2xl border border-border/60 bg-white hover:border-secondary/40 hover:shadow-md transition-all duration-200 px-4 py-3'
            >
              <action.icon className='w-5 h-5 text-secondary' />
              <span className='font-medium text-foreground'>{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Quick Links Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='group bg-white rounded-2xl p-6 border border-border/50 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 hover:-translate-y-1'
            >
              <div className='flex items-start justify-between'>
                <div className={`p-3.5 rounded-xl ${link.color} shadow-lg`}>
                  <link.icon className='w-6 h-6 text-white' />
                </div>
                <ChevronRight className='w-5 h-5 text-muted-foreground/50 group-hover:text-secondary group-hover:translate-x-1 transition-all duration-200' />
              </div>
              <h3 className='font-semibold text-foreground mt-5 mb-1'>{link.title}</h3>
              <p className='text-sm text-muted-foreground'>{link.description}</p>
            </Link>
          ))}
        </div>

        {/* Recommended for You */}
        <div className='bg-white rounded-2xl border border-border/50 p-6 shadow-sm mb-10'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-xl font-heading font-semibold text-foreground'>Recommended for you</h2>
              <p className='text-muted-foreground text-sm'>Curated picks based on what customers love</p>
            </div>
            <Link href='/products' className='text-secondary text-sm font-semibold flex items-center gap-1 hover:text-secondary/80'>
              See all
              <ChevronRight className='w-4 h-4' />
            </Link>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {recommendedProducts && recommendedProducts.length > 0 ? (
              recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))
            ) : (
              <p className='text-muted-foreground col-span-full py-4 text-center'>Check back soon for recommendations!</p>
            )}
          </div>
        </div>

        {/* Become a Seller CTA */}
        <div className='relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/80 rounded-3xl p-8 md:p-10 text-white mb-10 shadow-2xl shadow-secondary/20'>
          <div className='absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2' />
          <div className='absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2' />
          
          <div className='relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8'>
            <div className='flex items-start gap-5'>
              <div className='p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg'>
                <Store className='w-10 h-10' />
              </div>
              <div>
                <h2 className='text-2xl md:text-3xl font-heading font-bold mb-3'>
                  Start Selling on ShopThings
                </h2>
                <p className='text-white/90 max-w-lg text-lg'>
                  Turn your passion into profit! Join thousands of African artisans and entrepreneurs 
                  selling authentic products to customers worldwide.
                </p>
                <ul className='mt-5 space-y-2.5 text-white/85'>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-white rounded-full' />
                    Zero listing fees to get started
                </li>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-white rounded-full' />
                    Reach millions of customers globally
                  </li>
                  <li className='flex items-center gap-3'>
                    <div className='w-2 h-2 bg-white rounded-full' />
                    Secure payments and fast withdrawals
                  </li>
                </ul>
              </div>
            </div>
            <Link href='/vendor/apply' className='flex-shrink-0'>
              <Button 
                variant='secondary' 
                size='lg'
                className='bg-white text-secondary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap group'
              >
                Become a Seller
                <ArrowRight className='w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          </div>
        </div>

        {/* Continue Shopping */}
        <div className='bg-white rounded-2xl p-8 border border-border/50 shadow-sm'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-xl font-heading font-semibold text-foreground'>Continue Shopping</h2>
            <Link href='/products' className='text-secondary hover:text-secondary/80 transition-colors text-sm font-medium flex items-center gap-1 group'>
              View all products
              <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
            </Link>
          </div>
          <p className='text-muted-foreground mb-6'>
            Explore our latest collections and find unique items handcrafted with love.
          </p>
        </div>
      </div>
    </div>
  );
}
