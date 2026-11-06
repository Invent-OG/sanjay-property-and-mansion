import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isMockAdmin?: boolean;
}

const customListeners: Array<(session: Session | null) => void> = [];

export const authService = {
  notifyAuthChange(session: Session | null) {
    customListeners.forEach((callback) => {
      try {
        callback(session);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    });
  },

  async getSession(): Promise<Session | null> {
    // 1. Check local admin session first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sanjay_admin_session') || localStorage.getItem('sanjay_mock_admin_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.user || parsed.access_token)) {
            return parsed as Session;
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    // 2. Check Supabase client session
    const client = getSupabaseClient();
    if (!client) {
      return null;
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error) {
        console.error('Error fetching Supabase session:', error);
        return null;
      }
      return data.session;
    } catch (err) {
      console.error('Session retrieval failure:', err);
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    const session = await this.getSession();
    return session?.user || null;
  },

  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // 1. Attempt login via our server API endpoint (validates against the 'users' database table)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success && data.user) {
        const sessionPayload = {
          access_token: data.token || 'admin_token_' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600 * 24 * 7,
          expires_at: Math.floor(Date.now() / 1000) + 3600 * 24 * 7,
          refresh_token: 'refresh_' + Date.now(),
          user: {
            id: data.user.id,
            email: data.user.email,
            user_metadata: { name: data.user.name, role: data.user.role },
            app_metadata: { role: data.user.role },
            aud: 'authenticated',
            created_at: new Date().toISOString()
          }
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem('sanjay_admin_session', JSON.stringify(sessionPayload));
        }

        this.notifyAuthChange(sessionPayload as unknown as Session);
        return { user: sessionPayload.user as unknown as User, error: null };
      } else if (data.error && response.status === 401) {
        return { user: null, error: data.error };
      }
    } catch (apiErr) {
      console.warn('API login attempt notice:', apiErr);
    }

    // 2. Fallback: Authenticate via Supabase Auth directly
    const client = getSupabaseClient();
    if (!client) {
      return {
        user: null,
        error: 'Authentication client is not configured. Please verify environment settings.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword
      });

      if (error) {
        return { user: null, error: error.message };
      }

      this.notifyAuthChange(data.session);
      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication failed. Please check your credentials.' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sanjay_admin_session');
      localStorage.removeItem('sanjay_mock_admin_session');
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err: any) {
        console.warn('Supabase signout warning:', err);
      }
    }

    this.notifyAuthChange(null);
    return { error: null };
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    customListeners.push(callback);

    const client = getSupabaseClient();
    let supabaseUnsubscribe = () => {};

    if (client) {
      const { data } = client.auth.onAuthStateChange((_event, session) => {
        callback(session);
      });
      supabaseUnsubscribe = () => data.subscription.unsubscribe();
    } else {
      this.getSession().then((s) => callback(s));
    }

    return () => {
      const idx = customListeners.indexOf(callback);
      if (idx !== -1) customListeners.splice(idx, 1);
      supabaseUnsubscribe();
    };
  },

  /**
   * Update administrative credentials (email, password, or both).
   * Verifies current password on server before applying changes.
   * Auto-refreshes current session upon success.
   */
  async updateCredentials(params: {
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
  }): Promise<{
    success: boolean;
    message: string;
    error: string | null;
    user?: { id: string; email?: string } | null;
  }> {
    const session = await this.getSession();
    const token = session?.access_token || 'active_token';

    try {
      const response = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(params)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: '',
          error: data.error || 'Failed to update credentials. Please check your current password.'
        };
      }

      // Automatically re-authenticate client session in the background
      const targetEmail = params.newEmail?.trim().toLowerCase() || session?.user?.email || '';
      const targetPassword = params.newPassword || params.currentPassword;
      if (targetEmail && targetPassword) {
        try {
          await this.signIn(targetEmail, targetPassword);
        } catch (reAuthErr) {
          console.warn('Re-authentication after credential update warning:', reAuthErr);
        }
      }

      return {
        success: true,
        message: data.message || 'Credentials updated successfully!',
        error: null,
        user: data.user || null
      };
    } catch (err: any) {
      console.error('Update credentials failure:', err);
      return {
        success: false,
        message: '',
        error: err.message || 'Network error occurred while updating credentials.'
      };
    }
  },

  async updateEmail(newEmail: string, currentPassword: string) {
    return this.updateCredentials({ currentPassword, newEmail });
  },

  async updatePassword(newPassword: string, currentPassword: string) {
    return this.updateCredentials({ currentPassword, newPassword });
  }
};
