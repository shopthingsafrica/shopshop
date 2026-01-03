'use client';

import { createClient } from '@/lib/supabase/client';

export type OAuthProvider = 'google' | 'apple';

export async function signInWithGoogle() {
  return signInWithOAuth('google');
}

export async function signInWithApple() {
  return signInWithOAuth('apple');
}

async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error(`OAuth error with ${provider}:`, error.message);
    return { error: error.message };
  }

  // The browser will be redirected to the OAuth provider
  // No need to manually redirect as Supabase handles it
  return { url: data.url };
}
