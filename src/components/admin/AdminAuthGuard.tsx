import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const session = await authService.getSession();
      if (!isMounted) return;

      if (!session) {
        setIsAuthenticated(false);
        // Redirect to login preserving current route for post-login redirect
        const currentUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/admin/login?redirect=${currentUrl}`;
      } else {
        setIsAuthenticated(true);
      }
    }

    checkAuth();

    const unsubscribe = authService.onAuthStateChange((session) => {
      if (!session) {
        setIsAuthenticated(false);
        window.location.href = '/admin/login';
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0f1115] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-[#FFCC00]/40 flex items-center justify-center font-black text-base text-[#FFCC00] animate-pulse">
            SP
          </div>
          <div className="text-center">
            <h3 className="text-sm font-bold text-white tracking-wide">Authenticating Admin Session</h3>
            <p className="text-xs text-neutral-400 mt-1">Verifying credentials with Supabase...</p>
          </div>
          <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden mt-2">
            <div className="w-1/2 h-full bg-[#FFCC00] rounded-full animate-indeterminate" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
