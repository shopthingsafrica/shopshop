'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  error?: string;
  success?: boolean;
  requiresOtp?: boolean;
}

export async function signUp(data: SignUpData): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
        phone: data.phone || null,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signIn(data: SignInData): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // Check if user has 2FA enabled
  if (authData.user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('two_factor_enabled')
      .eq('id', authData.user.id)
      .single<{ two_factor_enabled: boolean }>();
    
    if (!profileError && profile?.two_factor_enabled === true) {
      // Sign out and require OTP verification
      await supabase.auth.signOut();
      return { requiresOtp: true };
    }
  }
  
  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function verifyOtp(email: string, token: string): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function resendOtp(email: string): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function forgotPassword(email: string): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function resetPassword(password: string): Promise<AuthResult> {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.updateUser({
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

export async function signInWithOAuth(provider: 'google' | 'apple'): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { url: data.url };
}
