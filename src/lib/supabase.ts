import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseUrl(): string {
  return (
    (typeof import.meta !== 'undefined' && ((import.meta as any).env?.PUBLIC_SUPABASE_URL || (import.meta as any).env?.SUPABASE_URL)) ||
    (typeof process !== 'undefined' && (process.env?.PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
    ''
  );
}

export function getSupabaseAnonKey(): string {
  return (
    (typeof import.meta !== 'undefined' && ((import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY || (import.meta as any).env?.SUPABASE_ANON_KEY)) ||
    (typeof process !== 'undefined' && (process.env?.PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
    ''
  );
}

export const isSupabaseConfigured = (): boolean => {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
    key &&
    url !== 'https://your-project.supabase.co' &&
    key !== 'your-anon-key'
  );
};

// Singleton Supabase Client
let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'sanjay_supabase_auth_token'
      }
    });
  }
  return clientInstance;
}

export const supabase = getSupabaseClient();
