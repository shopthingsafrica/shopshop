import { createBrowserClient, SupabaseClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

let client: SupabaseClient<Database> | undefined;

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase credentials. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    );
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

export function createClient() {
  if (client) {
    return client;
  }
  
  client = createSupabaseClient();
  return client;
}
