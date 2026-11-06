import type { APIRoute } from 'astro';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';
import { getSupabaseUrl, getSupabaseAnonKey } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { verifyPassword, generateSessionToken } from '../../../lib/authCrypto';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid login request body.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password } = body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and password are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Attempt authentication against the 'users' database table
    try {
      const serverClient = getSupabaseServerClient();
      const { data: dbUser, error: dbError } = await serverClient
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('is_active', true)
        .maybeSingle();

      if (dbUser && dbUser.password_hash) {
        const isMatch = await verifyPassword(cleanPassword, dbUser.password_hash);
        if (isMatch) {
          // Update last login timestamp
          await serverClient
            .from('users')
            .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq('id', dbUser.id);

          const token = generateSessionToken();

          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name || 'Administrator',
                role: dbUser.role || 'admin'
              },
              token
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } else {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid email or password.' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (dbErr) {
      console.warn('Database users table verification notice:', dbErr);
    }

    // 2. Fallback: Authenticate via Supabase Auth
    try {
      const supabaseUrl = getSupabaseUrl();
      const anonKey = getSupabaseAnonKey();
      if (supabaseUrl && anonKey) {
        const anonClient = createClient(supabaseUrl, anonKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });

        const { data: authData, error: authErr } = await anonClient.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword
        });

        if (!authErr && authData?.user && authData?.session) {
          return new Response(
            JSON.stringify({
              success: true,
              user: {
                id: authData.user.id,
                email: authData.user.email,
                name: (authData.user.user_metadata as any)?.name || 'Administrator',
                role: 'admin'
              },
              token: authData.session.access_token
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    } catch (authErr) {
      console.warn('Supabase Auth verification notice:', authErr);
    }

    // 3. Fallback for initial default admin credentials if DB table is pending migration
    if (
      cleanEmail === 'admin@sanjayproperties.in' &&
      (cleanPassword === 'AdminPassword@123' || cleanPassword === 'SanjayAdmin@2026')
    ) {
      const fallbackToken = generateSessionToken();
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: 'default-admin-uuid',
            email: 'admin@sanjayproperties.in',
            name: 'Administrator',
            role: 'superadmin'
          },
          token: fallbackToken
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid login credentials. Please check your email and password.'
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Login error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'An unexpected error occurred during login.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

