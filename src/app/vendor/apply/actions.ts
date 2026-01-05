'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface VendorApplicationData {
  storeName: string;
  storeDescription: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  businessEmail?: string;
  businessType: string;
  productCategories: string[];
}

export interface ApplicationResult {
  success?: boolean;
  error?: string;
}

export async function submitVendorApplication(
  data: VendorApplicationData
): Promise<ApplicationResult> {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: 'You must be logged in to apply as a vendor' };
  }

  // Check if user already has a vendor application
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('id, status')
    .eq('user_id', user.id)
    .single<{ id: string; status: string }>();

  if (existingVendor) {
    if ((existingVendor as any).status === 'approved') {
      return { error: 'You are already an approved vendor' };
    }
    if ((existingVendor as any).status === 'pending') {
      return { error: 'You already have a pending vendor application' };
    }
  }

  // Create the vendor record
  const { error: vendorError } = await supabase.from('vendors').insert({
    user_id: user.id,
    store_name: data.storeName,
    store_description: data.storeDescription,
    status: 'pending',
    social_links: {
      business_address: data.businessAddress,
      city: data.city,
      state: data.state,
      country: data.country,
      phone_number: data.phoneNumber,
      business_email: data.businessEmail,
      business_type: data.businessType,
      product_categories: data.productCategories,
    },
  } as any);

  if (vendorError) {
    console.error('Vendor creation error:', vendorError);
    return { error: 'Failed to submit application. Please try again.' };
  }

  // Update user profile role to vendor (will be pending until approved)
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'vendor' } as any)
    .eq('id', user.id);

  if (profileError) {
    console.error('Profile update error:', profileError);
    // Don't fail the application if profile update fails
  }

  return { success: true };
}

export async function getVendorApplicationStatus(): Promise<{
  status: string | null;
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: null, error: 'Not authenticated' };
  }

  const { data: vendor } = await supabase
    .from('vendors')
    .select('status')
    .eq('user_id', user.id)
    .single<{ status: string }>();

  return { status: (vendor as any)?.status || null };
}
