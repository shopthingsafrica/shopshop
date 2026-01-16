'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code === 'PGRST116') {
    // Profile doesn't exist, create it from auth data
    const { data: newProfile, error: createError } = await supabase
      .from('profiles')
      // @ts-ignore
      .insert({
        id: user.id,
        email: user.email!,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
        phone: user.phone || null,
        role: 'buyer',
        is_active: true,
        two_factor_enabled: false,
        preferred_currency: 'NGN' // Default to NGN
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating missing profile:', createError);
      return null;
    }
    
    profile = newProfile;
  } else if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return profile;
}

export async function updateUserProfile(data: { firstName: string; lastName: string; phone: string }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/account/profile');
  return { success: true };
}

export async function verifyCurrentPassword(password: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: 'Not authenticated' };

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: password,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}

export async function enrollTwoFactor() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
    });

    if (error) return { error: error.message };
    
    return { data };
}

export async function verifyTwoFactor(factorId: string, code: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  });

  if (error) return { error: error.message };

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
      await supabase.from('profiles').update({ two_factor_enabled: true }).eq('id', user.id);
  }

  return { success: true };
}

export async function disableTwoFactor() {
    const supabase = await createClient();
     const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: factors } = await supabase.auth.mfa.listFactors();
    if (!factors || factors.totp.length === 0) {
        // Just in case profile is out of sync
        await supabase.from('profiles').update({ two_factor_enabled: false }).eq('id', user.id);
        return { success: true };
    }

    // Unenroll all TOTP factors
    for (const factor of factors.totp) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
    }
    
    await supabase.from('profiles').update({ two_factor_enabled: false }).eq('id', user.id);
    return { success: true };
}
