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
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl p-8 border border-border text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-heading font-bold text-primary mb-2">
            Application Under Review
          </h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to sell on ShopThings!
          </p>

          {/* Store Info Card */}
          <div className="bg-muted rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{(vendor as any)?.store_name}</p>
                <p className="text-xs text-muted-foreground">Applied on {applicationDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span>Status: Pending Review</span>
            </div>
          </div>

          {/* What's Next */}
          <div className="text-left mb-6">
            <h2 className="font-semibold text-foreground mb-3">What happens next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Our team will review your application within 1-3 business days
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  You&apos;ll receive an email at <strong>{(profile as any)?.email}</strong> once your application is approved
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Store className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  After approval, you can start adding products and selling immediately
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button variant="primary" fullWidth>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/help/seller-faq" className="block">
              <Button variant="outline" fullWidth>
                Seller FAQ
              </Button>
            </Link>
          </div>

          {/* Contact */}
          <p className="text-xs text-muted-foreground mt-6">
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
