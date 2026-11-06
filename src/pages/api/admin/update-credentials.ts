import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseServerClient } from '../../../lib/supabaseServer';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Unauthorized. An active administrator session token is required.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Validate current user via Supabase Server Client
    let serverClient;
    try {
      serverClient = getSupabaseServerClient();
    } catch (err: any) {
      console.error('Failed to initialize Supabase server client:', err);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server authentication configuration is missing or invalid.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const {
      data: { user },
      error: userError
    } = await serverClient.auth.getUser(token);

    if (userError || !user || !user.email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Your administrator session has expired or is invalid. Please sign in again.'
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Parse and validate body payload
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid request body.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { currentPassword, newEmail, newPassword } = body;

    // Current password is strictly required to verify identity before making changes
    if (!currentPassword || typeof currentPassword !== 'string' || !currentPassword.trim()) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Your current administrator password is required to authorize this change.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verify current password by testing authentication
    const supabaseUrl =
      process.env.SUPABASE_URL ||
      process.env.PUBLIC_SUPABASE_URL ||
      (typeof import.meta !== 'undefined' && ((import.meta as any).env?.SUPABASE_URL || (import.meta as any).env?.PUBLIC_SUPABASE_URL)) ||
      '';
    const supabaseAnonKey =
      process.env.SUPABASE_ANON_KEY ||
      process.env.PUBLIC_SUPABASE_ANON_KEY ||
      (typeof import.meta !== 'undefined' && ((import.meta as any).env?.SUPABASE_ANON_KEY || (import.meta as any).env?.PUBLIC_SUPABASE_ANON_KEY)) ||
      '';

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Supabase authentication environment variables are missing.'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const verifyClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error: signInError } = await verifyClient.auth.signInWithPassword({
      email: user.email,
      password: currentPassword.trim()
    });

    if (signInError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'The current password you entered is incorrect. Please verify and try again.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 5. Validate new credentials
    const trimmedNewEmail = typeof newEmail === 'string' && newEmail.trim() ? newEmail.trim().toLowerCase() : null;
    const trimmedNewPassword = typeof newPassword === 'string' && newPassword.trim() ? newPassword.trim() : null;

    if (!trimmedNewEmail && !trimmedNewPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Please provide a new email address or a new password to update.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updateAttrs: {
      email?: string;
      email_confirm?: boolean;
      password?: string;
    } = {};

    let emailChanged = false;
    let passwordChanged = false;

    if (trimmedNewEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedNewEmail)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'The new email address format is invalid.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (trimmedNewEmail === user.email.toLowerCase()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'The new email address cannot be the same as your current email.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      updateAttrs.email = trimmedNewEmail;
      // Auto-confirm the new email so the administrator is not locked out by unconfigured SMTP
      updateAttrs.email_confirm = true;
      emailChanged = true;
    }

    if (trimmedNewPassword) {
      if (trimmedNewPassword.length < 6) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'The new password must be at least 6 characters long.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (trimmedNewPassword === currentPassword.trim()) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'The new password cannot be the same as your current password.'
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      updateAttrs.password = trimmedNewPassword;
      passwordChanged = true;
    }

    // 6. Update user via Supabase Admin API
    const { data: updatedUserData, error: updateError } = await serverClient.auth.admin.updateUserById(
      user.id,
      updateAttrs
    );

    if (updateError || !updatedUserData?.user) {
      console.error('Error updating user credentials:', updateError);
      return new Response(
        JSON.stringify({
          success: false,
          error: updateError?.message || 'Failed to update admin credentials in database.'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compose user-friendly message
    let message = 'Credentials updated successfully!';
    if (emailChanged && passwordChanged) {
      message = `Admin email updated to ${trimmedNewEmail} and password changed successfully!`;
    } else if (emailChanged) {
      message = `Admin email updated successfully to ${trimmedNewEmail}.`;
    } else if (passwordChanged) {
      message = 'Admin password changed successfully!';
    }

    return new Response(
      JSON.stringify({
        success: true,
        message,
        emailChanged,
        passwordChanged,
        user: {
          id: updatedUserData.user.id,
          email: updatedUserData.user.email
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Unexpected error in update-credentials endpoint:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'An unexpected error occurred while updating admin credentials.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

