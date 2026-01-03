'use client';

import { useEffect, createContext, useContext, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth';
import { User } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { 
    user, 
    profile, 
    isLoading, 
    isAuthenticated, 
    setUser, 
    setProfile, 
    setLoading,
    clearAuth 
  } = useAuthStore();

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      setProfile(data);
    }
  }, [setProfile]);

  const refreshAuth = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      setUser(user);
      await fetchProfile(user.id);
    } else {
      clearAuth();
    }
  }, [setUser, clearAuth, fetchProfile]);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          await fetchProfile(user.id);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          clearAuth();
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        } else if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, clearAuth, fetchProfile]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      isLoading, 
      isAuthenticated,
      refreshAuth 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
