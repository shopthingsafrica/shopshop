import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MessagingContainer } from '@/components/messaging';

export const metadata = {
  title: 'Messages | ShopThings',
  description: 'View and manage your conversations',
};

export default async function MessagesPage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirectTo=/messages');
  }

  // Get user profile to check if they're a vendor
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isVendor = (profile as any)?.role === 'vendor';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
          Messages
        </h1>
        <p className="text-muted-foreground mt-1">
          {isVendor 
            ? 'Communicate with your customers' 
            : 'Chat with vendors about products'}
        </p>
      </div>

      <MessagingContainer userId={user.id} isVendor={isVendor} />
    </div>
  );
}
