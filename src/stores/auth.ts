import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';
import type { Profile, UserRole } from '@/types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
  
  // Computed helpers
  getUserRole: () => UserRole | null;
  isVendor: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isLoading: true,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      
      setProfile: (profile) => set({ profile }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      clearAuth: () => set({ 
        user: null, 
        profile: null, 
        isAuthenticated: false,
        isLoading: false 
      }),
      
      getUserRole: () => {
        const { profile } = get();
        return profile?.role || null;
      },
      
      isVendor: () => {
        const { profile } = get();
        return profile?.role === 'vendor' || profile?.role === 'admin';
      },
      
      isAdmin: () => {
        const { profile } = get();
        return profile?.role === 'admin';
      },
    }),
    {
      name: 'shopthings-auth',
      partialize: (state) => ({
        // Only persist the user ID for rehydration, not the full user object
        // This is for security - we'll refetch user data on mount
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
