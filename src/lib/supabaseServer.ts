import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Server-side Supabase client utilizing the privileged SUPABASE_SERVICE_ROLE_KEY.
// This file is strictly for server-side endpoints and scripts. NEVER import into client-side components.

let serverClientInstance: SupabaseClient | null = null;

export const DEFAULT_SUPABASE_SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZHF0cWRkbG5oaWJmYW5neG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTkzNDMyNiwiZXhwIjoyMTA1NTEwMzI2fQ.8cexQNT3kzK5Mn_d-KSdFNqEypDa-8ouV4STVcMbqY4';

export function getSupabaseServerClient(): SupabaseClient {
  if (serverClientInstance) return serverClientInstance;

  const url =
    (typeof process !== 'undefined' && process.env.PUBLIC_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.PUBLIC_SUPABASE_URL) ||
    'https://htdqtqddlnhibfangxov.supabase.co';

  const serviceRoleKey =
    (typeof process !== 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.SUPABASE_SERVICE_ROLE_KEY) ||
    DEFAULT_SUPABASE_SERVICE_ROLE_KEY;

  serverClientInstance = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return serverClientInstance;
}
