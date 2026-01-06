import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are not configured, skip auth check
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Auth will not work.');
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/checkout', '/orders', '/wishlist', '/profile', '/account', '/messages'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    // Redirect to login if accessing protected route without auth
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Vendor application route - requires auth but NOT vendor role
  if (request.nextUrl.pathname.startsWith('/vendor/apply')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', '/vendor/apply');
      return NextResponse.redirect(url);
    }
    // Allow access to vendor application page
    return supabaseResponse;
  }

  // Vendor pending page - requires auth
  if (request.nextUrl.pathname.startsWith('/vendor/pending')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', '/vendor/pending');
      return NextResponse.redirect(url);
    }
    // Allow access - the page will handle status checking
    return supabaseResponse;
  }

  // Vendor dashboard routes - requires approved vendor
  const vendorDashboardRoutes = ['/vendor/dashboard', '/vendor/products', '/vendor/orders', '/vendor/wallet', '/vendor/settings'];
  const isVendorDashboardRoute = vendorDashboardRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isVendorDashboardRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    // Check if user is an approved vendor
    const { data: vendor } = await supabase
      .from('vendors')
      .select('status')
      .eq('user_id', user.id)
      .single<{ status: 'pending' | 'approved' | 'rejected' | 'suspended' | null }>();

    if (!vendor) {
      // No vendor record - redirect to apply
      const url = request.nextUrl.clone();
      url.pathname = '/vendor/apply';
      return NextResponse.redirect(url);
    }

    const vendorStatus = vendor?.status ?? null;

    if (vendorStatus === 'pending') {
      // Pending vendor - redirect to pending page
      const url = request.nextUrl.clone();
      url.pathname = '/vendor/pending';
      return NextResponse.redirect(url);
    }

    if (vendorStatus !== 'approved') {
      // Rejected or suspended - redirect to dashboard with message
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // Admin-only routes
  const adminRoutes = ['/admin'];
  const isAdminRoute = adminRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/auth/login';
      url.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'admin' | 'vendor' | 'customer' | null }>();

    const profileRole = profile?.role ?? null;

    if (profileRole !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
