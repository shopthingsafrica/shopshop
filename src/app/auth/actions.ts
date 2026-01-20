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
  
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    
    if (error) {
      // Handle specific error types
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password. Please check your credentials and try again.' };
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please check your email and click the confirmation link before signing in.' };
      }
      return { error: error.message };
    }
    
    // Check if user has 2FA enabled
    if (authData.user) {
      try {
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
      } catch (profileErr) {
        console.warn('Failed to check 2FA status:', profileErr);
        // Continue with login even if 2FA check fails
      }
    }
    
    return { success: true };
  } catch (err) {
    console.error('Sign in error:', err);
    
    // Handle network errors
    if (err instanceof Error) {
      if (err.message.includes('fetch failed') || err.message.includes('ECONNRESET')) {
        return { error: 'Network connection error. Please check your internet connection and try again.' };
      }
      if (err.message.includes('timeout')) {
        return { error: 'Request timed out. Please try again.' };
      }
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }
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

export async function signInWithOAuth(provider: 'google'): Promise<{ url?: string; error?: string }> {
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
