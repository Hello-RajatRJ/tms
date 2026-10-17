import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users2,
  CheckSquare2,
  Server,
  Menu,
  X,
  LogOut,
  Shield,
  Briefcase,
  User as UserIcon,
} from 'lucide-react';
import { checkHealth } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from './ThemeToggle';
import ProfileMenu from './ProfileMenu';

export const Sidebar: React.FC = () => {
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const pingServer = async () => {
      try {
        await checkHealth();
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 20000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team Members', path: '/team-members', icon: Users2 },
  ];

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: Shield,
          color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        };
      case 'manager':
        return {
          label: 'Manager',
          icon: Briefcase,
          color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        };
      case 'member':
      default:
        return {
          label: 'Member',
          icon: UserIcon,
          color: 'bg-[#E7F8F0] text-[#00A884] dark:bg-[#075E54]/40 dark:text-[#25D366] border-[#00A884]/30',
        };
    }
  };

  const roleInfo = getRoleBadge(user?.role);
  const RoleIcon = roleInfo.icon;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#111B21] border-r border-[#E9EDEF] dark:border-[#202C33] w-64 p-5 transition-colors duration-200">
      {/* Brand */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E9EDEF] dark:border-[#202C33] mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#075E54] via-[#128C7E] to-[#25D366] flex items-center justify-center text-white shadow-md shadow-[#00A884]/25">
            <CheckSquare2 className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#111B21] dark:text-[#E9EDEF] tracking-tight flex items-center gap-1.5">
              TMS <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7F8F0] dark:bg-[#075E54]/50 text-[#00A884] dark:text-[#25D366] font-extrabold tracking-wider border border-[#00A884]/20">TS</span>
            </h1>
            <p className="text-xs text-[#667781] dark:text-[#8696A0] font-medium">Task & Project Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle className="lg:hidden" />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-[#667781] hover:text-[#111B21] dark:hover:text-[#E9EDEF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-1.5">
        <p className="px-3 text-[11px] font-bold text-[#667781] dark:text-[#8696A0] uppercase tracking-wider mb-2">Main Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#00A884] text-white shadow-md shadow-[#00A884]/30'
                    : 'text-[#667781] dark:text-[#8696A0] hover:bg-[#F0F2F5] dark:hover:bg-[#202C33] hover:text-[#111B21] dark:hover:text-[#E9EDEF]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Dark / Light Theme Toggle Box */}
      <div className="py-2">
        <div className="p-3 bg-[#F0F2F5] dark:bg-[#202C33] rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] flex items-center justify-between shadow-2xs">
          <span className="text-xs font-semibold text-[#111B21] dark:text-[#E9EDEF]">Theme</span>
          <ThemeToggle />
        </div>
      </div>

      {/* User Session & Role Card with Logout */}
      {user && (
        <div className="pt-2 border-t border-[#E9EDEF] dark:border-[#202C33] space-y-2">
          <div className="p-3 bg-[#F0F2F5] dark:bg-[#202C33] rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#075E54] to-[#00A884] flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-[#111B21] dark:text-[#E9EDEF] truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${roleInfo.color}`}>
                    <RoleIcon className="w-2.5 h-2.5" />
                    {roleInfo.label}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-[#667781] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Backend Server Status Card */}
      <div className="pt-2">
        <div className="p-2.5 bg-[#F0F2F5] dark:bg-[#202C33] rounded-2xl border border-[#E9EDEF] dark:border-[#2A3942] flex items-center justify-between text-xs font-medium text-[#667781] dark:text-[#8696A0]">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-[#00A884]" />
            <span className="text-[11px] font-semibold">Backend API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                serverOnline === true
                  ? 'bg-[#25D366] shadow-sm shadow-[#25D366]/50 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-[10px] font-bold text-[#00A884]">
              {serverOnline ? 'Connected' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-[#111B21] border-b border-[#E9EDEF] dark:border-[#202C33] sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#075E54] to-[#25D366] flex items-center justify-center text-white shadow-xs">
            <CheckSquare2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-bold text-[#111B21] dark:text-[#E9EDEF]">TMS</span>
        </div>
        <div className="flex items-center gap-2">
          <ProfileMenu />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#667781] dark:text-[#8696A0] rounded-xl hover:bg-[#F0F2F5] dark:hover:bg-[#202C33]"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-0 h-screen z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50 animate-fade-in">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
