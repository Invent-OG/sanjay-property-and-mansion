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
  MapPin,
  FileText,
  PhoneCall,
  ChevronDown
} from 'lucide-react';
import { authService } from '../../services/authService';
import { QueryProvider } from '../common/QueryProvider';
import { AdminDashboardHome } from './AdminDashboardHome';
import { AdminPropertiesList } from './AdminPropertiesList';
import { AdminPropertyEditor } from './AdminPropertyEditor';
import { AdminLeadsManager } from './AdminLeadsManager';
import { AdminJustdialLeadsManager } from './AdminJustdialLeadsManager';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminSettings } from './AdminSettings';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';

// Western Stay Business Components
import { WesternStayDashboard } from './western-stay/WesternStayDashboard';
import { WesternStayRooms } from './western-stay/WesternStayRooms';
import { WesternStayRoomTypes } from './western-stay/WesternStayRoomTypes';
import { WesternStayOccupants } from './western-stay/WesternStayOccupants';
import { WesternStayFacilities } from './western-stay/WesternStayFacilities';
import { WesternStayMeals } from './western-stay/WesternStayMeals';
import { WesternStayGallery } from './western-stay/WesternStayGallery';
import { WesternStayEnquiries } from './western-stay/WesternStayEnquiries';
import { WesternStaySettings } from './western-stay/WesternStaySettings';

export interface AdminNavContextType {
  activePath: string;
  navigateTo: (href: string) => void;
}

export const AdminNavContext = React.createContext<AdminNavContextType>({
  activePath: '/admin',
  navigateTo: () => {}
});

export const useAdminNav = () => React.useContext(AdminNavContext);

interface AdminLayoutProps {
  currentPath: string;
  title?: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
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

