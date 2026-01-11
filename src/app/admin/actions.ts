'use server';

import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

export type DashboardStats = {
  totalUsers: number;
  activeVendors: number;
  totalProducts: number;
  salesVolume: number;
  pendingVendors: number;
  pendingProducts: number;
  pendingWithdrawals: number;
  pendingReports: number; // Placeholder as reports table might not exist
  recentActivities: any[];
  topVendors: any[];
  userGrowth: any[];
};

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Parallelize fetch requests for better performance
  const [
    { count: totalUsers },
    { count: activeVendors },
    { count: totalProducts },
    { data: salesData },
    { count: pendingVendors },
    { count: pendingProducts },
    { count: pendingWithdrawals },
    { data: recentOrders },
    { data: recentVendors },
    { data: recentProducts }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('total').eq('payment_status', 'completed'),
    supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('wallet_transactions').select('*', { count: 'exact', head: true }).eq('type', 'withdrawal').eq('status', 'pending'),
    supabase.from('orders').select('id, created_at, order_number, total').order('created_at', { ascending: false }).limit(5),
    supabase.from('vendors').select('id, store_name, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, created_at').order('created_at', { ascending: false }).limit(5)
  ]);

  // Calculate Total Sales Volume
  const salesVolume = salesData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0;

  // Mix Recent Activities
  const activities = [
    ...(recentOrders?.map(o => ({
      id: o.id,
      type: 'order_completed',
      message: `Order #${o.order_number} completed`, // simplified
      time: o.created_at,
      rawTime: new Date(o.created_at).getTime()
    })) || []),
    ...(recentVendors?.map(v => ({
      id: v.id,
      type: 'vendor_registered',
      message: `New vendor registration: ${v.store_name}`,
      time: v.created_at,
      rawTime: new Date(v.created_at).getTime()
    })) || []),
    ...(recentProducts?.map(p => ({
      id: p.id,
      type: 'product_submitted',
      message: `Product submitted: ${p.name}`,
      time: p.created_at,
      rawTime: new Date(p.created_at).getTime()
    })) || [])
  ].sort((a, b) => b.rawTime - a.rawTime).slice(0, 10);

  // Mocking Top Vendors calculation for now (requires complex join/group by not easily done in one simple query)
  // In a real scenario, this would be a RPC call or a specific complex query.
  const topVendors: any[] = []; 

  // User Growth: Simple histogram for last 6 months (mock-ish implementation with real query structure if possible)
  // For now return empty or simple buckets requires database functions `date_trunc`.
  // We'll stick to returning a structure the frontend use, maybe fetching all user created_at dates? 
  // If users are thousands, fetching all dates is bad. 
  // Let's use a RPC or just fetch last 1000 users and compute.
  const userGrowth: any[] = [];

  return {
    totalUsers: totalUsers || 0,
    activeVendors: activeVendors || 0,
    totalProducts: totalProducts || 0,
    salesVolume,
    pendingVendors: pendingVendors || 0,
    pendingProducts: pendingProducts || 0,
    pendingWithdrawals: pendingWithdrawals || 0,
    pendingReports: 0, // No reports table yet
    recentActivities: activities,
    topVendors,
    userGrowth
  };
}
