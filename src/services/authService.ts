import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isMockAdmin?: boolean;
}

export const authService = {
  async getSession(): Promise<Session | null> {
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
    const client = getSupabaseClient();
    if (!client) {
      return {
        user: null,
        error: 'Authentication client is not configured. Please verify environment settings.'
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (error) {
        return { user: null, error: error.message };
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Authentication failed. Please check your credentials.' };
    }
  },

  async signOut(): Promise<{ error: string | null }> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sanjay_mock_admin_session');
    }

    const client = getSupabaseClient();
    if (!client) {
      return { error: null };
    }

    try {
      const { error } = await client.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error signing out' };
    }
  },

  onAuthStateChange(callback: (session: Session | null) => void): () => void {
    const client = getSupabaseClient();
    if (!client) {
      // If running without Supabase, check local mock session once
      this.getSession().then((s) => callback(s));
      return () => {};
    }

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });

    return () => {
      data.subscription.unsubscribe();
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
    if (!session || !session.access_token) {
      return {
        success: false,
        message: '',
        error: 'You must be signed in as an administrator to change credentials.'
      };
    }

    try {
      const response = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
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
      const targetEmail = params.newEmail?.trim().toLowerCase() || session.user?.email || '';
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
