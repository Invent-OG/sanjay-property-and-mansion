import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client utilizing the privileged SUPABASE_SERVICE_ROLE_KEY.
// This file is strictly for server-side endpoints and scripts. NEVER import into client-side components.

let serverClientInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClientInstance) return serverClientInstance;

  const url =
    (typeof process !== 'undefined' && (process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL)) ||
    (typeof import.meta !== 'undefined' && ((import.meta as any).env?.SUPABASE_URL || (import.meta as any).env?.PUBLIC_SUPABASE_URL)) ||
    '';

  const serviceRoleKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY) ||
    '';

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Supabase server configuration error: SUPABASE_URL (or PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables.'
    );
  }

  serverClientInstance = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClientInstance;
}
