import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  Bell,
  Sparkles,
  Bed,
  UtensilsCrossed,
  MapPin
} from 'lucide-react';
import { authService } from '../../services/authService';
import { BrandLogo } from '../BrandLogo';
import { QueryProvider } from '../common/QueryProvider';

interface AdminLayoutProps {
  currentPath: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  title,
  subtitle,
  breadcrumbs = [],
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>('admin@sanjayproperties.in');

  useEffect(() => {
    authService.getUser().then((user) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
  }, []);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of the Admin Panel?')) {
      await authService.signOut();
      window.location.href = '/admin/login';
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    {
      group: 'PROPERTY MANAGEMENT',
      items: [
        { label: 'Properties', href: '/admin/properties', icon: Building2 },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      group: 'CUSTOMERS & CRM',
      items: [
        { label: 'Leads & Enquiries', href: '/admin/leads', icon: Users }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { label: 'Settings & SEO', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const isActiveRoute = (href: string, exact: boolean = false) => {
    if (exact) {
      return currentPath === href || currentPath === href + '/';
    }
    return currentPath.startsWith(href);
  };

  return (
    <QueryProvider>
      <div className="min-h-screen bg-[#0f1115] text-neutral-100 flex flex-col antialiased selection:bg-[#FFCC00] selection:text-black">
      {/* Top Mobile Bar */}
      <header className="lg:hidden h-16 bg-[#16181e] border-b border-neutral-800/80 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm text-white">SANJAY ADMIN</span>
            <span className="text-[10px] bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/30 px-1.5 py-0.5 rounded font-bold">
              PORTAL
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-[#FFCC00] text-xs flex items-center gap-1"
            title="View Public Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-rose-400"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Desktop Sidebar & Mobile Drawer */}
        <aside
          className={`fixed lg:sticky top-0 lg:top-0 h-screen w-64 bg-[#14161b] border-r border-neutral-800/80 flex flex-col z-50 transition-transform duration-200 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Logo & Header */}
          <div className="h-18 px-6 border-b border-neutral-800/80 flex items-center justify-between">
            <a href="/admin" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-[#FFCC00]/40 flex items-center justify-center font-black text-sm text-[#FFCC00]">
                SP
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-wide leading-tight group-hover:text-[#FFCC00] transition-colors">
                  Sanjay Properties
                </span>
                <span className="text-[10px] text-neutral-400 font-medium tracking-wider uppercase">
                  Admin Dashboard
                </span>
              </div>
            </a>
            {mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
            {/* Dashboard Link */}
            <div>
              <a
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActiveRoute('/admin', true)
                    ? 'bg-[#FFCC00] text-black font-bold shadow-md shadow-[#FFCC00]/10'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </a>
            </div>

            {/* Groups */}
            {navItems.slice(1).map((section: any, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="px-3.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  {section.group}
                </div>
                <div className="space-y-1">
                  {section.items.map((item: any, itemIdx: number) => {
                    const active = isActiveRoute(item.href, item.exact);
                    const Icon = item.icon;
                    return (
                      <a
                        key={itemIdx}
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? 'bg-[#FFCC00] text-black font-bold shadow-md shadow-[#FFCC00]/10'
                            : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Public Website Preview Quicklink */}
            <div className="pt-4 border-t border-neutral-800/60">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold text-neutral-400 hover:text-[#FFCC00] hover:bg-neutral-800/40 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Public Site</span>
                </span>
                <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">Live</span>
              </a>
            </div>
          </div>

          {/* User Profile & Logout Bottom Bar */}
          <div className="p-4 border-t border-neutral-800/80 bg-[#111317]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-neutral-950 font-bold flex items-center justify-center shrink-0 text-sm">
                  {adminEmail.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">Admin</div>
                  <div className="text-[11px] text-neutral-400 truncate">{adminEmail}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/80 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar for Desktop */}
          <header className="hidden lg:flex h-18 bg-[#14161b]/90 backdrop-blur-md border-b border-neutral-800/80 px-8 items-center justify-between sticky top-0 z-30">
            <div>
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-0.5">
                  <a href="/admin" className="hover:text-white transition-colors">
                    Admin
                  </a>
                  {breadcrumbs.map((b, idx) => (
                    <React.Fragment key={idx}>
                      <ChevronRight className="w-3 h-3 text-neutral-600" />
                      {b.href ? (
                        <a href={b.href} className="hover:text-white transition-colors">
                          {b.label}
                        </a>
                      ) : (
                        <span className="text-neutral-200 font-medium">{b.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
              <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800/60 hover:bg-neutral-700/80 text-xs font-semibold text-neutral-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>Visit Public Website</span>
              </a>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {subtitle && (
              <div className="mb-6">
                <p className="text-xs sm:text-sm text-neutral-400">{subtitle}</p>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
      </div>
    </QueryProvider>
  );
};