  const [activePath, setActivePath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || currentPath;
    }
    return currentPath;
  });

  useEffect(() => {
    authService.getUser().then((user) => {
      if (user?.email) {
        setAdminEmail(user.email);
      }
    });
  }, []);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActivePath(window.location.pathname || '/admin');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (href: string) => {
    if (href.startsWith('/admin')) {
      window.history.pushState(null, '', href);
      setActivePath(href);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out of the Admin Panel?')) {
      await authService.signOut();
      window.location.href = '/admin/login';
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    {
      group: 'WESTERN STAY HOSTEL',
      items: [
        { label: 'Hostel Dashboard', href: '/admin/western-stay', icon: LayoutDashboard, exact: true },
        { label: 'Room Inventory', href: '/admin/western-stay/rooms', icon: Bed },
        { label: 'Tariffs & Room Types', href: '/admin/western-stay/room-types', icon: Building2 },
        { label: 'Residents Directory', href: '/admin/western-stay/occupants', icon: Users },
        { label: 'Facilities & Amenities', href: '/admin/western-stay/facilities', icon: Sparkles },
        { label: 'Dining & Weekly Menu', href: '/admin/western-stay/meals', icon: UtensilsCrossed },
        { label: 'Photo Gallery', href: '/admin/western-stay/gallery', icon: ImageIcon },
        { label: 'Room Inquiries CRM', href: '/admin/western-stay/enquiries', icon: Bell },
        { label: 'Hostel Profile & Map', href: '/admin/western-stay/settings', icon: MapPin }
      ]
    },
    {
      group: 'LEADS',
      items: [
        { label: 'Website Leads', href: '/admin/leads', icon: Users, exact: true },
        { label: 'Justdial Leads', href: '/admin/leads/justdial', icon: PhoneCall, exact: true }
      ]
    },
    {
      group: 'REAL ESTATE PROPERTIES',
      items: [
        { label: 'Property Listings', href: '/admin/properties', icon: Building2 },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon }
      ]
    },
    {
      group: 'SYSTEM & SETTINGS',
      items: [
        { label: 'Site Settings & SEO', href: '/admin/settings', icon: Settings }
      ]
    }
  ];

  const cleanActive = activePath.split('?')[0].replace(/\/$/, '') || '/admin';

  const isActiveRoute = (href: string, exact: boolean = false) => {
    const cleanHref = href.replace(/\/$/, '') || '/admin';
    if (exact) {
      return cleanActive === cleanHref;
    }
    return cleanActive.startsWith(cleanHref);
  };

  // Determine dynamic title, subtitle, and breadcrumbs based on activePath
  const getRouteMeta = () => {
    if (cleanActive === '/admin') {
      return {
        title: 'Dashboard Overview',
        subtitle: 'Unified operational metrics across Western Stay Hostel and Sanjay Properties Real Estate',
        breadcrumbs: []
      };
    }

    // Western Stay Routes
    if (cleanActive === '/admin/western-stay') {
      return {
        title: 'Western Stay Overview',
        subtitle: 'Live occupancy, room inventory status, bookings, and resident revenue',
        breadcrumbs: [{ label: 'Western Stay' }]
      };
    }
    if (cleanActive === '/admin/western-stay/rooms') {
      return {
        title: 'Room Inventory Management',
        subtitle: 'Add, update status, and manage physical rooms across Ground, 1st, and 2nd floors',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Rooms' }]
      };
    }
    if (cleanActive === '/admin/western-stay/room-types') {
      return {
        title: 'Room Types & Tariffs',
        subtitle: 'Configure Single, 2-Sharing, and 4-Sharing pricing, AC surcharges, and deposit',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Room Types' }]
      };
    }
    if (cleanActive === '/admin/western-stay/occupants') {
      return {
        title: 'Occupants & Resident Directory',
        subtitle: 'Private directory of current residents, room assignments, dues, and check-in records',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Occupants' }]
      };
    }
    if (cleanActive === '/admin/western-stay/facilities') {
      return {
        title: 'Hostel Facilities & Amenities',
        subtitle: 'Manage Wi-Fi, solar hot water, RO drinking water, and other resident amenities',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Facilities' }]
      };
    }
    if (cleanActive === '/admin/western-stay/meals') {
      return {
        title: 'Meals & Weekly Dining Menu',
        subtitle: 'Homestyle meal plans, subscription rates, and 7-day breakfast, lunch, and dinner menu',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Meals & Menu' }]
      };
    }
    if (cleanActive === '/admin/western-stay/gallery') {
      return {
        title: 'Hostel Photo Gallery',
        subtitle: 'Manage property exterior, bedroom, dining, and campus photos',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Gallery' }]
      };
    }
    if (cleanActive === '/admin/western-stay/enquiries') {
      return {
        title: 'Western Stay Room Enquiries',
        subtitle: 'Track guest leads, preferred sharing types, and follow-up via Call / WhatsApp',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Enquiries' }]
      };
    }
    if (cleanActive === '/admin/western-stay/settings') {
      return {
        title: 'Western Stay Hostel Settings',
        subtitle: 'Hostel contact phone numbers, reception details, and Google Maps embed',
        breadcrumbs: [{ label: 'Western Stay', href: '/admin/western-stay' }, { label: 'Settings' }]
      };
    }

    // Real Estate Routes
    if (cleanActive === '/admin/properties') {
      return {
        title: 'Real Estate Property Listings',
        subtitle: 'Manage plots, lands, villas, and commercial property listings for Sanjay Properties',
        breadcrumbs: [{ label: 'Properties' }]
      };
    }
    if (cleanActive === '/admin/properties/new') {
      return {
        title: 'Add New Property Listing',
        subtitle: 'Create a new real estate plot or residential project listing',
        breadcrumbs: [{ label: 'Properties', href: '/admin/properties' }, { label: 'New Property' }]
      };
    }
    if (cleanActive.startsWith('/admin/properties/')) {
      return {
        title: 'Property Editor',
        subtitle: 'Modify plots, pricing, legal approvals, layout specifications, and photos',
        breadcrumbs: [{ label: 'Properties', href: '/admin/properties' }, { label: 'Editor' }]
      };
    }
    if (cleanActive === '/admin/leads') {
      return {
        title: 'Website Inquiries & Leads',
        subtitle: 'View land, plot, and hostel inquiries from website modals, call prospects directly, and send WhatsApp messages',
        breadcrumbs: [{ label: 'Website Leads' }]
      };
    }
    if (cleanActive === '/admin/leads/justdial') {
      return {
        title: 'Justdial Leads Pipeline',
        subtitle: 'Real-time inbound telephony leads ingested from Justdial campaigns',
        breadcrumbs: [{ label: 'Leads', href: '/admin/leads' }, { label: 'Justdial Leads' }]
      };
    }
    if (cleanActive === '/admin/media') {
      return {
        title: 'Media Library',
        subtitle: 'Upload, organize, and manage image assets and public URLs',
        breadcrumbs: [{ label: 'Media Library' }]
      };
    }
    if (cleanActive === '/admin/settings') {
      return {
        title: 'Site Settings & SEO',
        subtitle: 'Manage global Sanjay Properties contact details and default SEO tags',
        breadcrumbs: [{ label: 'Settings & SEO' }]
      };
    }

    return {
      title: title || 'Admin Panel',
      subtitle: subtitle || '',
      breadcrumbs: breadcrumbs || []
    };
  };

  const currentMeta = getRouteMeta();

  // Render view corresponding to the activePath (enables zero-reload SPA navigation)
  const renderActiveView = () => {
    if (cleanActive === '/admin') {
      return <AdminDashboardHome />;
    }

    // Western Stay Views
    if (cleanActive === '/admin/western-stay') {
      return <WesternStayDashboard />;
    }
    if (cleanActive === '/admin/western-stay/rooms') {
      return <WesternStayRooms />;
    }
    if (cleanActive === '/admin/western-stay/room-types') {
      return <WesternStayRoomTypes />;
    }
    if (cleanActive === '/admin/western-stay/occupants') {
      return <WesternStayOccupants />;
    }
    if (cleanActive === '/admin/western-stay/facilities') {
      return <WesternStayFacilities />;
    }
    if (cleanActive === '/admin/western-stay/meals') {
      return <WesternStayMeals />;
    }
    if (cleanActive === '/admin/western-stay/gallery') {
      return <WesternStayGallery />;
    }
    if (cleanActive === '/admin/western-stay/enquiries') {
      return <WesternStayEnquiries />;
    }
    if (cleanActive === '/admin/western-stay/settings') {
      return <WesternStaySettings />;
    }

    // Real Estate Views
    if (cleanActive === '/admin/properties') {
      return <AdminPropertiesList />;
    }
    if (cleanActive === '/admin/properties/new') {
      return <AdminPropertyEditor propertyId="new" />;
    }
    if (cleanActive.startsWith('/admin/properties/')) {
      const idOrSlug = cleanActive.replace('/admin/properties/', '');
      return <AdminPropertyEditor propertyId={idOrSlug} />;
    }
    if (cleanActive === '/admin/leads') {
      return <AdminLeadsManager />;
    }
    if (cleanActive === '/admin/leads/justdial') {
      return <AdminJustdialLeadsManager />;
    }
    if (cleanActive === '/admin/media') {
      return <AdminMediaLibrary />;
    }
    if (cleanActive === '/admin/settings') {
      return <AdminSettings />;
    }

    return children;
  };

  return (
    <QueryProvider>
      <AdminNavContext.Provider value={{ activePath, navigateTo }}>
        <div className="admin-root min-h-screen bg-[#090a0d] text-neutral-100 flex flex-col antialiased selection:bg-[#FFCC00] selection:text-black">
          {/* Top Mobile Bar */}
          <header className="lg:hidden h-14 bg-[#0e1015] border-b border-neutral-800/60 px-4 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wide text-xs text-white">SANJAY ADMIN</span>
                <Badge variant="warning" className="text-[9px] font-mono font-bold px-1.5 py-0.2">
                  v2.0
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                asChild
              >
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View Public Website"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#FFCC00]" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleLogout}
                className="hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </header>

          <div className="flex-1 flex">
            {/* Desktop Sidebar & Mobile Drawer */}
            <aside
              className={`fixed lg:sticky top-0 lg:top-0 h-screen w-64 bg-[#0e1015] border-r border-neutral-800/60 flex flex-col z-50 transition-transform duration-200 ${
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              {/* Logo & Header */}
              <div className="h-14 px-5 border-b border-neutral-800/60 flex items-center justify-between">
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/admin');
                  }}
                  className="flex items-center gap-2.5 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-amber-500/30 flex items-center justify-center font-black text-xs text-[#FFCC00] shadow-sm">
                    SP
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-white tracking-wide leading-tight group-hover:text-[#FFCC00] transition-colors">
                      Sanjay Properties
                    </span>
                    <span className="text-[9px] text-neutral-500 font-medium tracking-wider uppercase">
                      Admin Control
                    </span>
                  </div>
                </a>
                {mobileMenuOpen && (
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="lg:hidden text-neutral-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {/* Overview Link */}
                <div>
                  <a
                    href="/admin"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/admin');
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isActiveRoute('/admin', true)
                        ? 'bg-neutral-800/90 text-white font-semibold border border-neutral-700/60 shadow-sm relative pl-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#FFCC00]'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850/50 font-medium'
                    }`}
                  >
                    <LayoutDashboard className={`w-4 h-4 ${isActiveRoute('/admin', true) ? 'text-[#FFCC00]' : 'text-neutral-400'}`} />
                    <span>Overview</span>
                  </a>
                </div>

                {/* Groups */}
                {navItems.slice(1).map((section: any, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                      {section.group}
                    </div>
                    <div className="space-y-0.5">
                      {section.items.map((item: any, itemIdx: number) => {
                        const active = isActiveRoute(item.href, item.exact);
                        const Icon = item.icon;
                        return (
                          <a
                            key={itemIdx}
                            href={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              navigateTo(item.href);
                            }}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                              active
                                ? 'bg-neutral-800/90 text-white font-semibold border border-neutral-700/60 shadow-sm relative pl-3.5 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-1 before:rounded-full before:bg-[#FFCC00]'
                                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-850/50 font-medium'
                            }`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[#FFCC00]' : 'text-neutral-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* User Profile & Logout */}
              <div className="p-3.5 border-t border-neutral-800/60 bg-[#0b0c10]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative">
                      <Avatar fallback="A" className="w-8 h-8 bg-neutral-900 border border-neutral-700/80 text-[11px] font-bold text-[#FFCC00]" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0b0c10]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-neutral-200 truncate">Administrator</span>
                      <span className="text-[10px] text-neutral-500 truncate">{adminEmail}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </aside>

            {/* Mobile backdrop */}
            {mobileMenuOpen && (
              <div
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
              />
            )}

            {/* Main Content Area with Link Interception for Instant Navigation */}
            <div
              className="flex-1 flex flex-col min-w-0"
              onClick={(e) => {
                const anchor = (e.target as HTMLElement).closest('a');
                if (!anchor) return;
                const href = anchor.getAttribute('href');
                const target = anchor.getAttribute('target');
                const download = anchor.getAttribute('download');
                if (href && href.startsWith('/admin') && !target && !download) {
                  e.preventDefault();
                  navigateTo(href);
                }
              }}
            >
              {/* Top Bar for Desktop */}
              <header className="hidden lg:flex h-14 bg-[#0e1015]/80 backdrop-blur-md border-b border-neutral-800/60 px-8 items-center justify-between sticky top-0 z-30">
                <div className="flex items-center gap-3">
                  {currentMeta.breadcrumbs.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <a
                        href="/admin"
                        onClick={(e) => {
                          e.preventDefault();
                          navigateTo('/admin');
                        }}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Admin
                      </a>
                      {currentMeta.breadcrumbs.map((b, idx) => (
                        <React.Fragment key={idx}>
                          <ChevronRight className="w-3 h-3 text-neutral-600" />
                          {b.href ? (
                            <a
                              href={b.href}
                              onClick={(e) => {
                                e.preventDefault();
                                navigateTo(b.href!);
                              }}
                              className="hover:text-white transition-colors cursor-pointer"
                            >
                              {b.label}
                            </a>
                          ) : (
                            <span className="text-neutral-200 font-medium">{b.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) : (
                    <h1 className="text-sm font-semibold text-white tracking-wide">{currentMeta.title}</h1>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="success" className="hidden sm:inline-flex gap-1.5 normal-case font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>System Online</span>
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                      <span>View Site</span>
                    </a>
                  </Button>

                  {/* Profile Dropdown Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 gap-2 text-xs hover:bg-neutral-800 border border-neutral-800"
                      >
                        <div className="relative">
                          <Avatar fallback="A" className="w-5 h-5 bg-neutral-900 border border-neutral-700/80 text-[10px] font-bold text-[#FFCC00]" />
                          <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-neutral-900" />
                        </div>
                        <span className="hidden sm:inline font-medium text-neutral-200">Admin</span>
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-xs font-semibold text-white leading-none">Administrator</p>
                          <p className="text-[10px] text-neutral-400 leading-none truncate">{adminEmail}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigateTo('/admin/settings')}>
                        <Settings className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                        <span>Site Settings &amp; SEO</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open('/', '_blank')}>
                        <ExternalLink className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                        <span>View Public Website</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem destructive onClick={handleLogout}>
                        <LogOut className="w-3.5 h-3.5 mr-2 text-rose-400" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              {/* Body Content */}
              <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {renderActiveView()}
              </main>
            </div>
          </div>
        </div>
      </AdminNavContext.Provider>
    </QueryProvider>
  );
};
