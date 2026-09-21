import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Project credentials with live fallbacks
export const DEFAULT_SUPABASE_URL = 'https://htdqtqddlnhibfangxov.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZHF0cWRkbG5oaWJmYW5neG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MzQzMjYsImV4cCI6MjEwNTUxMDMyNn0.HXZVuLm6gRqEdHBBX4xcbgm7JeP_hX1g7uBIOq3B4k0';

export function getSupabaseUrl(): string {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_URL) ||
    (typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_URL) ||
    DEFAULT_SUPABASE_URL
  );
}

export function getSupabaseAnonKey(): string {
  return (
    (typeof import.meta !== 'undefined' && import.meta.env?.PUBLIC_SUPABASE_ANON_KEY) ||
    (typeof process !== 'undefined' && process.env?.PUBLIC_SUPABASE_ANON_KEY) ||
    DEFAULT_SUPABASE_ANON_KEY
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
