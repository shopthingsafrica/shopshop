import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Clock, CheckCircle, Mail, ArrowLeft, Store } from 'lucide-react';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Application Pending | ShopThings',
  description: 'Your vendor application is being reviewed',
};

export default async function VendorPendingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/vendor/pending');
  }

  // Check vendor status
  const { data: vendor } = await supabase
    .from('vendors')
    .select('status, store_name, created_at')
    .eq('user_id', user.id)
    .single<{ status: string; store_name: string; created_at: string }>();

  // If approved, redirect to vendor dashboard
  if ((vendor as any)?.status === 'approved') {
    redirect('/vendor/dashboard');
  }

  // If no application, redirect to apply page
  if (!vendor) {
    redirect('/vendor/apply');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single<{ email: string }>();

  const applicationDate = (vendor as any)?.created_at
    ? new Date((vendor as any).created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-muted flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full animate-fade-in">
        <div className="bg-white rounded-3xl p-10 border border-border/50 shadow-xl shadow-black/5 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-100">
            <Clock className="w-12 h-12 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
            Application Under Review
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Thank you for applying to sell on ShopThings!
          </p>

          {/* Store Info Card */}
          <div className="bg-gradient-to-br from-muted/70 to-muted rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/70 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{(vendor as any)?.store_name}</p>
                <p className="text-sm text-muted-foreground">Applied on {applicationDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground bg-white/60 rounded-lg px-3 py-2">
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="font-medium">Status: Pending Review</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="text-left mb-8">
            <h2 className="font-heading font-semibold text-foreground mb-4 text-lg">What happens next?</h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-muted-foreground pt-1">
                  Our team will review your application within 1-3 business days
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-muted-foreground pt-1">
                  You&apos;ll receive an email at <strong className="text-foreground">{(profile as any)?.email}</strong> once your application is approved
                </span>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 text-secondary" />
                </div>
                <span className="text-muted-foreground pt-1">
                  After approval, you can start adding products and selling immediately
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/vendor/dashboard" className="block">
              <Button variant="primary" fullWidth size="lg">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/help/seller-faq" className="block">
              <Button variant="ghost" fullWidth>
                Seller FAQ
              </Button>
            </Link>
          </div>

          {/* Contact */}
          <p className="text-sm text-muted-foreground mt-8">
            Questions? Contact us at{' '}
            <a href="mailto:sellers@shopthings.africa" className="text-secondary hover:underline">
              sellers@shopthings.africa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
