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
  }
};
