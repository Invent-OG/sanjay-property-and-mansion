import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/authService';
import { isSupabaseConfigured } from '../../lib/supabase';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [supabaseReady, setSupabaseReady] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    authService.getSession().then((session) => {
      if (session) {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || '/admin';
        window.location.href = redirect;
      }
    });

    setSupabaseReady(isSupabaseConfigured());
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user, error } = await authService.signIn(email, password);

      if (error || !user) {
        if (error?.toLowerCase().includes('invalid login credentials')) {
          setErrorMsg('Invalid login credentials. Please ensure you have created this admin user in your Supabase Dashboard (Authentication → Users → Add User → Auto Confirm: ON).');
        } else {
          setErrorMsg(error || 'Invalid email or password.');
        }
        setIsLoading(false);
        return;
      }

      // Success -> Redirect to dashboard
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/admin';
      window.location.href = redirect;
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-neutral-800/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#15171d] border border-neutral-700/80 shadow-xl mb-4 text-[#FFCC00] font-black text-xl">
            SP
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Sanjay Properties</h2>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-semibold">
            Administrative Control Panel
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-[#15171e] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {!supabaseReady && (
            <div className="mb-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold block">Developer Preview Mode Active</span>
                <span>You can log in with <strong className="text-white">admin@sanjayproperties.in</strong> and any password (6+ chars). Connect Supabase in `.env` to enable production authentication.</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sanjayproperties.in"
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0f13] border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#0d0f13] border border-neutral-700/80 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 bg-[#FFCC00] hover:bg-[#e6b800] text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#FFCC00]/15 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>LOGIN</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
            <a href="/" className="hover:text-white transition-colors">
              ← Return to public website
            </a>
            <span className="text-[11px] text-neutral-500">Protected by Supabase Auth</span>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-neutral-400">
          © {new Date().getFullYear()} Sanjay Properties. All rights reserved.
        </div>
      </div>
    </div>
  );
};
